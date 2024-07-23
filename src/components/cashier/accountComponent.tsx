'use client'
import {Card} from "antd";
import {useAppSelector} from "@/hooks/hooks";
import {selectWithdrawAccount} from "@/slices/bookingSlice";


export default function AccountComponent(){
    const account = useAppSelector(selectWithdrawAccount)
    return <Card title={<h3 className={'font-bold mb-0'}>Withdrawal Account</h3>} className={'rounded-xl'}>
        <h3 className={'text-gray-500 font-medium mb-0'}>Method</h3>
        <h3 className={'mb-0'}>{account.method}</h3>
        <h3 className={'text-gray-500 font-medium mb-0'}>Account Email</h3>
        <h3 className={'mb-0'}>{account.account}</h3>
    </Card>
}