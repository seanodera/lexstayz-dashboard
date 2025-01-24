import { createAsyncThunk } from "@reduxjs/toolkit";
import { refundBooking } from "@/data/bookingsData";
import { getCurrentUser } from "@/data/hotelsData";
import {writeBatch, collection, doc, getDoc, Transaction, runTransaction} from "@firebase/firestore";
import { firestore } from "@/lib/firebase";
import { RootState } from "@/data/store";
import {addDays, addHours, isAfter, isSameDay, subDays, subHours} from "date-fns";
import { getServerTime } from "@/lib/utils";
import fetchStatistics from "@/slices/bookingThunks/fetchStatistics";
import {Balance, Host, Stay} from "@/lib/types";

export const updateBookingStatusAsync = createAsyncThunk(
    "booking/updateStatus",
    async (
        { status, booking }: { status: "Pending" | "Confirmed" | "Canceled" | "Rejected" | "Completed"; booking: any },
        { getState, rejectWithValue, dispatch }
    ) => {
        const state = getState() as RootState;
        try {
            const serverDate = await getServerTime();
            const user = getCurrentUser();
            const batch = writeBatch(firestore);

            const bookingsDoc = doc(firestore, "bookings", booking.id);
            const hostRef = doc(firestore, "hosts", booking.hostId);
            const hostTransaction = doc(firestore, "hosts", booking.hostId, "pendingTransactions", booking.id);
            const transactionDoc = await getDoc(hostTransaction);
            const stayRef = doc(firestore, "stays", booking.accommodationId);

            let paymentData = booking.paymentData;
            let cancellationAmount: number | undefined ;
            console.log(status)
            if (["Rejected", "Canceled"].includes(status)) {
                if (booking.status === "Pending" && booking.isConfirmed) {
                    await refundBooking(booking);
                } else
                {
                    const staySnap = await getDoc(stayRef);
                    if (!staySnap.exists()) throw new Error("Accommodation document does not exist!");

                    const stayData = staySnap.data() as Stay;
                    const checkIn = new Date(booking.checkInDate);
                    const checkOut = new Date(booking.checkOutDate);
                    const cancellation = stayData.cancellation;
                    if (cancellation.cancellation === 'Non-Refundable') {
                        paymentData = await handleCancellationOrRejection(booking, paymentData, serverDate,);
                        if (transactionDoc.exists()) {
                            batch.delete(hostTransaction);
                        }

                    } else if (cancellation.cancellation === 'Other') {
                        let date;
                        let timeToCheck;
                        if (cancellation.preDate) {
                            date = checkIn;
                            if (cancellation.timeSpace === 'Days') {
                                timeToCheck = subDays(date, cancellation.time);
                            } else {
                                timeToCheck = subHours(date, cancellation.time);
                            }
                        } else {
                            date = new Date(booking.createdAt);
                            if (cancellation.timeSpace === 'Days') {
                                timeToCheck = addDays(date, cancellation.time);
                            } else {
                                timeToCheck = addHours(date, cancellation.time);
                            }
                        }
                        if (isAfter(serverDate, timeToCheck)) {
                            const amount = (booking.grandTotal - booking.fees) * booking.paymentRate * cancellation.rate;
                            paymentData = await handleCancellationOrRejection(booking, paymentData, serverDate, amount)
                            batch.set(hostTransaction, {
                                amount: amount,
                                availableDate: serverDate.toISOString(),
                            }, {merge: true});
                            cancellationAmount = amount;
                        }
                    }
                    if (stayData) {
                        updateStayDataForCancellation(stayData, booking, checkIn, checkOut, batch, stayRef);
                    }
                }
            }

            if (transactionDoc.exists()) {
                // if (["Canceled", "Rejected"].includes(status)) {
                //     batch.delete(hostTransaction);
                // }
            } else if (status === "Confirmed") {
                batch.set(hostTransaction, {
                    id: booking.id,
                    amount: booking.totalPrice,
                    currency: "USD",
                    paymentData,
                    date: booking.createdAt,
                    availableDate: addDays(new Date(booking.checkOutDate), 3).toISOString(),
                }, {merge: true});
            }

           if (booking.status !== status && !(booking.status === 'Pending' && status === 'Confirmed')){
               // Update host's balance
               await runTransaction(firestore,async (transaction) => {
                   if(["Canceled", "Rejected"].includes(status)){
                       await updateHostBalance(transaction, hostRef, booking, status, cancellationAmount);
                   }

               });
           }

            batch.update(bookingsDoc, {
                status,
                acceptedAt: serverDate.toISOString(),
                paymentData,
            });

            await batch.commit();

            const newBooking = { ...booking, status, acceptedAt: serverDate.toISOString(), paymentData };
            dispatch(fetchStatistics());
            return { booking: newBooking, status };
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : "An unexpected error occurred");
        }
    }
);

