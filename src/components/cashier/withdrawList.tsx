'use client'
import {Card, Table} from "antd";
import {useAppSelector} from "@/hooks/hooks";
import {selectWithdrawals} from "@/slices/bookingSlice";
import {getTag} from "@/components/common";
import {toMoneyFormat} from "@/lib/utils";
import dayjs from "dayjs";


const {Column} = Table;
export default function WithdrawList() {
    const withdrawals = useAppSelector(selectWithdrawals);
    return <Card className={'rounded-xl'} title={<h3 className={'font-bold mb-0'}>Withdrawals</h3>}>
        <Table dataSource={withdrawals}>
            <Column title={'TransactionId'} dataIndex={'id'}/>
            <Column title={'Date'} dataIndex={'timeStamp'}
                    render={(value) => `${dayjs(value, 'HH:mm')}`}/>
            <Column title={'Method'} dataIndex={'method'}/>
            <Column title={'Account'} dataIndex={'account'}/>
            <Column title={'Amount'} dataIndex={'amount'} render={(value) => toMoneyFormat(value, {})}/>
            <Column title={'Status'} dataIndex={'status'} render={(value) => getTag(value)}/>
        </Table>
    </Card>
}