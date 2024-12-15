import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {average, collection, count, doc, getAggregateFromServer, getDocs, query, sum} from "firebase/firestore";
import {getCurrentUser} from "@/data/hotelsData";
import {firestore} from "@/lib/firebase";
import {RootState} from "@/data/store";
import {setDoc, writeBatch} from "@firebase/firestore";
import {isAfter} from "date-fns";
import {getServerTime, handler_url} from "@/lib/utils";
import axios from "axios";
import {PawaPayCountryData} from "@/lib/types";

interface Transaction {
    id: string,
    amount: number,
    currency: string,
    paymentData: any,
    date: string,
    availableDate: string
}
export interface IPaystackBank {
    name: string;
    slug: string;
    code: string;
    longcode: string;
    gateway: string | null;
    pay_with_bank: boolean;
    active: boolean;
    is_deleted: boolean;
    country: string;
    currency: string;
    type: string;
    id: number;
    createdAt: string;
    updatedAt: string;
}
export interface IWithdrawalAccount {
    userId: string; // MongoDB ObjectId is stored as a string
    type: string;
    name: string;
    accountNumber: string;
    bankCode?: string;
    currency?: string;
    bankName?: string;
    recipient_code?: string;
    service: 'Pawapay' | 'Paystack' | 'Paystack_KE';
    createdAt?: Date; // Date with a default value
    active?: boolean; // Boolean with a default value
    flagged?: boolean; // Boolean with a default value
    reason?: string; // String with a default value
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
    banks: IPaystackBank[];
    withdrawalAccounts: IWithdrawalAccount[]
    pawapayConfigs: PawaPayCountryData[]
    exchangeRates: any,
    currency: string;
    paymentMethod: string;
    paymentCurrency: string;
    paymentRate: number;

}

const initialState: TransactionsState = {
    currency: "USD", exchangeRates: {}, paymentCurrency: "KES", paymentMethod: "", paymentRate: 0,
    pendingTransactions: [],
    completedTransactions: [],
    pendingBalance: 0,
    availableBalance: 0,
    withdrawList: [],
    isLoading: false,
    hasError: false,
    averageEarnings: 0,
    errorMessage: '',
    banks: [],
    withdrawalAccounts: [],
    pawapayConfigs:[]
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

export const addWithdrawalAccount = createAsyncThunk(
    'payout/addWithdrawalAccount',
    async (withdrawalData: {
        type: string,
        name: string,
        accountNumber: string,
        bankCode: string,
        currency: string,
        bankName: string
    }, {rejectWithValue}) => {
        try {
            const user = getCurrentUser();
            const response = await axios.post(`${handler_url}/payments/createWithdrawalAccount`, {
                userId: user.uid,
                ...withdrawalData
            })
            const hostsRef = collection(firestore, 'hosts', user.uid, 'accounts');
            const accountDoc = doc(hostsRef)
            await setDoc(accountDoc, {
                id: user.uid,
                type: withdrawalData.type,
                name: withdrawalData.name,
                userId: user.uid,
                accountNumber:withdrawalData.accountNumber,
                bankCode:withdrawalData.bankCode,
                currency:withdrawalData.currency,
                bankName:withdrawalData.bankName,
            })
        } catch (error: unknown) {
            console.log(error);
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            } else {
                return rejectWithValue('Error adding withdrawal account');
            }
        }
    }
);
export const getPaystackBanks = createAsyncThunk(
    'payout/getPaystackBanks',
    async (currency: string, {rejectWithValue}) => {
        try {
            const response = await axios.get(`${handler_url}/api/payments/banks`, {
                params: {currency},
            });
            console.log(response.data.data);
            return response.data.data;
        } catch (error: unknown) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            } else {
                return rejectWithValue('Error getting Paystack banks');
            }
        }
    }
);


export const fetchWithdrawalAccounts = createAsyncThunk(
    'transactions/getAccounts',
    async (_, { rejectWithValue }) => {
        try {
            let accounts: Array<any> = [];
            const user = getCurrentUser();
           const hostsRef = collection(firestore, 'hosts', user.uid, 'accounts');
            const accountSnapshot = await getDocs(hostsRef);

            accountSnapshot.docs.map(value => accounts.push(value.data()));
            return accounts;
        } catch (error) {
            return rejectWithValue('Failed to fetch withdrawal accounts');
        }
    }
);

