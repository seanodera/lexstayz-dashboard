import {configureStore} from "@reduxjs/toolkit";
import BookingReducer from '@/slices/bookingSlice'
import stayReducer from "@/slices/staySlice";
import AuthenticationReducer from '@/slices/authenticationSlice'
import createStayReducer from "@/slices/createStaySlice";

const store = configureStore({
    reducer: {
        booking: BookingReducer,
        authentication: AuthenticationReducer,
        createStay: createStayReducer,
        stay: stayReducer,
    }
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;