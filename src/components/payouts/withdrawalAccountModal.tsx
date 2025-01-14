'use client'
import { useEffect, useState } from 'react';
import { Modal, Input, Select, Form, Button } from 'antd';
import { addWithdrawalAccount, getPaystackBanks, IPaystackBank } from "@/slices/transactionsSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { selectCurrentUser } from "@/slices/authenticationSlice";

export default function WithdrawalBankModal({ show, setShow }: {show: boolean,setShow: (show: boolean) => void}) {
    // Redefine to reflect TypeScript types if needed
    const [subBanks, setSubBanks] = useState<IPaystackBank[]>([]);
    const [currency, setCurrency] = useState('GHS');
    const dispatch = useAppDispatch();
    const { isLoading, banks } = useAppSelector(state => state.transactions);
    const user = useAppSelector(selectCurrentUser);

    useEffect(() => {
        console.log(banks)
        setSubBanks(banks.filter(bank => {
            return bank.currency === currency;
        }));
    }, [banks, currency]);

    useEffect(() => {
        dispatch(getPaystackBanks(currency));
    }, [currency, dispatch]);

    const handleFinish = (values: any) => {
        const selectedBank = banks.find(bank => bank.code === values.bank_code);
        console.log('selectedBank', selectedBank, user);
        if (!user) return;
        const accountPayload = {
            accountNumber: values.account_number,
            bankCode: values.bank_code,
            bankName: selectedBank ? selectedBank.name : values.bank_code,
            currency: values.currency,
            name: values.account_name,
            type: currency === 'GHS' && selectedBank ? selectedBank.type : 'MSISDN',
        };
        dispatch(addWithdrawalAccount(accountPayload)).then((value) => {
            console.log(value)
        });
    };

    return (
        <Modal
            open={show}
            onCancel={() => setShow(false)}
            title={<h3 className='text-lg font-semibold'>Bank Account Information</h3>}
            footer={null}
            confirmLoading={isLoading}
        >
            <Form
                layout="vertical"
                onFinish={handleFinish}
                initialValues={{
                    account_number: '',
                    bank_code: '',
                    currency,
                    account_name: '',
                }}
            >
                <Form.Item
                    label="Account Name"
                    name="account_name"
                    rules={[{ required: true, message: 'Please enter your account name' }]}
                >
                    <Input placeholder="Enter your account name" />
                </Form.Item>

                <Form.Item
                    label="Account Number"
                    name="account_number"
                    rules={[{ required: true, message: 'Please enter your account number' }]}
                >
                    <Input placeholder="Enter your account number" />
                </Form.Item>

                <Form.Item
                    label="Bank"
                    name="bank_code"
                    rules={[{ required: true, message: 'Please choose your bank' }]}
                >
                    <Select
                        placeholder="Select your bank"
                        options={subBanks.map(value => ({
                            key: value.id,
                            value: value.code,
                            label: value.name,
                        }))}
                    />
                </Form.Item>
                <Form.Item
                    label="Currency"
                    name="currency"

                    rules={[{required: true, message: 'Please select your currency'}]}
                >
                    <Select


                        onChange={(value: string) => {
                            setCurrency(value);
                        }}
                        options={[
                            {label: 'GHS', value: 'GHS'},
                            {label: 'KES', value: 'KES'},
                            // Add more currencies as needed
                        ]}
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Save
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
}
