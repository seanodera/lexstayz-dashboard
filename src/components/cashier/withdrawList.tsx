'use client'
import {Button, Table} from "antd";
import {useAppSelector} from "@/hooks/hooks";
import {toMoneyFormat} from "@/lib/utils";
import dayjs from "dayjs";
import {selectWithdrawList} from "@/slices/transactionsSlice";


const {Column} = Table;
export default function WithdrawList() {
    const withdrawals = useAppSelector(selectWithdrawList);
    return (<Table dataSource={withdrawals} title={() => <div className={'flex justify-between'}><h2
        className={'font-bold mb-0'}>Withdrawals</h2> <Button type={'primary'}>Initialize Withdrawal</Button></div>}>
        <Column title={'TransactionId'} dataIndex={'id'}/>
        <Column title={'Date'} dataIndex={'date'}
                render={(value) => `${dayjs(value, 'HH:mm')}`}/>
        {/*<Column title={'Method'} dataIndex={'method'}/>*/}
        {/*<Column title={'Account'} dataIndex={'account'}/>*/}
        <Column title={'Amount'} dataIndex={'amount'} render={(value) => toMoneyFormat(value)}/>
        {/*<Column title={'Status'} dataIndex={'status'} render={(value) => getTag(value)}/>*/}
    </Table>)}