import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addDays, differenceInDays } from "date-fns";
import { uploadStay, addRoomFirebase, getStaysFirebase } from "@/data/hotelsData";

// Define types for the state
export interface Stay {
    id: string;
    rooms: any[];
    [key: string]: any;
}

interface Dates {
    startDate: string;
    endDate: string;
    length: number;
}

interface Balance {
    available: number;
    pending: number;
}

interface WithdrawAccount {
    method: string;
    account: string;
}

interface Withdraw {
    account: WithdrawAccount;
    withdrawals: any[];
}

interface BookingState {
    cart: any[];
    currentStay: Stay;
    currentId: number | string;
    stays: Stay[];
    cartTotal: number;
    bookings: any[];
    currentBooking: any;
    dates: Dates;
    balance: Balance;
    withdraw: Withdraw;
    isLoading: boolean;
    hasError: boolean;
    errorMessage: string;
    hasRun: boolean;
}

const initialState: BookingState = {
    cart: [],
    currentStay: {} as Stay,
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
    },
    isLoading: false,
    hasError: false,
    errorMessage: '',
    hasRun: false
};

// Create async thunks
export const uploadStayAsync = createAsyncThunk(
    'booking/uploadStay',
    async ({ stay, poster, images }: { stay: Stay, poster: string, images: string[] }) => {
        await uploadStay(stay, poster, images);
        return stay;
    }
);

export const addRoomAsync = createAsyncThunk(
    'booking/addRoom',
    async ({ room, stayId, poster, images }: { room: any, stayId: string, poster: string, images: string[] }) => {
        await addRoomFirebase(room, stayId, poster, images);
        return { room, stayId };
    }
);

export const fetchStaysAsync = createAsyncThunk(
    'booking/fetchStays',
    async () => {
        const stays = await getStaysFirebase();
        return stays;
    }
);

const bookingSlice = createSlice({
    name: "booking",
    initialState,
    reducers: {
        resetBooking: (state) => {
            state.cart = [];
            state.currentId = -1;
            state.currentStay = {} as Stay;
        },
        setAllStays: (state, action: PayloadAction<Stay[]>) => {
            state.stays = action.payload;
        },
        setCurrentStay: (state, action: PayloadAction<Stay>) => {
            state.currentStay = action.payload;
            state.currentId = -1;
        },
        setCurrentStayFromId: (state, action: PayloadAction<string | number>) => {
            state.currentId = action.payload;
            const currentStay = state.stays.find((value) => value.id === action.payload);
            console.log(currentStay);
            state.currentStay = currentStay ? currentStay : ({} as Stay);
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
            const currentBooking = state.bookings.find((booking) => booking.bookingId.toString() === action.payload.toString());
            state.currentBooking = currentBooking ? currentBooking : {};
        },
        setWithdraw: (state, action: PayloadAction<Withdraw>) => {
            state.withdraw = action.payload;
        },
        setBalance: (state, action: PayloadAction<Balance>) => {
            state.balance = action.payload;
        },
        resetHasRun: (state) => {
            state.hasRun = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(uploadStayAsync.pending, (state) => {
                state.isLoading = true;
                state.hasError = false;
                state.errorMessage = '';
            })
            .addCase(uploadStayAsync.fulfilled, (state, action: PayloadAction<Stay>) => {
                state.isLoading = false;
                state.stays.push(action.payload);
            })
            .addCase(uploadStayAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.hasError = true;
                state.errorMessage = action.error.message || 'Failed to upload stay';
            })
            .addCase(addRoomAsync.pending, (state) => {
                state.isLoading = true;
                state.hasError = false;
                state.errorMessage = '';
            })
            .addCase(addRoomAsync.fulfilled, (state, action: PayloadAction<{ room: any; stayId: string }>) => {
                state.isLoading = false;
                const stay = state.stays.find((stay) => stay.id === action.payload.stayId);
                if (stay) {
                    stay.rooms.push(action.payload.room);
                }
            })
            .addCase(addRoomAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.hasError = true;
                state.errorMessage = action.error.message || 'Failed to add room';
            })
            .addCase(fetchStaysAsync.pending, (state) => {
                state.isLoading = true;
                state.hasError = false;
                state.errorMessage = '';
            })
            .addCase(fetchStaysAsync.fulfilled, (state, action: PayloadAction<Stay[]>) => {
                state.isLoading = false;
                state.stays = action.payload;
                state.hasRun = true;
            })
            .addCase(fetchStaysAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.hasError = true;
                state.errorMessage = action.error.message || 'Failed to fetch stays';
            });
    }
});

export const {
        setCurrentStay,
    resetBooking,
    setAllStays,
    setCurrentStayFromId,
    updateCart,
    updateDates,
    setBookings,
    setCurrentBookingById,
    setWithdraw,
    setBalance,
    resetHasRun
} = bookingSlice.actions;

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
export const selectIsLoading = (state: any) => state.booking.isLoading;
export const selectHasError = (state: any) => state.booking.hasError;
export const selectErrorMessage = (state: any) => state.booking.errorMessage;
export const selectHasRun = (state: any) => state.booking.hasRun;

export default bookingSlice.reducer;
