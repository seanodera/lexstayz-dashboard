import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {firestore} from "@/lib/firebase";
import {collection, setDoc, updateDoc} from "@firebase/firestore";
import {doc} from "firebase/firestore";
import {createFile} from "@/lib/utils";
import {getCurrentUser, uploadImage} from "@/data/hotelsData";
import {RootState} from "@/data/store";
import {fetchStaysAsync, setAllStays} from "@/slices/staySlice";


export interface Location {
    street?: string,
    street2?: string,
    district?: string,
    city?: string,
    country: string,
    zipCode?: string,

    [ key: string ]: any;
}

export interface Cancellation {
    cancellation: string,
    rate?: number,
    time?: number,
    timeSpace?: string,
    preDate?: boolean,
}

export interface NewStayState {
    name: string,
    type: string,
    poster: string,
    images: string[],
    description: string,
    facilities: string[],
    checkInTime: string,
    checkOutTime: string,
    published: boolean,
    location: Location,
    cancellation: Cancellation,
    minAge: number,
    smoking: string,
    parties: string,
    pets: string,
    rating: number,
    numReviews: number,
    currency: string,
}

export interface CreateStayState {
    stay: NewStayState,
    isLoading: boolean,
    hasError: boolean,
    errorMessage: string,
}

const initialState: CreateStayState = {
    stay: {
        name: '',
        type: 'Hotel',
        description: '',
        facilities: [],
        checkInTime: '12:00',
        checkOutTime: '14:00',
        poster: '',
        images: [],
        published: false,
        location: {
            street: '',
            street2: '',
            district: '',
            city: '',
            country: '',
            zipCode: '',
        },
        cancellation: {
            cancellation: '',
            rate: 20,
            time: 0,
            timeSpace: 'Days',
            preDate: true,
        },
        minAge: 0,
        smoking: '',
        parties: '',
        pets: '',
        rating: 0,
        currency: 'USD',
        numReviews: 0,
    },
    isLoading: false,
    hasError: false,
    errorMessage: '',
}

export function generateID() {
    const document = doc(collection(firestore, 'stays'))
    return document.id
}

export const uploadStayAsync = createAsyncThunk('createStay/uploadStay', async (_, {
    getState,
    dispatch,
    rejectWithValue
}) => {
    const {createStay, stay} = getState() as RootState;
    try {
        const user = getCurrentUser();
        const userDocRef = doc(firestore, 'hosts', user.uid);
        const staysRef = collection(userDocRef, 'stays');
        const docRef = doc(staysRef);

        const processedStay = {...createStay.stay, id: docRef.id};
        await setDoc(docRef, processedStay);

        const posterFile = await createFile({url: createStay.stay.poster, name: 'poster'});
        const posterURL = await uploadImage(posterFile, `${docRef.id}/poster`);
        await updateDoc(docRef, {poster: posterURL});

        const imageUrls = await Promise.all(createStay.stay.images.map(async (image, index) => {
            const imageFile = await createFile({url: image, name: `image-${index}`});
            return await uploadImage(imageFile, `${docRef.id}/image-${index}`);
        }));
        await updateDoc(docRef, {images: imageUrls});
        // dispatch(fetchStaysAsync)
        dispatch(setAllStays([...stay.stays, {rooms: [],...processedStay, images: imageUrls, poster: posterURL}]))
        return {...processedStay, images: imageUrls, poster: posterURL};
    } catch (error) {
        if (error instanceof Error) {
            return rejectWithValue(error.message);
        }
        return rejectWithValue('An unknown error occurred');

    }
})

const createStaySlice = createSlice({
    name: "createStay",
    initialState: initialState,
    reducers: {
        setStayPartial: (state, action) => {
            state.stay = {
                id: generateID(),
                ...state.stay,
                ...action.payload
            };
        },
        updateLocation: (state, action) => {
            state.stay.location = {...state.stay.location, ...action.payload}
        },
        updateImages: (state, action) => {
            state.stay.images = action.payload.images;
            state.stay.poster = action.payload.poster;
        },
        updateRules: (state, action) => {
            state.stay.checkInTime = action.payload.checkInTime
            state.stay.checkOutTime = action.payload.checkOutTime
            state.stay.minAge = action.payload.minAge
            state.stay.smoking = action.payload.smoking
            state.stay.parties = action.payload.parties
            state.stay.pets = action.payload.pets
        },
        updateCancellation: (state, action: PayloadAction<Cancellation>) => {
            state.stay.cancellation = action.payload;
        },
        updateFacilities: (state, action) => {
            state.stay.facilities = action.payload;
        },
        updateCurrency: (state, action: PayloadAction<string>) => {
            state.stay.currency = action.payload;
        },
        resetCreateStayError: (state) => {
            state.hasError = false;
            state.errorMessage = '';
        }
    },
    extraReducers: builder => {
        builder.addCase(uploadStayAsync.pending, (state, action) => {
            state.isLoading = true;
        })
            .addCase(uploadStayAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.hasError = false;
                state.errorMessage = '';
                state.stay = initialState.stay;
            })
            .addCase(uploadStayAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.hasError = true;
                state.errorMessage = action.payload as string;

            })
    }
})

export const selectPartialStay = (state: any) => state.createStay.stay;
export const selectPartialLoading = (state: any) => state.createStay.isLoading;
export const selectPartialHasError = (state: any) => state.createStay.hasError;
export const selectPartialErrorMessage = (state: any) => state.createStay.errorMessage;
export const {
    setStayPartial, updateLocation, updateImages, updateRules, updateCancellation,
    updateFacilities, updateCurrency,resetCreateStayError
} = createStaySlice.actions;
export default createStaySlice.reducer
