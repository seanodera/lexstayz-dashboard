import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {
    getDocs,
    collection,
    query,
    orderBy,
    startAfter,
    limit as fbLimit,
    getAggregateFromServer, average, sum, count, getDoc, getCountFromServer
} from "firebase/firestore";
import {getCurrentUser} from "@/data/hotelsData";
import {firestore} from "@/lib/firebase";


import fetchStatistics from "@/slices/bookingThunks/fetchStatistics";
import {RootState} from "@/data/store";
import {doc, where,} from "@firebase/firestore";
import {Stay} from "@/lib/types";
import { updateBookingStatusAsync } from "./bookingThunks/bookingUpdateAsync";

// Adjust the import according to your project structure

interface BookingState {
    cart: any[];
    cartTotal: number;
    bookings: any[];
    currentBooking: any;
    pendingTransactions: any[]
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
    limit: 15,
};

export const fetchBookingsAsync = createAsyncThunk(
    'booking/fetchBookings',
    async ({page, limit}: { page: number, limit: number }, {getState, dispatch}) => {
        const state = getState() as { booking: BookingState };
        if (state.booking.fetchedPages.includes(page)) {
            return {bookings: [], page}; // Return empty if already fetched
        }

        const user = getCurrentUser();
        const bookingsRef = collection(firestore, 'bookings');
        let bookingsQuery;

        if (state.booking.bookings.length > 0) {
            const lastBooking = state.booking.bookings[ state.booking.bookings.length - 1 ];
            bookingsQuery = query(
                bookingsRef,
                where('hostId', '==', user.uid),
                orderBy('createdAt', 'desc'),
                startAfter(lastBooking.createdAt),
                fbLimit(limit)
            );
        } else {
            bookingsQuery = query(bookingsRef, where('hostId', '==', user.uid), orderBy('createdAt', 'desc'), fbLimit(limit));
        }
        const hostsBookings = query(bookingsRef, where('hostId', '==', user.uid),)

        const snapshot = await getDocs(bookingsQuery);
        const bookingCountData = await getCountFromServer(hostsBookings)

        const bookings = snapshot.docs.map(doc => doc.data());
        console.log(bookings);
        const bookingCount = bookingCountData.data().count
        return {bookings, page, bookingCount};
    }
);


export const setCurrentBookingById = createAsyncThunk('booking/id', async (id: string, {getState,dispatch, rejectWithValue}) => {
    const mainState = getState() as RootState
    const state = mainState.booking
    try {
        const user = getCurrentUser()
        let booking = state.bookings.find((booking) => booking.id.toString() === id);
        if (booking) {
            return booking;
        } else {
            const bookingRef = doc(firestore, 'bookings', id);
            const bookingData = await getDoc(bookingRef);
            if (!bookingData.exists()) {
                throw Error('Booking not found')
            }
            booking = bookingData.data();
            return booking;
        }
    } catch (error) {

    }
})

export const findBookingByUserId = createAsyncThunk('booking/userId', async (id: string,{getState,dispatch}) => {
    const mainState = getState() as RootState
    const state = mainState.booking
    try {
        let booking = state.bookings.find((booking) => booking.accountId === id)
        if (booking) {
            return booking;
        } else {
            const bookingRef = query(collection(firestore, 'bookings'),where('accountId', '==', id), orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(bookingRef);
           if (snapshot.docs.length > 0) {
               dispatch(setBookings([snapshot.docs[0],state.bookings]))
               return snapshot.docs[0];
           }
        }
    } catch (error) {
        console.error('Error finding booking by userId ', id);
    }
})


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

        setIsLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload;
        },
        resetBookingError: (state) => {
            state.hasError = false;
            state.errorMessage = '';
        }
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
                page: number,
                bookingCount?: number,
            }>) => {
                const {page, bookings, bookingCount} = action.payload;
               if (bookingCount) {
                   state.bookingCount = bookingCount;
               }
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
                if (state.currentBooking.id === action.payload.booking.id) {
                    state.currentBooking = {
                        ...state.currentBooking,
                        status: action.payload.status,
                    };
                }
            })
            .addCase(updateBookingStatusAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.hasError = true;
                state.errorMessage = action.error.message || 'Failed to update booking';
            })
            .addCase(fetchStatistics.pending, (state) => {
                state.isLoading = true
            })
            .addCase(fetchStatistics.fulfilled, (state, action) => {
                state.stats = action.payload;
                state.isLoading = false;
            }).addCase(fetchStatistics.rejected, (state, action) => {
            state.isLoading = false
        }).addCase(setCurrentBookingById.pending, (state, action) => {
            state.isLoading = true;
        }).addCase(setCurrentBookingById.fulfilled, (state, action) => {
            state.isLoading = false
            state.currentBooking = action.payload;
        }).addCase(setCurrentBookingById.rejected, (state, action) => {
            state.isLoading = false
            state.errorMessage = 'Booking Not Found'
            state.hasError = true
        }).
        addCase(findBookingByUserId.pending, (state) => {
            state.isLoading = true;
            state.hasError = false;
            state.errorMessage = '';
        })
            .addCase(findBookingByUserId.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload) {
                    if (state.currentBooking.id === action.payload.id) {
                        state.currentBooking = action.payload;
                    }
                } else {
                    state.errorMessage = 'No booking found for the given user ID';
                    state.hasError = true;
                }
            })
            .addCase(findBookingByUserId.rejected, (state) => {
                state.isLoading = false;
                state.hasError = true;
                state.errorMessage = 'Error finding booking by user ID';
            });
    }
});


export {updateBookingStatusAsync, fetchStatistics}
export const {
    resetBooking,
    updateCart,
    setBookings,
    setIsLoading,
    setPage,
    resetBookingError
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
