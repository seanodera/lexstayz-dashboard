import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {average, collection, count, doc, getAggregateFromServer, getDocs, sum} from "firebase/firestore";
import {getCurrentUser} from "@/data/hotelsData";
import {firestore} from "@/lib/firebase";
import {state} from "sucrase/dist/types/parser/traverser/base";
import {RootState} from "@/data/store";

interface Transaction {
    id: string,
    amount: number,
    currency: string,
    paymentData: any,
    date: string,
    availableDate: string
}

interface TransactionsState {
    pendingTransactions: Transaction[];
    completedTransactions: Transaction[];
    pendingBalance: number;
    availableBalance: number;
    withdrawList: Transaction[];
    isLoading: boolean;
    hasError: boolean;
    errorMessage: string;

}

const initialState: TransactionsState = {
    pendingTransactions: [],
    completedTransactions: [],
    pendingBalance: 0,
    availableBalance: 0,
    withdrawList: [],
    isLoading: false,
    hasError: false,
    errorMessage: '',
}

export const fetchPendingTransactions = createAsyncThunk(
    'transactions/fetchPending', async (_,{rejectWithValue}) => {
        try {
            const user = getCurrentUser()
            const pendingRef = collection(firestore,'hosts', user.uid, 'pendingTransactions')
            const pendingSnapshot = await getDocs(pendingRef);
            const pendingTransactions = pendingSnapshot.docs.map((doc) => doc.data());

            let countData = await getAggregateFromServer(pendingRef, {
                countOfDocs: count(),
                totalAmount: sum('amount'),
                averageAmount: average('amount')

            })


            return { pendingTransactions:pendingTransactions , pendingBalance: countData.data().totalAmount};
        } catch (error){
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue('An unknown error occurred');
        }
    }
)


const transactionsSlice = createSlice({
    name: 'transactions',
    initialState: initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchPendingTransactions.pending, (state, action) => {
            state.isLoading = true;
        }).addCase(fetchPendingTransactions.fulfilled, (state,action) => {
            state.isLoading = false;
            state.pendingTransactions = action.payload.pendingTransactions as Transaction[];
            state.pendingBalance = action.payload.pendingBalance;
        }).addCase(fetchPendingTransactions.rejected, (state,action) => {
            state.isLoading = false;
            state.hasError = true;
            state.errorMessage = action.payload as string;
        })
    }
    }
)

export const selectPendingTransactions = (state:RootState) => state.transactions.pendingTransactions;
export const selectPendingBalance = (state: RootState) => state.transactions.pendingBalance;
export const selectCompletedTransactions = (state:RootState) => state.transactions.completedTransactions;
export const selectAvailableBalance = (state: RootState) => state.transactions.availableBalance;
export const selectWithdrawList = (state: RootState) => state.transactions.withdrawList;

export default transactionsSlice.reducer;