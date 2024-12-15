// #file: promotionSlice.ts
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {collection, count, getAggregateFromServer, getDocs, query} from 'firebase/firestore';
import {IPromotion} from "@/lib/types";
import {firestore} from "@/lib/firebase";
import {getCurrentUser, uploadImage} from "@/data/hotelsData";
import {doc, setDoc, where} from "@firebase/firestore";
import {state} from "sucrase/dist/types/parser/traverser/base";
import {handler_url} from "@/lib/utils";
import axios from "axios";
import {RootState} from "@/data/store";
import {differenceInDays, subMinutes} from "date-fns";
import {deleteOldUnconfirmedAdverts} from "@/data/cashierData";


export const getPastAdverts = createAsyncThunk(
    'promotion/getPastAdverts',
    async (_, { rejectWithValue }) => {
        try {
            const user = getCurrentUser();
            const querySnapshot = await getDocs(query(collection(firestore, 'pastAdverts'),where('hostId', '==', user.uid), where('isConfirmed', '==', true)));
            let data:any[] = []
            querySnapshot.forEach(doc => {
                data.push(doc.data())
            })
            return data;
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            } else {
                return rejectWithValue('Error getting past adverts');
            }
        }
    }
);

export const getOngoingFeatures = createAsyncThunk(
    'promotion/getOngoingFeatures',
    async (_, { rejectWithValue }) => {
        try {
            const user = getCurrentUser();
            const querySnapshot = await getDocs(query(collection(firestore, 'featured'),where('hostId', '==', user.uid), where('isConfirmed', '==', true)));
            let data:any[] = []
            querySnapshot.forEach(doc => {
                data.push(doc.data())
            })
            return data;
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            } else {
                return rejectWithValue('Error getting ongoing features');
            }
        }
    }
);

export const getUpcomingAdverts = createAsyncThunk(
    'promotion/getUpcomingAdverts',
    async (_, { rejectWithValue }) => {
        try {
            const user = getCurrentUser();

            const snapQuery = query(collection(firestore, 'adverts'),where('hostId', '==', user.uid), where('isConfirmed', '==', true));
            const querySnapshot = await getDocs(snapQuery);
            let data:any[] = []
            querySnapshot.forEach(doc => {
                data.push(doc.data())
            })
            return data;
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            } else {
                return rejectWithValue('Error getting upcoming adverts');
            }
        }
    }
);
export const checkAvailabilitySync = createAsyncThunk(
    'promotion/checkAvailabilitySync',
    async ({ startDate, endDate }: { startDate: string, endDate: string }, { rejectWithValue }) => {
        try {
            const daysToCheck: string[] = [];
            const currentDate = new Date(startDate);

            await deleteOldUnconfirmedAdverts();

            // Generate an array of all dates within the specified range
            while (currentDate <= new Date(endDate)) {
                daysToCheck.push(currentDate.toISOString().split('T')[0]); // Format YYYY-MM-DD
                currentDate.setDate(currentDate.getDate() + 1);
            }

            for (let day of daysToCheck) {
                // Configure the query based on each day
                const startOfDay = new Date(day).toISOString();
                const endOfDay = new Date(new Date(day).setHours(23, 59, 59, 999)).toISOString();

                // Query to calculate document counts on the server
                const completionRef = query(
                    collection(firestore, 'adverts'),
                    where('startDate', '<=', endOfDay),
                    where('endDate', '>=', startOfDay)
                );

                const featuredRef = query(
                    collection(firestore, 'featured'),
                    where('startDate', '<=', endOfDay),
                    where('endDate', '>=', startOfDay)
                );

                // Aggregate the count of documents for `adverts`
                const advertsAggregateQuery = await getAggregateFromServer(completionRef, {
                    countOfDocs: count(),
                });

                // Aggregate the count of documents for `featured`
                const featuredAggregateQuery = await getAggregateFromServer(featuredRef, {
                    countOfDocs: count(),
                });

                // Extract counts from the aggregated data
                const advertsCount = advertsAggregateQuery.data().countOfDocs || 0;
                const featuredCount = featuredAggregateQuery.data().countOfDocs || 0;

                // Total count for the given day
                const totalCount = advertsCount + featuredCount;

                // If the total count exceeds the daily limit, return unavailable
                if (totalCount >= 8) {
                    return { available: false, message: `Unavailable for date ${day}` };
                }
            }

            // If all days are within limits, return available
            return { available: true };
        } catch (error) {
            console.log(error)
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            } else {
                return rejectWithValue('Failed to check availability.');
            }

        }
    }
);

