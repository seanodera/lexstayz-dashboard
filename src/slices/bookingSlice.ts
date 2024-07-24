import {createSlice} from "@reduxjs/toolkit";
import {addDays, differenceInDays} from "date-fns";


const bookingSlice = createSlice({
    name: "booking",
    initialState: {
        cart: [],
        currentStay: {},
        currentId: -1,
        stays: [],
        cartTotal: 0,
        bookings: [],
        currentBooking: {},
        dates: {
            startDate: new Date().toDateString(),
            endDate: addDays(new Date(), 1).toDateString(),
            length: 1,
        },
        balance: {
            available: 65784,
            pending: 34286,
        },
        withdraw: {
            account: {
                method: 'Pryzapay',
                account: ''
            },
            withdrawals: []
        }
    },
    reducers: {
        resetBooking: (state, action) => {
            state.cart = [];
            state.currentId = -1;
            state.currentStay = {};
        },
        setAllStays: (state, action) => {
            state.stays = action.payload;
        },
        setCurrentStay: (state, action) => {
            state.currentStay = action.payload;
            state.currentId = action.payload.id;
        },
        setCurrentStayFromId: (state, action) => {
            state.currentId = action.payload;
            let currentStay = state.stays.find((value: any) => value.id.toString() === action.payload.toString());
            state.currentStay = currentStay ? currentStay : {};
            console.log(state)
        },
        updateCart: (state, action) => {
            state.cart = action.payload;
        },
        updateDates: (state, action) => {
            state.dates.startDate = action.payload.startDate;
            state.dates.endDate = action.payload.endDate;
            state.dates.length = differenceInDays(state.dates.endDate, state.dates.startDate);
        },
        setBookings: (state, action) => {
            state.bookings = action.payload;
        },
        setCurrentBookingById: (state, action) => {
            let currentBooking = state.bookings.find((booking: any) => booking.bookingId.toString() === action.payload.toString());
            console.log(currentBooking);
            state.currentBooking = currentBooking ? currentBooking : {};
        },
        setWithdraw: (state, action) => {
            state.withdraw = action.payload;
        },
        setBalance: (state, action) => {
            state.balance = action.payload;
        }
    }
})

export const selectCurrentStay = (state: any) => state.booking.currentStay;
export const selectCart = (state: any) => state.booking.cart;
export const selectCurrentId = (state: any) => state.booking.currentId;
export const selectAllStays = (state: any) => state.booking.stays;
export const selectDates = (state: any) => state.booking.dates;
export const selectBookings = (state: any) => state.booking.bookings;
export const selectCurrentBooking = (state: any) => state.booking.currentBooking;
export const selectBalance = (state: any) => state.booking.balance;
export const selectWithdraw = (state: any) => state.booking.withdraw;
export const selectWithdrawals = (state: any) => state.booking.withdraw.withdrawals;
export const selectWithdrawAccount = (state: any) => state.booking.withdraw.account;
export const {
    resetBooking,
    setCurrentStay,
    updateCart,
    setAllStays,
    setCurrentStayFromId,
    updateDates,
    setBookings,
    setCurrentBookingById,
    setWithdraw, setBalance
} = bookingSlice.actions
export default bookingSlice.reducer;