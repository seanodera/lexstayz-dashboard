import {configureStore} from "@reduxjs/toolkit";
import BookingReducer from '@/slices/bookingSlice'
import stayReducer from "@/slices/staySlice";
import AuthenticationReducer from '@/slices/authenticationSlice'
import createStayReducer from "@/slices/createStaySlice";
import messagingReducer from "@/slices/messagingSlice";
import transactionsReducer from "@/slices/transactionsSlice";
import promotionReducer from "@/slices/promotionSlice";

const store = configureStore({
    reducer: {
        booking: BookingReducer,
        authentication: AuthenticationReducer,
        createStay: createStayReducer,
        stay: stayReducer,
        messaging: messagingReducer,
        transactions: transactionsReducer,
        promotion: promotionReducer, // Add promotion reducer to the store

    }
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
