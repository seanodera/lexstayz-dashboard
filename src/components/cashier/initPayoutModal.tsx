'use client'
import {Button, Card, Modal} from "antd";
import {useAppSelector} from "@/hooks/hooks";
import {selectCurrentUser} from "@/slices/authenticationSlice";
import {useEffect, useState} from "react";
import {toMoneyFormat} from "@/lib/utils";


export default function InitPayoutModal({show, setShow}:{show:boolean,setShow:(show:boolean) => void}) {
    const user = useAppSelector(selectCurrentUser);
    const accounts = useAppSelector(state => state.transactions.withdrawalAccounts)
    const account = (accounts.length >= 1) && accounts[0] ;
    const {exchangeRates} = useAppSelector(state => state.transactions)
    const [convertedAmount, setConvertedAmount] = useState(0);
    const availableBalance = user?.balance.available || 0;
    useEffect(() => {
    if (account){
        setConvertedAmount(exchangeRates[account.currency] * availableBalance);
    }
    }, [account, exchangeRates, availableBalance])
    return <Modal open={show} onClose={()=>setShow(false)} onCancel={()=>setShow(false)} footer={null} >
        {account? <div className={'space-y-4'}>
            <div>
                <div className={'flex gap-2'}>
                    <h3 className={'text-xl'}>Total Available: </h3>
                    <h2 className={'text-xl font-bold'}>USD {toMoneyFormat(availableBalance)}</h2>
                </div>
                <div className={'flex gap-2'}>
                   < h3 className={'text-xl'}>Total in {account.currency}: </h3>
                <h2 className={'text-xl font-bold'}>{account.currency} {toMoneyFormat(convertedAmount)}</h2>
                </div>
                <div
                    className={'text-primary font-medium h4 mb-4 '}> 1 USD = {toMoneyFormat(exchangeRates[account.currency])} {account.currency}
                </div>
            </div>
            <div>
                <Card title={<h3 className={'font-bold mb-0'}>Withdrawal Account</h3>} className={'rounded-xl'}>
                    <h3 className={'text-gray-500 font-medium mb-0'}>Account Name</h3>
                    <h3 className={'mb-0'}>{account.name}</h3>
                    <h3 className={'text-gray-500 font-medium mb-0'}>Account Number</h3>
                    <h3 className={'mb-0'}>{'****' + account.accountNumber.slice(-4)}</h3>
                    <h3 className={'text-gray-500 font-medium mb-0'}>Bank Name</h3>
                    <h3 className={'mb-0'}>{account.bankName}</h3>
                </Card>
            </div>
            <Button type={'primary'}>Initialize Withdrawal</Button>
        </div> : <div>
            Please Add a withdrawal Account First
        </div>}
    </Modal>
}
