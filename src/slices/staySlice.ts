import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

import {Home, Hotel, Room, Stay} from "@/lib/types";
import {fetchStaysAsync} from "@/slices/stayThunks/fetchStaysThunk";
import {updateRoomAsync} from "@/slices/stayThunks/updateRoomThunk";
import {publishStayAsync} from "@/slices/stayThunks/publishStayThunk";
import {unPublishStayAsync} from "@/slices/stayThunks/unPublishStayThunk";
import {deleteStayAsync} from "@/slices/stayThunks/deleteStayThunk";
import {updateStayAsync} from "@/slices/stayThunks/updateStayThunk";
import uploadStayAsync from "@/slices/stayThunks/uploadStayThunk";
import {addRoomAsync} from "@/slices/stayThunks/addRoomThunk";
import {RootState} from "@/data/store";
import {collection, doc} from "@firebase/firestore";
import {firestore} from "@/lib/firebase";
import {getDoc} from "firebase/firestore";
import {getCurrentUser} from "@/data/hotelsData";
import {state} from "sucrase/dist/types/parser/traverser/base";


interface StayState {
    stays: (Home | Hotel)[];
    currentStay: (Home | Hotel);
    currentId: number | string;
    isLoading: boolean;
    hasError: boolean;
    errorMessage: string;
    hasRun: boolean;
    occupancy: {
        vacant: number,
        booked: number,
    }
}

const initialState: StayState = {
    stays: [],
    currentStay: {} as (Home | Hotel),
    currentId: -1,
    isLoading: false,
    hasError: false,
    errorMessage: '',
    hasRun: false,
    occupancy: {
        vacant: 0,
        booked: 0,
    }
};

// export const uploadStayAsync = createAsyncThunk(
//     'stay/uploadStay',
//     async ({ stay, poster, images }: { stay: any, poster: string, images: string[] }) => {
//         await uploadStay(stay, poster, images);
//         return stay;
//     }
// );
//
// export const addRoomAsync = createAsyncThunk(
//     'stay/addRoom',
//     async ({ room, stayId, poster, images }: { room: any, stayId: string, poster?: string, images: string[] }) => {
//         const updated = await addRoomFirebase(room, stayId, images, poster);
//         return { room: updated, stayId };
//     }
// );
//
// export const fetchStaysAsync = createAsyncThunk(
//     'stay/fetchStays',
//     async () => {
//         const stays = await getStaysFirebase();
//         return stays;
//     }
// );
//
// export const updateRoomAsync = createAsyncThunk(
//     'stay/updateRoom',
//     async ({ room, previousRoom, stayId, roomId, poster, images }: {
//         room: any,
//         previousRoom: any,
//         stayId: string,
//         roomId: string,
//         poster?: string,
//         images?: string[]
//     }) => {
//         const updated = await updateRoomFirebase(room, previousRoom, stayId, roomId, poster, images);
//         return { room: updated, stayId };
//     }
// );
//
// export const updateStayAsync = createAsyncThunk(
//     'stay/updateStay', async ({stay, newStay, poster, images}: {
//         stay: any, newStay: any, poster: string, images: string[]
//     }) => {
//         const updated = await updateStayFirebase(stay, newStay, poster, images)
//         return updated;
//     }
// )
//
// export const publishStayAsync = createAsyncThunk(
//     'stay/publishStay',
//     async (stay: Stay) => {
//         await publishStayFirebase(stay);
//         return stay;
//     }
// );
//
// export const unPublishStayAsync  = createAsyncThunk(
//     'stay/unPublishStay',
//     async (stay: Stay) => {
//         await unPublishStay(stay);
//         return stay;
//     }
// );
//
// export const deleteStayAsync  = createAsyncThunk(
//     'stay/deleteStay',
//     async (stay: Stay) => {
//         await deleteStay(stay);
//         return stay.id;
//     }
// );

export const setCurrentStayFromId = createAsyncThunk('stays/setCurrentStayFromId',
    async (id: string, {getState, dispatch, rejectWithValue}) => {
        try {
            const user = getCurrentUser();
            const {stay} = getState() as RootState

            const currentStay = stay.stays.find((value) => value.id === id);
            if (currentStay) {
                console.log('Current Stay local')
                return currentStay;
            } else {
                const staysRef = collection(firestore, 'hosts', user.uid, 'stays');
                const snapshot = await getDoc(doc(staysRef, id));

               if (snapshot.exists()){
                   const data = snapshot.data() as Stay
                   console.log('Gotten from firebase: ', data)
                   return data;
               } else {
                   throw new Error('')
               }

            }
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            } else {
                return rejectWithValue('An unknown error occurred');
            }
        }
    })


