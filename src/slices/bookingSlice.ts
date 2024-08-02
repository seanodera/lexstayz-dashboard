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
    fetchedPages: number[];
    page: number;
    limit: number;
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
    errorMessage: '',
    fetchedPages: [],
    page: 1,
    limit: 10,
};

export const fetchBookingsAsync:any = createAsyncThunk(
    'booking/fetchBookings',
    async ({ page, limit }: { page: number, limit: number }, { getState }) => {
        const state = getState() as { booking: BookingState };
        console.log('booking/fetchBookings', page, limit, 'fetched Pages', state.booking.fetchedPages)
        if (state.booking.fetchedPages.includes(page)) {
            console.log('coming back empty')
            return { bookings: [], page }; // Return an empty array if the page has already been fetched
        } else {
            const last = (state.booking.bookings.length > 0)? state.booking.bookings[state.booking.bookings.length -1].createdAt: undefined;

            const bookings = await getBookings(page, limit, last);
        console.log(bookings)
        return { bookings, page };
    }
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
        },
        setPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBookingsAsync.pending, (state) => {
                state.isLoading = true;
                state.hasError = false;
                state.errorMessage = '';
            })
            .addCase(fetchBookingsAsync.fulfilled, (state, action: PayloadAction<{ bookings: any[], page: number }>) => {
                if (action.payload.bookings.length > 0) {
                    state.bookings = [...state.bookings, ...action.payload.bookings];
                    state.fetchedPages.push(action.payload.page);
                }
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
    setPage,
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
export const selectPage = (state: any) => state.booking.page;
export const selectLimit = (state: any) => state.booking.limit;
export const selectTotalBookings = (state: any) => state.booking.bookings;
export const selectFetchedPages= (state: any) => state.booking.fetchedPages


export default bookingSlice.reducer;
