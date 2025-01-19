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
        const {withdrawalAccounts, exchangeRates} = state.transactions;
        const {user: host} = state.authentication
        const user = getCurrentUser()
        const account = withdrawalAccounts[0];
        const id = docRef.id;
        if (!host){
            return rejectWithValue("No account found.");
        }
        const payoutDocument = {
            id: id,
            hostId: user.uid,
            account: account,
            currency: account.currency,
            method: account.service,
            amount: exchangeRates[account.currency] * host.balance.available,
            originalAmount: host.balance.available,
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
