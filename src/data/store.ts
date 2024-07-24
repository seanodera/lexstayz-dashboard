import {configureStore} from "@reduxjs/toolkit";
import BookingReducer from '@/slices/bookingSlice'
import AuthenticationReducer from '@/slices/authenticationSlice'
import createStayReducer from "@/slices/createStaySlice";

const store = configureStore({
    reducer: {
        booking: BookingReducer,
        authentication: AuthenticationReducer,
        createStay: createStayReducer
    }
});

export default store;