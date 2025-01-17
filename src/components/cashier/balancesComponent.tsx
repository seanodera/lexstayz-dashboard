'use client'
import {Card} from "antd";
import {useAppSelector} from "@/hooks/hooks";
import {toMoneyFormat} from "@/lib/utils";
import {selectCurrentUser} from "@/slices/authenticationSlice";


export default function BalancesComponent() {
const user = useAppSelector(selectCurrentUser)
    return <Card title={<h3 className={'font-bold mb-0'}>Balances</h3>}>
        <h3 className={'text-gray-500 font-medium mb-0'}>Available Balance</h3>
        <h2 className={'mb-0 text-primary'}>${toMoneyFormat(user.balance?.available || 0)}</h2>
        <h3 className={'text-gray-500 font-medium mt-4 mb-0'}>Pending Balance</h3>
        <h2 className={'mb-0'}>${toMoneyFormat(user.balance?.pending || 0)}</h2>
    </Card>;
}
