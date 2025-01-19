'use client';

import { Button, Table, Tag } from "antd";
import { useAppSelector } from "@/hooks/hooks";
import { toMoneyFormat } from "@/lib/utils";
import dayjs from "dayjs";
import { selectWithdrawList } from "@/slices/transactionsSlice";
import { useState } from "react";
import InitPayoutModal from "@/components/cashier/initPayoutModal";
import {IPayout, IWithdrawalAccount} from "@/lib/types";
import { getTag } from "../common";
import {formatDate} from "date-fns";

const { Column } = Table;

export default function WithdrawList() {
    const withdrawals = useAppSelector(selectWithdrawList);
    const [showPayoutModal, setShowPayoutModal] = useState(false);



    return (
        <div>
            <Table
                dataSource={withdrawals}
                rowKey="id"
                title={() => (
                    <div className="flex justify-between">
                        <h2 className="font-bold mb-0">Withdrawals</h2>
                        <Button type="primary" onClick={() => setShowPayoutModal(true)}>
                            Initialize Withdrawal
                        </Button>
                    </div>
                )}
            >
                <Column title="Transaction ID" dataIndex="id" />
                <Column
                    title="Date"
                    dataIndex="createdAt"
                    render={(value) => dayjs(value).format("YYYY-MM-DD HH:mm")}
                />
                <Column title={'Account Number'} dataIndex={['account', 'accountNumber']} render={(value) => value.slice(-4).padStart(4, "*")}/>
                <Column title={'Bank'} dataIndex={['account','bankName']}/>

                <Column
                    title="Amount"
                    dataIndex="amount"
                    render={(value) => toMoneyFormat(value)}
                />
                <Column
                    title="Status" dataIndex={'status'}
                    render={(value) => getTag(value)}
                />
                <Column title={'Created At'} dataIndex={'createdAt'} render={(value) => formatDate(value, 'YYYY MMM DD hh:mm')}/>
            </Table>
            <InitPayoutModal show={showPayoutModal} setShow={setShowPayoutModal} />
        </div>
    );
}
