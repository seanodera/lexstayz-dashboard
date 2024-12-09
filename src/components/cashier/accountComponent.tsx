'use client'
import {Button, Card} from "antd";
import {useAppSelector} from "@/hooks/hooks";
import {useState} from "react";
import WithdrawalBankModal from "@/components/payouts/withdrawalAccountModal";



export default function AccountComponent(){
    const [show, setShow] = useState<boolean>(false)
    const accounts = useAppSelector(state => state.transactions.withdrawalAccounts)
    const account = (accounts.length >= 1) && accounts[0] ;

    return <div>
        { account?
            <Card title={<h3 className={'font-bold mb-0'}>Withdrawal Account</h3>} className={'rounded-xl'}>
                <h3 className={'text-gray-500 font-medium mb-0'}>Account Name</h3>
                <h3 className={'mb-0'}>{account.name}</h3>
                <h3 className={'text-gray-500 font-medium mb-0'}>Account Number</h3>
                <h3 className={'mb-0'}>{account.accountNumber}</h3>

            </Card> :  <Card extra={<Button type={'primary'} onClick={() => setShow(true)}>Add Account</Button> }>
                Enter Account details
            </Card>
        }
        <WithdrawalBankModal show={show} setShow={setShow}/>
    </div>

}