const staySlice = createSlice({
    name: "stay",
    initialState,
    reducers: {
        setCurrentStay: (state, action: PayloadAction<(Home | Hotel)>) => {
            state.currentStay = action.payload;
            state.currentId = -1;
        },
        setAllStays: (state, action: PayloadAction<any[]>) => {
            state.stays = action.payload;
        },
        resetHasRun: (state) => {
            state.hasRun = false;
        },
        setIsLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        resetStayError: (state) => {
            state.hasError = false;
            state.errorMessage = '';
        }
    },
    extraReducers: (builder) => {
        builder.addCase(setCurrentStayFromId.pending, (state, action) => {
            state.isLoading = true;
        })
            .addCase(setCurrentStayFromId.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentStay = action.payload as (Home | Hotel);
            })
            .addCase(setCurrentStayFromId.rejected, (state, action) => {
                state.isLoading = false;
                state.hasError = true;
                state.errorMessage = action.payload as string || 'Failed to set current stay';
            })
            .addCase(uploadStayAsync.pending, (state) => {
                state.isLoading = true;
                state.hasError = false;
                state.errorMessage = '';
            })
            .addCase(uploadStayAsync.fulfilled, (state, action: PayloadAction<(Home | Hotel)>) => {
                state.isLoading = false;

                // Add the new stay to the stays array
                state.stays.push(action.payload);

                // Update the currentStay if the uploaded stay matches its ID
                if (state.currentStay && state.currentStay.id === action.payload.id) {
                    state.currentStay = action.payload;
                }
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
                const stayIndex = state.stays.findIndex((stay:Stay) => stay.id === action.payload.stayId);
                const stay = state.stays[ stayIndex ];
                if (stay) {
                    (stay as Hotel).rooms.push(action.payload.room);
                }
                if (state.currentStay && state.currentStay.id === action.payload.stayId) {
                    (state.currentStay as Hotel).rooms.push(action.payload.room);
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
            .addCase(fetchStaysAsync.fulfilled, (state, action: PayloadAction<{ stays: any[ ], occupancy: any }>) => {
                state.isLoading = false;
                state.stays = action.payload.stays;
                state.occupancy = action.payload.occupancy;
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
            .addCase(updateRoomAsync.fulfilled, (state, action: PayloadAction<{ room: Room; stayId: string }>) => {
                state.isLoading = false;

                // Find the stay index in the stays array
                const stayIndex = state.stays.findIndex((stay: Home | Hotel) => stay.id === action.payload.stayId);
                const stay = state.stays[stayIndex];

                if (stay && (stay as Hotel).type === 'Hotel') {
                    // Ensure stay is a Hotel and update the room
                    (state.stays[stayIndex] as Hotel).rooms = (stay as Hotel).rooms.map((room: Room) =>
                        room.id === action.payload.room.id ? action.payload.room : room
                    );
                }

                // Update the currentStay if it matches the updated stayId
                if (state.currentStay && state.currentStay.id === action.payload.stayId) {
                    (state.currentStay as Hotel).rooms = (state.currentStay as Hotel).rooms.map((room: Room) =>
                        room.id === action.payload.room.id ? action.payload.room : room
                    );
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
                const stayIndex = state.stays.findIndex((stay:Stay) => stay.id === action.payload.id);
                if (stayIndex !== -1) {
                    state.stays[ stayIndex ].published = true;
                }
                if ((state.currentStay && state.currentStay.id === action.payload.id) ){
                    state.currentStay.published = true;
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
                const stayIndex = state.stays.findIndex((stay:Stay) => stay.id === action.payload.id);
                if (stayIndex !== -1) {
                    state.stays[ stayIndex ].published = false;
                }
                if ((state.currentStay && state.currentStay.id === action.payload.id) ){
                    state.currentStay.published = false;
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
                state.stays = state.stays.filter((stay:Stay) => stay.id !== action.payload);
            })
            .addCase(deleteStayAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.hasError = true;
                state.errorMessage = action.error.message || 'Failed to delete stay';
            })
            .addCase(updateStayAsync.pending, (state) => {
                state.isLoading = true;
                state.hasError = false;
                state.errorMessage = '';
            })
            .addCase(updateStayAsync.fulfilled, (state, action) => {
                state.isLoading = false
                const stayIndex = state.stays.findIndex((stay:Stay) => stay.id === action.payload.id);
                if (stayIndex !== -1) {
                    state.stays[ stayIndex ] = action.payload;
                }
                if ((state.currentStay && state.currentStay.id === action.payload.id) ){
                    state.currentStay = action.payload;
                }
            })
            .addCase(updateStayAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.hasError = true;
                state.errorMessage = action.error.message || 'Failed to delete stay';
            });
    }
});

export {
    updateStayAsync,
    deleteStayAsync,
    unPublishStayAsync,
    publishStayAsync,
    fetchStaysAsync,
    updateRoomAsync,
    uploadStayAsync,
    addRoomAsync
}

export const {
    setCurrentStay,
    setAllStays,
    resetHasRun,
    setIsLoading,
    resetStayError
} = staySlice.actions;

export const selectOccupancy = (state: RootState) => state.stay.occupancy
export const selectCurrentStay = (state: RootState) => state.stay.currentStay;
export const selectAllStays = (state: RootState) => state.stay.stays;
export const selectCurrentId = (state: RootState) => state.stay.currentId;
export const selectIsLoading = (state: RootState) => state.stay.isLoading;
export const selectHasError = (state: RootState) => state.stay.hasError;
export const selectErrorMessage = (state: RootState) => state.stay.errorMessage;
export const selectHasRun = (state: RootState) => state.stay.hasRun;

export default staySlice.reducer;
