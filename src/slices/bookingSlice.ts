import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {addDays, differenceInDays} from "date-fns";
import {
    getDocs,
    collection,
    query,
    orderBy,
    startAfter,
    limit as fbLimit,
    getCountFromServer, getAggregateFromServer, average, sum, count
} from "firebase/firestore";
import {getCurrentUser} from "@/data/hotelsData";
import {firestore} from "@/lib/firebase";
import {Dates, Balance, Withdraw} from "@/lib/types";
import {updateStatus} from "@/data/bookingsData";
import {state} from "sucrase/dist/types/parser/traverser/base"; // Adjust the import according to your project structure

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
    bookingCount: number;
}

const initialState: BookingState = {
    cart: [],
    cartTotal: 0,
    bookings: [],
    currentBooking: {},
    bookingCount: 0,
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

export const fetchBookingsAsync = createAsyncThunk(
    'booking/fetchBookings',
    async ({page, limit}: { page: number, limit: number }, {getState,dispatch}) => {
        const state = getState() as { booking: BookingState };
        dispatch(updateBookingCount())
        if (state.booking.fetchedPages.includes(page)) {
            return {bookings: [], page}; // Return empty if already fetched
        }

        const user = getCurrentUser();
        const bookingsRef = collection(firestore, 'hosts', user.uid, 'bookings');
        let bookingsQuery;

        if (state.booking.bookings.length > 0) {
            const lastBooking = state.booking.bookings[ state.booking.bookings.length - 1 ];
            bookingsQuery = query(
                bookingsRef,
                orderBy('createdAt', 'desc'),
                startAfter(lastBooking.createdAt),
                fbLimit(limit)
            );
        } else {
            bookingsQuery = query(bookingsRef, orderBy('createdAt', 'desc'), fbLimit(limit));
        }

        const snapshot = await getDocs(bookingsQuery);
        const bookings = snapshot.docs.map(doc => doc.data());

        return {bookings, page};
    }
);

export const updateBookingStatusAsync = createAsyncThunk(
    'booking/updateStatus',
    async ({status, booking}: { status: 'Pending' | 'Confirmed' | 'Canceled' | 'Rejected', booking: any }) => {
        let updated = await updateStatus(status, booking);
        return {booking: updated, status};
    }
);

export const updateBookingCount = createAsyncThunk(
    'booking/updateBookingCount',
    async (_) => {

        const user = getCurrentUser();
        const bookingsRef = collection(firestore, 'hosts', user.uid, 'bookings');
        let countData = await getAggregateFromServer(bookingsRef, {
            countOfDocs: count(),
            totalAmount: sum('totalPrice'),
            averageAmount: average('totalPrice')

        })

        return {
            bookingCount: countData.data().countOfDocs,
            totalAmount: countData.data().totalAmount,
            averageAmount: countData.data().averageAmount || 0,
        };

    }
)

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
            .addCase(fetchBookingsAsync.fulfilled, (state, action: PayloadAction<{
                bookings: any[],
                page: number
            }>) => {
                const {page, bookings} = action.payload;
                if (page === 1) {
                    state.bookings = bookings;
                } else {
                    state.bookings = [...state.bookings, ...bookings];
                }
                if (!state.fetchedPages.includes(page)) {
                    state.fetchedPages.push(page);
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
                if (index !== -1) {
                    state.bookings[ index ] = {
                        ...action.payload.booking,
                        status: action.payload.status,
                    };
                }
            })
            .addCase(updateBookingStatusAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.hasError = true;
                state.errorMessage = action.error.message || 'Failed to update booking';
            })
            .addCase(updateBookingCount.pending, (state, action) => {
                state.isLoading = true;
            }).addCase(updateBookingCount.fulfilled, (state, action) => {
            state.isLoading = false;
            state.bookingCount = action.payload.bookingCount;
            state.balance.pending = action.payload.totalAmount;
            state.balance.available = action.payload.averageAmount;
            })
            .addCase(updateBookingCount.rejected, (state, action) => {
                state.isLoading = false

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
export const selectFetchedPages = (state: any) => state.booking.fetchedPages;
export const selectBookingsCount = (state: any) => state.booking.bookingCount;

export default bookingSlice.reducer;
