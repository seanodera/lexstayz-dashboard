import {createAsyncThunk} from "@reduxjs/toolkit";
import {doc, getDoc, runTransaction, writeBatch} from "@firebase/firestore";
import {firestore} from "@/lib/firebase";
import {refundBooking} from "@/data/bookingsData";
import {Booking, Home, Hotel, Room} from "@/lib/types";
import {getCurrentUser} from "@/data/hotelsData";
import {getServerTime} from "@/lib/utils";
import {arrayUnion} from "firebase/firestore";
import {addDays, isBefore, isEqual } from "date-fns";
import {updateBookingStatusAsyncOld, updateHostBalance} from "@/slices/bookingThunks/updateBookingStatusAsync";
import fetchStatistics from "@/slices/bookingThunks/fetchStatistics";


export const updateBookingStatusAsync = createAsyncThunk('"booking/updateStatus",',
    async ({status, booking}: { status: "Pending" | "Confirmed" | "Canceled" | "Rejected" | "Completed"; booking: Booking },
           {getState, rejectWithValue, dispatch}) => {
try {
    const serverDate = await getServerTime();
    const user = getCurrentUser()
    const batch = writeBatch(firestore);
    const bookingRef = doc(firestore, "bookings", booking.id);
    const hostRef = doc(firestore, "hosts", booking.hostId);
    const hostTransaction = doc(firestore, "hosts", booking.hostId, "pendingTransactions", booking.id);
    const stayRef = doc(firestore, "stays", booking.accommodationId);

    if (booking.status === status){
        return { booking, status }
    }
    let netBooking = booking;
    let paymentData = booking.paymentData;
    await runTransaction(firestore,  async (transaction) => {
        const bookingSnap = await transaction.get(bookingRef)
        if (!bookingSnap.exists()) {
            throw new Error("Booking not found.");
        }
        const booking = bookingSnap.data() as Booking;
        let netBooking = booking;
        if (booking.status === status || ((booking.status === 'Confirmed' || booking.status === 'Completed') && status === 'Pending')) {
            return;
        }
        if ( ["Rejected", "Canceled"].includes(status)){

            if (booking.isConfirmed){
                paymentData = await refundBooking(booking);
            }
            const staySnap = await transaction.get(stayRef)
            if (!staySnap.exists()){
                throw new Error('Stay Not found')
            }

            const stayData = staySnap.data() as Hotel | Home;
            const checkIn = new Date(booking.checkInDate);
            const checkOut = new Date(booking.checkOutDate);
            if (stayData.type === "Hotel") {
                const { updatedRooms, fullyBookedDates } = reverseHotelBooking(stayData, booking, checkIn, checkOut);
                transaction.update(stayRef, { rooms: updatedRooms, bookedDates: fullyBookedDates });
            } else if (stayData.type === "Home") {
                const updatedUnavailableDates = reverseHomeBooking(stayData, checkIn, checkOut);
                transaction.update(stayRef, { bookedDates: updatedUnavailableDates });
            }
            batch.update(bookingRef, {status, paymentData, actions: arrayUnion({id: user.uid, type: 'Host', timeStamp: serverDate.toISOString(), status}) })
            batch.delete(hostTransaction)
        } else if (booking.status === 'Pending' && status === "Confirmed") {
            await updateHostBalance(transaction, hostRef, booking,status)
            batch.set(hostTransaction, {
                id: booking.id,
                amount: booking.totalPrice,
                currency: "USD",
                paymentData,
                date: booking.createdAt,
                availableDate: addDays(new Date(booking.checkOutDate), 3).toISOString(),
            }, {merge: true});
            batch.update(bookingRef, {status, paymentData, actions: arrayUnion({id: user.uid, type: 'Host', timeStamp: serverDate.toISOString(), status}) })
        }
    })

    batch.update(bookingRef, {status, })
await batch.commit();
    const newBooking = { ...netBooking, status, acceptedAt: serverDate.toISOString(), paymentData };
    dispatch(fetchStatistics());
    return { booking: newBooking, status };
} catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "An unexpected error occurred");
}
});


function reverseHotelBooking(
    stayData: Hotel,
    booking: Booking,
    checkIn: Date,
    checkOut: Date
): {
    updatedRooms: Room[];
    fullyBookedDates: string[];
} {
    const rooms = stayData.rooms;
    const bookedRooms = booking.rooms ? booking.rooms : [];
    const bookingIds = bookedRooms.map((room) => room.roomId);

    // Initialize variables
    const updatedRooms: any[] = [];
    const fullyBookedDatesSet = new Set<string>(stayData.bookedDates ?? []);

    rooms.forEach((room: Room) => {
        if (bookingIds.includes(room.id)) {
            const bookedRoomData = bookedRooms.find((r) => r.roomId === room.id);

            // Extract room-level data
            let bookedDatesMap = new Map<string, number>(
                Object.entries(room.bookedDates ?? {})
            );
            let fullDates = room.fullDates ?? [];

            // Iterate over the booking range
            iterateDaysBetween(checkIn, checkOut, (date) => {
                const currentDateStr = date.toISOString().split('T')[0];

                // Update room-level bookedDates map
                const currentCount = bookedDatesMap.get(currentDateStr) || 0;
                const updatedCount = Math.max(currentCount - bookedRoomData!.numRooms, 0);

                if (updatedCount > 0) {
                    bookedDatesMap.set(currentDateStr, updatedCount);
                } else {
                    bookedDatesMap.delete(currentDateStr);
                }

                // Update full dates and stayData fully booked dates
                if (updatedCount < room.available) {
                    fullDates = fullDates.filter((date) => date !== currentDateStr);
                    fullyBookedDatesSet.delete(currentDateStr);
                }
            });

            // Convert bookedDatesMap back to an object for storage
            updatedRooms.push({
                ...room,
                bookedDates: Object.fromEntries(bookedDatesMap),
                fullDates,
            });
        } else {
            // Keep room as is for non-booked rooms
            updatedRooms.push(room);
        }
    });

    return { updatedRooms, fullyBookedDates: Array.from(fullyBookedDatesSet) };
}

function reverseHomeBooking(stayData: Home, checkIn: Date, checkOut: Date): string[] {
    const unavailableDatesSet = new Set<string>(stayData.bookedDates || []);

    // Remove the booked dates within the booking range
    iterateDaysBetween(checkIn, checkOut, (date) => {
        const currentDateStr = date.toISOString().split('T')[0];
        unavailableDatesSet.delete(currentDateStr);
    });

    return Array.from(unavailableDatesSet);
}
export function iterateDaysBetween(startDate: Date, endDate: Date, task: (date: Date) => void): void {
    let currentDate = new Date(startDate);

    while (isBefore(currentDate, endDate) || isEqual(currentDate, endDate)) {
        task(currentDate);
        currentDate = addDays(currentDate, 1); // Add one day, properly handling month/year transitions
    }
}
