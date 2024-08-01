import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    uploadStay,
    addRoomFirebase,
    getStaysFirebase,
    updateRoomFirebase,
    publishStayFirebase,
    unPublishStay,
    deleteStay
} from "@/data/hotelsData";
import { Dates, Stay } from "@/lib/types";

interface StayState {
    stays: Stay[];
    currentStay: Stay;
    currentId: number | string;
    isLoading: boolean;
    hasError: boolean;
    errorMessage: string;
    hasRun: boolean;
}

const initialState: StayState = {
    stays: [],
    currentStay: {} as Stay,
    currentId: -1,
    isLoading: false,
    hasError: false,
    errorMessage: '',
    hasRun: false
};

export const uploadStayAsync = createAsyncThunk(
    'stay/uploadStay',
    async ({ stay, poster, images }: { stay: Stay, poster: string, images: string[] }) => {
        await uploadStay(stay, poster, images);
        return stay;
    }
);

export const addRoomAsync = createAsyncThunk(
    'stay/addRoom',
    async ({ room, stayId, poster, images }: { room: any, stayId: string, poster?: string, images: string[] }) => {
        const updated = await addRoomFirebase(room, stayId, images, poster);
        return { room: updated, stayId };
    }
);

export const fetchStaysAsync = createAsyncThunk(
    'stay/fetchStays',
    async () => {
        const stays = await getStaysFirebase();
        return stays;
    }
);

export const updateRoomAsync = createAsyncThunk(
    'stay/updateRoom',
    async ({ room, previousRoom, stayId, roomId, poster, images }: {
        room: any,
        previousRoom: any,
        stayId: string,
        roomId: string,
        poster?: string,
        images?: string[]
    }) => {
        const updated = await updateRoomFirebase(room, previousRoom, stayId, roomId, poster, images);
        return { room: updated, stayId };
    }
);

export const publishStayAsync:any = createAsyncThunk(
    'stay/publishStay',
    async (stay: Stay) => {
        await publishStayFirebase(stay);
        return stay;
    }
);

export const unPublishStayAsync:any  = createAsyncThunk(
    'stay/unPublishStay',
    async (stay: Stay) => {
        await unPublishStay(stay);
        return stay;
    }
);

export const deleteStayAsync:any  = createAsyncThunk(
    'stay/deleteStay',
    async (stay: Stay) => {
        await deleteStay(stay);
        return stay.id;
    }
);

const staySlice = createSlice({
    name: "stay",
    initialState,
    reducers: {
        setCurrentStay: (state, action: PayloadAction<Stay>) => {
            state.currentStay = action.payload;
            state.currentId = -1;
        },
        setCurrentStayFromId: (state, action: PayloadAction<string | number>) => {
            const currentStay = state.stays.find((value) => value.id === action.payload);
            state.currentId = action.payload;
            state.currentStay = currentStay ? currentStay : ({} as Stay);
        },
        setAllStays: (state, action: PayloadAction<Stay[]>) => {
            state.stays = action.payload;
        },
        resetHasRun: (state) => {
            state.hasRun = false;
        },
        setIsLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
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
            .addCase(addRoomAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                const stayIndex = state.stays.findIndex((stay) => stay.id === action.payload.stayId);
                const stay = state.stays[stayIndex];
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
                state.hasRun = true;
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
            })
            .addCase(updateRoomAsync.pending, (state) => {
                state.isLoading = true;
                state.hasError = false;
                state.errorMessage = '';
            })
            .addCase(updateRoomAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                const stayIndex = state.stays.findIndex((stay) => stay.id === action.payload.stayId);
                const stay = state.stays[stayIndex];
                if (stay) {
                    stay.rooms = stay.rooms.map((room) => room.id === action.payload.room.id ? action.payload.room : room);
                }
            })
            .addCase(updateRoomAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.hasError = true;
                state.errorMessage = action.error.message || 'Failed to update room';
            })
            .addCase(publishStayAsync.pending, (state) => {
                state.isLoading = true;
                state.hasError = false;
                state.errorMessage = '';
            })
            .addCase(publishStayAsync.fulfilled, (state, action: PayloadAction<Stay>) => {
                state.isLoading = false;
                const stayIndex = state.stays.findIndex((stay) => stay.id === action.payload.id);
                if (stayIndex !== -1) {
                    state.stays[stayIndex].published = true;
                }
            })
            .addCase(publishStayAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.hasError = true;
                state.errorMessage = action.error.message || 'Failed to publish stay';
            })
            .addCase(unPublishStayAsync.pending, (state) => {
                state.isLoading = true;
                state.hasError = false;
                state.errorMessage = '';
            })
            .addCase(unPublishStayAsync.fulfilled, (state, action: PayloadAction<Stay>) => {
                state.isLoading = false;
                const stayIndex = state.stays.findIndex((stay) => stay.id === action.payload.id);
                if (stayIndex !== -1) {
                    state.stays[stayIndex].published = false;
                }
            })
            .addCase(unPublishStayAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.hasError = true;
                state.errorMessage = action.error.message || 'Failed to unpublish stay';
            })
            .addCase(deleteStayAsync.pending, (state) => {
                state.isLoading = true;
                state.hasError = false;
                state.errorMessage = '';
            })
            .addCase(deleteStayAsync.fulfilled, (state, action: PayloadAction<string>) => {
                state.isLoading = false;
                state.stays = state.stays.filter((stay) => stay.id !== action.payload);
            })
            .addCase(deleteStayAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.hasError = true;
                state.errorMessage = action.error.message || 'Failed to delete stay';
            });
    }
});

export const {
    setCurrentStay,
    setAllStays,
    setCurrentStayFromId,
    resetHasRun,
    setIsLoading,
} = staySlice.actions;

export const selectCurrentStay = (state: any) => state.stay.currentStay;
export const selectAllStays = (state: any) => state.stay.stays;
export const selectCurrentId = (state: any) => state.stay.currentId;
export const selectIsLoading = (state: any) => state.stay.isLoading;
export const selectHasError = (state: any) => state.stay.hasError;
export const selectErrorMessage = (state: any) => state.stay.errorMessage;
export const selectHasRun = (state: any) => state.stay.hasRun;

export default staySlice.reducer;
