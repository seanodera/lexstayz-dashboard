import {createAsyncThunk} from "@reduxjs/toolkit";
import {doc} from "firebase/firestore";
import {firestore} from "@/lib/firebase";
import {RootState} from "@/data/store";
import {getCurrentUser} from "@/data/hotelsData";
import {setDoc} from "@firebase/firestore";


export  const requestPayoutAsync = createAsyncThunk('transactions/requestPayout', async (_, {getState,rejectWithValue}) => {
    try {
        const state = getState() as RootState;
        const docRef = doc(firestore,'payouts');
        const {withdrawalAccounts, exchangeRates, availableBalance} = state.transactions;
        const user = getCurrentUser()
        const account = withdrawalAccounts[0];
        const id = docRef.id;
        const payoutDocument = {
            id: id,
            hostId: user.uid,
            account: account,
            currency: account.currency,
            method: account.service,
            amount: exchangeRates[account.currency] * availableBalance,
            originalAmount: availableBalance,
            approved: false,
            flagged: false,
            createdAt: (new Date).toISOString(),
            status: 'Pending'
        }
        await setDoc(docRef, payoutDocument)
        return payoutDocument;
    } catch (error) {
        return rejectWithValue('Failed to request Payout');
    }

})
