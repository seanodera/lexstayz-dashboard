import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addDays, differenceInDays } from "date-fns";
import { getBookings, updateStatus } from "@/data/bookingsData";
import { Balance, Dates, Withdraw } from "@/lib/types";

interface BookingState {
    cart: any[];
    cartTotal: number;
    bookings: any[];
    currentBooking: any;
    dates: Dates;
    balance: Balance;
    withdraw: Withdraw;
    isLoading: boolean;
    hasError: boolean;
    errorMessage: string;
}

const initialState: BookingState = {
    cart: [],
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
    },
    isLoading: false,
    hasError: false,
    errorMessage: ''
};

export const fetchBookingsAsync = createAsyncThunk(
    'booking/fetchBookings',
    async () => {
        const bookings = await getBookings();
        return bookings;
    }
);

export const updateBookingStatusAsync = createAsyncThunk(
    'booking/updateStatus',
    async ({ status, booking }: { status: 'Pending' | 'Confirmed' | 'Canceled' | 'Rejected', booking: any }) => {
        let updated = await updateStatus(status, booking);
        return { booking: updated, status };
    }
);

const bookingSlice = createSlice({
    name: "booking",
    initialState,
    reducers: {
        resetBooking: (state) => {
            state.cart = [];
        },
        updateCart: (state, action: PayloadAction<any[]>) => {
            state.cart = action.payload;
        },
        updateDates: (state, action: PayloadAction<Dates>) => {
            state.dates.startDate = action.payload.startDate;
            state.dates.endDate = action.payload.endDate;
            state.dates.length = differenceInDays(new Date(state.dates.endDate), new Date(state.dates.startDate));
        },
        setBookings: (state, action: PayloadAction<any[]>) => {
            state.bookings = action.payload;
        },
        setCurrentBookingById: (state, action: PayloadAction<string | number>) => {
            const currentBooking = state.bookings.find((booking) => booking.id.toString() === action.payload.toString());
            state.currentBooking = currentBooking ? currentBooking : {};
        },
        setWithdraw: (state, action: PayloadAction<Withdraw>) => {
            state.withdraw = action.payload;
        },
        setBalance: (state, action: PayloadAction<Balance>) => {
            state.balance = action.payload;
        },
        setIsLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBookingsAsync.pending, (state) => {
                state.isLoading = true;
                state.hasError = false;
                state.errorMessage = '';
            })
            .addCase(fetchBookingsAsync.fulfilled, (state, action: PayloadAction<any[]>) => {
                state.bookings = action.payload;
                state.isLoading = false;
            })
            .addCase(fetchBookingsAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.hasError = true;
                state.errorMessage = action.error.message || 'Failed to fetch bookings';
            })
            .addCase(updateBookingStatusAsync.pending, (state) => {
                state.isLoading = true;
                state.hasError = false;
                state.errorMessage = '';
            })
            .addCase(updateBookingStatusAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.bookings.findIndex((value) => value.id === action.payload.booking.id);
                state.bookings[index] = {
                    ...action.payload.booking,
                    status: action.payload.status,
                }
            })
            .addCase(updateBookingStatusAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.hasError = true;
                state.errorMessage = action.error.message || 'Failed to update booking';
            });
    }
});

export const {
    resetBooking,
    updateCart,
    updateDates,
    setBookings,
    setCurrentBookingById,
    setWithdraw,
    setBalance,
    setIsLoading,
} = bookingSlice.actions;

export const selectCart = (state: any) => state.booking.cart;
export const selectDates = (state: any) => state.booking.dates;
export const selectBookings = (state: any) => state.booking.bookings;
export const selectCurrentBooking = (state: any) => state.booking.currentBooking;
export const selectBalance = (state: any) => state.booking.balance;
export const selectWithdraw = (state: any) => state.booking.withdraw;
export const selectWithdrawals = (state: any) => state.booking.withdraw.withdrawals;
export const selectWithdrawAccount = (state: any) => state.booking.withdraw.account;
export const selectIsBookingLoading = (state: any) => state.booking.isLoading;
export const selectHasError = (state: any) => state.booking.hasError;
export const selectErrorMessage = (state: any) => state.booking.errorMessage;

export default bookingSlice.reducer;