export const createPromotionAsync = createAsyncThunk('promotion/create',
    async ({promotion, poster}:{promotion: IPromotion, poster: File}, {getState, rejectWithValue}) => {
        try {
            const user = getCurrentUser()
            const {transactions} = getState() as RootState;
            const {pawapayConfigs,paymentCurrency,paymentRate,currency,paymentMethod,availableBalance} = transactions
            const country =
                paymentCurrency === "KES" ? "Kenya" :
                    paymentCurrency === "GHS" ? "Ghana" :
                        pawapayConfigs.find((value) =>
                            value.correspondents.some(correspondent => correspondent.currency === paymentCurrency)
                        )?.country;
            const adRef = collection(firestore, 'adverts');
            const document = doc(adRef)
            const id = document.id
            const amount = 50 * (differenceInDays(promotion.endDate, promotion.startDate) + 1)
            const hostUrl = process.env.NEXT_PUBLIC_HOST
            const res = await axios.post(`${handler_url}/api/payments/createTransaction`, {
                ...promotion,
                email: user.email,
                paymentRate,
                amount:( amount * paymentRate).toFixed(2),
                country: country,
                currency: paymentCurrency,
                paymentMethod,
                availableBalance,
                reference: id,
                callbackUrl: `${hostUrl}/checkout/${id}`
            })
            const { access_code: accessCode, reference, authorization_url, method } = res.data.data;

            const paymentData = { accessCode, reference, authorization_url, method };

            const url = await uploadImage(poster, `promos/${id}`)
            await setDoc(document, {
                ...promotion,
                id,
                hostId: user.uid,
                poster: url,
                paymentCurrency,
                paymentRate,
                currency,
                paymentMethod,
                paymentData: paymentData,
                isConfirmed: false,
                createdAt: new Date().toISOString(),
            })
            return authorization_url;
        } catch (error) {
            console.log(error)
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            } else {
                return rejectWithValue('Failed to create promotion');
            }

        }
    }
)
interface PromotionSate {
    pastAdverts: IPromotion[],
    ongoingFeatures: IPromotion[],
    upcomingAdverts: IPromotion[],
    isAvailable: boolean,
    isAvailableLoading:boolean,
    isAvailableMessage?:string,
    loading: boolean,
    hasError: boolean,
    errorMessage: string,
}

const initialState: PromotionSate = {
    pastAdverts: [],
    ongoingFeatures: [],
    upcomingAdverts: [],
    isAvailable: false,
    isAvailableLoading: false,
    isAvailableMessage: undefined,
    loading: false,
    hasError: false,
    errorMessage: '',
}
// Slice
const promotionSlice = createSlice({
    name: 'promotion',
    initialState: initialState,
    reducers: {
        resetAvailability: (state) => {
            state.isAvailableLoading = false;
            state.isAvailableMessage = undefined;
            state.isAvailable = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getPastAdverts.pending, (state) => {
                state.loading = true;
                state.hasError = false;
            })
            .addCase(getPastAdverts.fulfilled, (state, action) => {
                state.pastAdverts = action.payload;
                state.loading = false;
            })
            .addCase(getPastAdverts.rejected, (state, action) => {
                state.errorMessage = action.error.message || 'Error getting past adverts';
                state.loading = false;
                state.hasError = true;
            })
            .addCase(getOngoingFeatures.pending, (state) => {
                state.loading = true;
                state.hasError = false;
            })
            .addCase(getOngoingFeatures.fulfilled, (state, action) => {
                state.ongoingFeatures = action.payload;
                state.loading = false;
            })
            .addCase(getOngoingFeatures.rejected, (state, action) => {
                state.errorMessage = action.error.message || 'Error getting ongoing features';
                state.loading = false;
                state.hasError = true;
            })
            .addCase(getUpcomingAdverts.pending, (state) => {
                state.loading = true;
                state.hasError = false;
            })
            .addCase(getUpcomingAdverts.fulfilled, (state, action) => {
                state.upcomingAdverts = action.payload;
                state.loading = false;
            })
            .addCase(getUpcomingAdverts.rejected, (state, action) => {
                state.errorMessage = action.error.message || 'Error getting upcoming adverts';
                state.loading = false;
                state.hasError = true;
            })
            .addCase(checkAvailabilitySync.pending, (state) => {
                state.isAvailableLoading = true
            })
            .addCase(checkAvailabilitySync.fulfilled, (state, action) => {
                state.isAvailableLoading = false
                state.isAvailable = action.payload.available;
                state.isAvailableMessage = action.payload.message
            })
            .addCase(checkAvailabilitySync.rejected, (state, action) => {
                state.errorMessage = action.error.message || 'Error checking availability';
                state.hasError = true;
                state.isAvailableLoading = false;
                state.isAvailable = false;
                state.isAvailableMessage = 'Error checking availability';
            })
            .addCase(createPromotionAsync.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(createPromotionAsync.rejected, (state, action) => {
                state.loading = false;
                state.hasError = true;
                state.errorMessage = action.error.message || 'Error creating promotion';
            })
            .addCase(createPromotionAsync.fulfilled, (state, action) => {
                state.loading = false;
            })
        ;
    },
});

export const {resetAvailability} = promotionSlice.actions;
export default promotionSlice.reducer;
