'use client'
import {Button, Card, Form, InputNumber} from "antd";
import {useState} from "react";
import {useAppSelector} from "@/hooks/hooks";
import {selectBalance} from "@/slices/bookingSlice";


export default function WithdrawComponent() {
    const [amount, setAmount] = useState<number | null>(200);
    const balances = useAppSelector(selectBalance)
    return <Card title={<h3 className={'font-bold mb-0'}>Withdraw</h3>} className={'rounded-xl'}>
        <Form layout={'vertical'} className={'font-bold'}>
            <Form.Item label={<h3 className={'font-bold mb-0'}>Amount</h3> }>
                <InputNumber className={'w-full'} value={amount} min={200} max={balances.available} prefix={'$'}  onChange={(value) => setAmount(value)} />
            </Form.Item>
            <Button type="primary">Withdraw</Button>
        </Form>
    </Card>
}