export const fetchExchangeRates = createAsyncThunk(
    'confirmBooking/fetchExchangeRates',
    async (_, { getState,dispatch,rejectWithValue }) => {

        try {

            let fromCurrency = 'USD';

            const response = await fetch(`https://open.er-api.com/v6/latest/${fromCurrency}`);

            const data = await response.json();
            // dispatch(setExchangeRates({rates: data.rates, currency: data.base_code}))
            return {rates: data.rates, currency: data.base_code};
        } catch (error) {
            rejectWithValue('Error fetching the currency exchange')
            console.error('Error fetching exchange rates:', error);
        }
    }
);

export const fetchPawaPayConfigs = createAsyncThunk(
    'confirmBooking/fetchPawaPayConfigs', async (_, {rejectWithValue}) => {
        try {
            const res = await axios.get(`${handler_url}/api/payments/configs`)
            return res.data.data;
        } catch (e) {
            return rejectWithValue('Error fetching payment configs')
        }
    }
)

const transactionsSlice = createSlice({
        name: 'transactions',
        initialState: initialState,
        reducers: {
            resetTransactionsError: (state) => {
                state.hasError = false;
                state.errorMessage = '';
            },
            setPaymentMethod: (state,action) => {
                state.paymentMethod = action.payload;
            },

            setPaymentCurrency: (state, action) => {
                state.paymentCurrency = action.payload;
                if (state.exchangeRates){
                    state.paymentRate = state.exchangeRates[action.payload];
                }
            }
        },
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
                .addCase(getPaystackBanks.pending, (state) => {
                    state.isLoading = true;
                }).addCase(getPaystackBanks.fulfilled, (state, action) => {
                state.isLoading = false;
                state.banks = action.payload as IPaystackBank[];
            }).addCase(getPaystackBanks.rejected, (state, action) => {
                state.isLoading = false;
                state.hasError = true;
                state.errorMessage = action.payload as string;
            })

                .addCase(fetchWithdrawalAccounts.pending, (state) => {
                    state.isLoading = true;
                }).addCase(fetchWithdrawalAccounts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.withdrawalAccounts = action.payload;
            }).addCase(fetchWithdrawalAccounts.rejected, (state, action) => {
                state.isLoading = false;
                state.hasError = true;
                state.errorMessage = action.payload as string;
            })
                .addCase(fetchExchangeRates.fulfilled, (state, action) => {
                    console.log('Fetching Rates',action.payload)
                    state.exchangeRates = action.payload?.rates;
                    state.currency = action.payload?.currency || 'GHS';
                    if (action.payload && (action.payload.currency === 'KES' || action.payload.currency === 'GHS') ) {
                        state.paymentCurrency = action.payload.currency;
                        state.paymentRate = action.payload?.rates[action.payload.currency];
                    } else {
                        state.paymentRate = action.payload?.rates[state.paymentCurrency] * 1.035
                    }
                    state.isLoading = false;

                })
                .addCase(fetchExchangeRates.pending, (state) => {
                    state.isLoading = true
                }).addCase(fetchExchangeRates.rejected, (state, action) => {
                    state.isLoading = false;
                state.hasError = true;
                state.errorMessage = action.payload as string || 'An error occurred';
            })

                .addCase(fetchPawaPayConfigs.pending, (state) => {
                    state.hasError = false;
                })
                .addCase(fetchPawaPayConfigs.fulfilled, (state, action) => {
                    state.hasError = false;
                    state.pawapayConfigs = action.payload;
                })
                .addCase(fetchPawaPayConfigs.rejected, (state, action) => {
                    state.hasError = true;
                    state.errorMessage = action.payload as string || 'Error fetching PawaPay payment configs';
                })

        }
    }
)


export const {resetTransactionsError,setPaymentCurrency,setPaymentMethod} = transactionsSlice.actions;
export const selectPendingTransactions = (state: RootState) => state.transactions.pendingTransactions;
export const selectPendingBalance = (state: RootState) => state.transactions.pendingBalance;
export const selectCompletedTransactions = (state: RootState) => state.transactions.completedTransactions;
export const selectAvailableBalance = (state: RootState) => state.transactions.availableBalance;
export const selectWithdrawList = (state: RootState) => state.transactions.withdrawList;
export const selectAverageEarnings = (state: RootState) => state.transactions.averageEarnings;

export default transactionsSlice.reducer;
