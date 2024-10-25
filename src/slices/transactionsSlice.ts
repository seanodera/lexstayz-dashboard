import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {average, collection, count, doc, getAggregateFromServer, getDocs, sum} from "firebase/firestore";
import {getCurrentUser} from "@/data/hotelsData";
import {firestore} from "@/lib/firebase";
import {RootState} from "@/data/store";
import {writeBatch} from "@firebase/firestore";
import {isAfter} from "date-fns";
import {getServerTime} from "@/lib/utils";

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
    averageEarnings: number;
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
    averageEarnings: 0,
    errorMessage: '',
}

export const fetchPendingTransactions = createAsyncThunk(
    'transactions/fetchPending', async (_, {rejectWithValue, dispatch}) => {
        try {
            const user = getCurrentUser()
            const pendingRef = collection(firestore, 'hosts', user.uid, 'pendingTransactions')
            const availableRef = collection(firestore, 'hosts',user.uid, 'availableTransactions')
            const pendingSnapshot = await getDocs(pendingRef);
            const pendingTransactions = pendingSnapshot.docs.map((doc) => doc.data());


            let countData = await getAggregateFromServer(pendingRef, {
                countOfDocs: count(),
                totalAmount: sum('amount'),
                averageAmount: average('amount')

            })
            const today = await getServerTime()
            if (!today){
                throw new Error('Error Getting Server time')
            }

               const batch = writeBatch(firestore)
               let pending = countData.data().totalAmount
               let transactions = pendingTransactions.filter((value) => {
                   const availableDate = new Date(value.availableDate)
                   if (isAfter( today, availableDate)){
                       batch.set(doc(availableRef, value.id),value)
                       batch.delete(doc(pendingRef, value.id))
                       pending = pending - value.amount;
                   }
                   return !isAfter( today, availableDate)
               })
               await batch.commit()
               if (transactions.length !== countData.data().countOfDocs){
                   dispatch(fetchPendingTransactions)
               }



            const availableSnapshot = await getDocs(availableRef)
            const availableTransactions = availableSnapshot.docs.map((doc) => doc.data())
            let availableData = await getAggregateFromServer(availableRef, {
                countOfDocs: count(),
                totalAmount: sum('amount'),
                averageAmount: average('amount')

            })
            const averageEarnings = (countData.data().totalAmount + availableData.data().totalAmount)/(countData.data().countOfDocs + availableData.data().countOfDocs)
            return {pendingTransactions: transactions, pendingBalance: pending,availableTransactions: availableTransactions, availableBalance: availableData.data().totalAmount, averageEarnings: averageEarnings};
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue('An unknown error occurred');
        }
    }
)

export const updateTransactions = createAsyncThunk('transactions', async (_, {rejectWithValue, getState}) => {
    try {

    } catch (error){
        if (error instanceof Error) {
            return rejectWithValue(error.message);
        }
        return rejectWithValue('An unknown error occurred');
    }
})


const transactionsSlice = createSlice({
        name: 'transactions',
        initialState: initialState,
        reducers: {},
        extraReducers: builder => {
            builder.addCase(fetchPendingTransactions.pending, (state, action) => {
                state.isLoading = true;
            }).addCase(fetchPendingTransactions.fulfilled, (state, action) => {
                state.isLoading = false;
                state.pendingTransactions = action.payload.pendingTransactions as Transaction[];
                state.pendingBalance = action.payload.pendingBalance;
                state.completedTransactions = action.payload.availableTransactions as Transaction[];
                state.availableBalance = action.payload.availableBalance;
                state.averageEarnings = action.payload.averageEarnings;
            }).addCase(fetchPendingTransactions.rejected, (state, action) => {
                state.isLoading = false;
                state.hasError = true;
                state.errorMessage = action.payload as string;
            })
        }
    }
)

export const selectPendingTransactions = (state: RootState) => state.transactions.pendingTransactions;
export const selectPendingBalance = (state: RootState) => state.transactions.pendingBalance;
export const selectCompletedTransactions = (state: RootState) => state.transactions.completedTransactions;
export const selectAvailableBalance = (state: RootState) => state.transactions.availableBalance;
export const selectWithdrawList = (state: RootState) => state.transactions.withdrawList;
export const selectAverageEarnings = (state: RootState) => state.transactions.averageEarnings;

export default transactionsSlice.reducer;