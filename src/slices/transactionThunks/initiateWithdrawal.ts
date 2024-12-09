import {createAsyncThunk} from "@reduxjs/toolkit";
import {async} from "@firebase/util";
import {getCurrentUser} from "@/data/hotelsData";
import {handler_url} from "@/lib/utils";
import { doc, setDoc } from 'firebase/firestore';
import axios from 'axios';
import {firestore} from "@/lib/firebase";

interface AccountData {
    type: string;
    name: string;
    accountNumber: string;
    bankCode: string;
    currency: string;
    bankName: string;
}

export const addWithdrawalAccount = createAsyncThunk(
    'transactions/addWithdrawalAccount',
    async (accountData: AccountData, { getState, dispatch }) => {
        const user = getCurrentUser();
        const hostId = user.uid;

        const { type, name, accountNumber, bankCode, currency, bankName } = accountData;

        try {
            let withdrawalAccount;

            if (currency === 'GHS') {
                // Call the API to create a Paystack recipient
                const response = await axios.post(`${handler_url}/api/payments/createPaystackRecipient`, {
                    userId: hostId,
                    type,
                    name,
                    accountNumber,
                    bankCode,
                    currency,
                });

                const recipient = response.data;

                withdrawalAccount = {
                    userId: hostId,
                    type: recipient.type,
                    name,
                    accountNumber,
                    bankCode,
                    bankName,
                    currency,
                    recipient_code: recipient.recipient_code,
                    service: 'Paystack',
                };
            } else {
                withdrawalAccount = {
                    userId: hostId,
                    type: 'MSISDN',
                    name,
                    accountNumber,
                    currency,
                    bankCode,
                    service: 'Pawapay',
                };
            }

            const docRef = doc(firestore, `hosts/${hostId}/withdrawalAccount`, accountNumber);
            await setDoc(docRef, withdrawalAccount);

            return { data: withdrawalAccount, success: true };
        } catch (error: any) {
            throw new Error('Error adding withdrawal account: ' + error.message);
        }
    }
);

export const initiateWithdrawalAsync = createAsyncThunk('transactions/initiateWithdrawal', async (_,{getState}) => {
    try {
        const user = getCurrentUser();
        const hostId = user.uid;
    } catch (error) {

    }

})
