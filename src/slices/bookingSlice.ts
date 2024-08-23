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

import {updateBookingStatusAsync} from "@/slices/bookingThunks/updateBookingStatusAsync";
import fetchStatistics from "@/slices/bookingThunks/fetchStatistics"; // Adjust the import according to your project structure

interface BookingState {
    cart: any[];
    cartTotal: number;
    bookings: any[];
    currentBooking: any;
    pendingTransactions:any[]
    isLoading: boolean;
    hasError: boolean;
    errorMessage: string;
    fetchedPages: number[];
    page: number;
    limit: number;
    bookingCount: number;
    stats: {
        onGoing: number,
        checkIn: number,
        checkOut: number,
        pending: number,
        upComing: number,
    },
}

const initialState: BookingState = {
    cart: [],
    cartTotal: 0,
    bookings: [],
    currentBooking: {},
    bookingCount: 0,
    pendingTransactions: [],
    isLoading: false,
    hasError: false,
    errorMessage: '',
    fetchedPages: [],
    stats: {
        onGoing: 0,
        checkIn: 0,
        checkOut: 0,
        pending: 0,
        upComing: 0,
    },
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

        setBookings: (state, action: PayloadAction<any[]>) => {
            state.bookings = action.payload;
        },
        setCurrentBookingById: (state, action: PayloadAction<string | number>) => {
            const currentBooking = state.bookings.find((booking) => booking.id.toString() === action.payload.toString());
            state.currentBooking = currentBooking ? currentBooking : {};
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

            })
            .addCase(updateBookingCount.rejected, (state, action) => {
                state.isLoading = false
            })
            .addCase(fetchStatistics.pending, (state) => {
                state.isLoading = true
            })
            .addCase(fetchStatistics.fulfilled, (state, action) => {
                state.stats = action.payload;
                state.isLoading = false;
            }).addCase(fetchStatistics.rejected, (state, action) => {
            state.isLoading = false
        });
    }
});


export {updateBookingStatusAsync}
export const {
    resetBooking,
    updateCart,
    setBookings,
    setCurrentBookingById,
    setIsLoading,
    setPage,
} = bookingSlice.actions;

export const selectCart = (state: any) => state.booking.cart;
export const selectDates = (state: any) => state.booking.dates;
export const selectBookings = (state: any) => state.booking.bookings;
export const selectCurrentBooking = (state: any) => state.booking.currentBooking;
export const selectBookingStats = (state: any) => state.booking.stats;
export const selectIsBookingLoading = (state: any) => state.booking.isLoading;
export const selectHasError = (state: any) => state.booking.hasError;
export const selectErrorMessage = (state: any) => state.booking.errorMessage;
export const selectPage = (state: any) => state.booking.page;
export const selectLimit = (state: any) => state.booking.limit;
export const selectTotalBookings = (state: any) => state.booking.bookings;
export const selectFetchedPages = (state: any) => state.booking.fetchedPages;
export const selectBookingsCount = (state: any) => state.booking.bookingCount;

export default bookingSlice.reducer;