// Add the provided function to update the host's balance
async function updateHostBalance(transaction: Transaction, hostRef: any, booking: any, status: string, amount?: number) {
    const hostSnap = await transaction.get(hostRef);
    const hostData = hostSnap.data() as Host;

    if (!hostData) throw new Error("Host data not found!");

    const currentBalance: Balance = hostData.balance || {
        available: 0,
        prevAvailable: 0,
        pending: 0,
        prevPending: 0,
    };

    const updatedBalance = { ...currentBalance };

    if (status === "Confirmed") {
        updatedBalance.pending += booking.totalPrice;
    } else if (["Canceled", "Rejected"].includes(status)) {
        updatedBalance.pending -= booking.totalPrice;
        if (amount){
            updatedBalance.available += amount;
        }
    }

    updatedBalance.prevPending = currentBalance.pending;
    updatedBalance.prevAvailable = currentBalance.available;

    transaction.update(hostRef, { balance: updatedBalance });
}

// Other utility functions remain unchanged
async function handleCancellationOrRejection(booking: any, paymentData: any, serverDate: Date,amount?: number) {
    if (booking.status === "Pending" && booking.isConfirmed) {
        return await refundBooking(booking);
    } else if (booking.isConfirmed) {
        if (amount) {
            return await refundBooking(booking, amount);
        } else {
            return await refundBooking(booking, (booking.grandTotal - booking.fees )* booking.paymentRate);
        }
    }
    return paymentData;
}

function updateStayDataForCancellation(
    stayData: any,
    booking: any,
    checkIn: Date,
    checkOut: Date,
    batch: any,
    stayRef: any
) {
    if (stayData.type === "Hotel") {
        const { updatedRooms, fullyBookedDates } = reverseProcessHotelBooking(stayData, booking, checkIn, checkOut);
        batch.update(stayRef, { rooms: updatedRooms,bookedDates: fullyBookedDates });
    } else if (stayData.type === "Home") {
        const unavailableDates = reverseProcessHomeBooking(stayData, checkIn, checkOut);
        batch.update(stayRef, { bookedDates: unavailableDates });
    }
}

function reverseProcessHotelBooking(stayData: any, booking: any, checkIn: Date, checkOut: Date) {
    const rooms = stayData.rooms;
    const bookingIds = booking.rooms.map((room: any) => room.roomId);

    const fullyBookedDates = new Set(stayData.bookedDates || []);
    const updatedRooms = rooms.map((room: any) => {
        if (!bookingIds.includes(room.id)) return room;

        const bookedRoomData = booking.rooms.find((r: any) => r.roomId === room.id);
        const bookedDates = new Map(Object.entries(room.bookedDates || {}));
        const fullDates = new Set(room.fullDates || []);

        iterateDaysBetween(checkIn, checkOut, (date) => {
            const dateStr = date.toISOString().split("T")[0];
            if (bookedDates.has(dateStr)) {
                const updatedCount = (bookedDates.get(dateStr)? bookedDates.get(dateStr) as number : 0) - bookedRoomData.numRooms;
                if (updatedCount <= 0) {
                    bookedDates.delete(dateStr);
                } else {
                    bookedDates.set(dateStr, updatedCount);
                }

                if (fullDates.has(dateStr) && (updatedCount || 0) < room.available) {
                    fullDates.delete(dateStr);
                    fullyBookedDates.delete(dateStr);
                }
            }
        });

        return {
            ...room,
            bookedDates: Object.fromEntries(bookedDates),
            fullDates: Array.from(fullDates),
        };
    });

    return {
        updatedRooms,
        fullyBookedDates: Array.from(fullyBookedDates),
    };
}

function reverseProcessHomeBooking(stayData: any, checkIn: Date, checkOut: Date) {
    const unavailableDates = new Set(stayData.bookedDates || []);
    iterateDaysBetween(checkIn, checkOut, (date) => {
        unavailableDates.delete(date.toISOString().split("T")[0]);
    });
    return Array.from(unavailableDates);
}

function iterateDaysBetween(startDate: Date, endDate: Date, callback: (date: Date) => void) {
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
        callback(currentDate);
        currentDate.setDate(currentDate.getDate() + 1);
    }
}
