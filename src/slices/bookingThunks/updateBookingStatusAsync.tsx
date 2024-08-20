import {createAsyncThunk} from "@reduxjs/toolkit";
import {refundBooking} from "@/data/bookingsData";
import {getCurrentUser} from "@/data/hotelsData";
import {writeBatch} from "@firebase/firestore";
import {firestore} from "@/lib/firebase";
import {collection, doc, getDoc} from "firebase/firestore";
import {RootState} from "@/data/store";
import dayjs from "dayjs";
import {addDays} from "date-fns";


export const updateBookingStatusAsync = createAsyncThunk(
    'booking/updateStatus',
    async ({status, booking}: { status: 'Pending' | 'Confirmed' | 'Canceled' | 'Rejected', booking: any }, {
        getState,
        rejectWithValue
    }) => {
        const state = getState() as RootState
        const stayState = state.stay
        try {
            console.log(booking, 'At status')
            const user = getCurrentUser()
            const batch = writeBatch(firestore);
            const hostDoc = doc(firestore, 'hosts', user.uid, 'bookings', booking.id)
            const userDoc = doc(firestore, 'users', booking.accountId, 'bookings', booking.id)
            const hostTransaction = doc(firestore, 'hosts', booking.hostId, 'pendingTransactions', booking.id);
            const transactionDoc = await getDoc(hostTransaction)
            const availableRef = collection(firestore, 'hosts', user.uid, 'availableTransactions')
            let paymentData = booking.paymentData;
            if (status === 'Rejected' || status === 'Canceled') {
                if (booking.isConfirmed) {
                    const stay = stayState.stays.find((stay) => stay.id === booking.accommodationId);
                    console.log(stay)
                    if (stay) {
                        const stayDoc = doc(firestore, 'stays', booking.accommodationId);
                        batch.update(stayDoc, {status: status});
                        if (status === 'Rejected' || status === 'Canceled') {
                            const newStay = {...stay};
                            newStay.availableRooms += booking.rooms;
                            batch.update(stayDoc, newStay);
                        }

                        if (stay.cancellation.cancellation === 'Free') {
                            paymentData = await refundBooking(booking)
                        } else if (stay.cancellation.cancellation === 'Other') {
                            const cancellation = stay.cancellation
                            let date = dayjs()
                            console.log(cancellation)
                            if (cancellation.preDate) {
                                if (cancellation.timeSpace === 'Days') {
                                    date = dayjs(booking.checkInDate).subtract(cancellation.time, 'days')
                                } else if (cancellation.timeSpace === 'Hours') {
                                    date = dayjs(booking.checkInDate).subtract(cancellation.time, 'hours')
                                }
                            } else {
                                if (cancellation.timeSpace === 'Days') {
                                    date = dayjs(booking.checkInDate).add(cancellation.time, 'days')
                                } else if (cancellation.timeSpace === 'Hours') {
                                    date = dayjs(booking.checkInDate).add(cancellation.time, 'hours')
                                }
                            }
                            if (transactionDoc.exists()) {
                                batch.delete(hostTransaction)
                            }
                            console.log(date)
                            if (date.isBefore(dayjs())) {
                                const amount = ((100 - cancellation.rate) / 100) * booking.paymentData.amount
                                console.log(amount)
                                paymentData = await refundBooking(booking, amount)
                                if (transactionDoc.exists()) {
                                    batch.set(doc(availableRef, booking.id), {
                                        ...transactionDoc,
                                        amount: (cancellation.rate / 100) * booking.totalPrice,
                                        paymentData: paymentData,
                                    })
                                } else {
                                    batch.set(doc(availableRef, booking.id), {
                                        id: booking.id,
                                        amount: (cancellation.rate / 100) * booking.totalPrice,
                                        currency: stay.currency,
                                        paymentData: paymentData,
                                        date: booking.createdAt,
                                        availableDate: date.toISOString(),
                                    })
                                }
                            } else {
                                console.log('full')
                                paymentData = await refundBooking(booking)
                            }
                        }

                    }
                }
            }

            if (transactionDoc.exists()) {
                if (status === 'Canceled' || status === 'Rejected') {
                    batch.delete(hostTransaction)
                } else {

                }
            } else {
                if (status === 'Confirmed') {
                    batch.set(hostTransaction, {
                        id: booking.id,
                        amount: booking.totalPrice,
                        currency: 'USD',
                        paymentData: paymentData,
                        date: booking.createdAt,
                        availableDate: addDays(booking.checkOutDate, 3).toISOString(),
                    })
                }
            }
            batch.update(hostDoc, {status: status, acceptedAt: new Date().toString(), paymentData: paymentData,})
            batch.update(userDoc, {status: status, acceptedAt: new Date().toString(), paymentData: paymentData,})

            await batch.commit();
            let newBooking = {...booking};
            newBooking.status = status
            return {booking: newBooking, status}
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            } else {
                return rejectWithValue('Error');
            }
        }

    }
);
