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
            startDate: new Date(),
            endDate: addDays(new Date(), 1),
            length: 1,
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
            let currentStay = state.stays.find((value:any) => value.id.toString() === action.payload.toString());
            state.currentStay = currentStay? currentStay : {};
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
            state.currentBooking = currentBooking? currentBooking : {};
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
export const {
    resetBooking,
    setCurrentStay,
    updateCart,
    setAllStays,
    setCurrentStayFromId,
    updateDates,
    setBookings,
    setCurrentBookingById
} = bookingSlice.actions
export default bookingSlice.reducer;