import {createAsyncThunk} from "@reduxjs/toolkit";
import {refundBooking} from "@/data/bookingsData";
import {getCurrentUser} from "@/data/hotelsData";
import {writeBatch} from "@firebase/firestore";
import {firestore} from "@/lib/firebase";
import {doc} from "firebase/firestore";
import {RootState} from "@/data/store";
import dayjs from "dayjs";



export const updateBookingStatusAsync = createAsyncThunk(
    'booking/updateStatus',
    async ({status, booking}: { status: 'Pending' | 'Confirmed' | 'Canceled' | 'Rejected', booking: any }, {getState,rejectWithValue}) => {
        const state = getState() as RootState
        const stayState = state.stay
        try {
            console.log(booking, 'At status')
            const user = getCurrentUser()
            const batch = writeBatch(firestore);
            const hostDoc = doc(firestore, 'hosts', user.uid, 'bookings', booking.id)
            const userDoc = doc(firestore, 'users', booking.accountId, 'bookings', booking.id)

            if (status === 'Rejected' || status === 'Canceled'){
                if (booking.isConfirmed) {
                    const stay = stayState.stays.find((stay) => stay.id === booking.stayId);
                    if (stay){
                        const stayDoc = doc(firestore, 'stays', booking.stayId);
                        batch.update(stayDoc, {status: status});
                        if (status === 'Rejected' || status === 'Canceled') {
                            const newStay = {...stay};
                            newStay.availableRooms += booking.rooms;
                            batch.update(stayDoc, newStay);
                        }

                        if (stay.cancellation.cancellation === 'Free'){
                            await refundBooking(booking)
                        } else if (stay.cancellation.cancellation === 'Other') {
                            const cancellation = stay.cancellation
                            let date = dayjs()
                            if (cancellation.preDate){
                                if (cancellation.timeSpace === 'Days'){
                                    date = dayjs(booking.checkInDate).subtract(cancellation.time, 'days')
                                } else if (cancellation.timeSpace === 'Hours'){
                                    date = dayjs(booking.checkInDate).subtract(cancellation.time, 'hours')
                                }
                            } else {
                                if (cancellation.timeSpace === 'Days'){
                                    date = dayjs(booking.checkInDate).add(cancellation.time, 'days')
                                } else if (cancellation.timeSpace === 'Hours'){
                                    date = dayjs(booking.checkInDate).add(cancellation.time, 'hours')
                                }
                            }
                            if (date.isAfter(dayjs())){
                                const amount = ((100  - cancellation.rate) /100 ) * booking.paymentData.amount
                                await refundBooking(booking,amount)
                            } else {
                                await refundBooking(booking)
                            }
                        }

                    }
                }
            }
            batch.update(hostDoc, {status: status, acceptedAt: new Date().toString()})
            batch.update(userDoc, {status: status, acceptedAt: new Date().toString()})

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
