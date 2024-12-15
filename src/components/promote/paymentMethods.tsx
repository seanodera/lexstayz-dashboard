'use client'

import {useAppDispatch, useAppSelector} from "@/hooks/hooks";
import {Radio, RadioGroup} from "@headlessui/react";
import {CiCreditCard2} from "react-icons/ci";
import {toMoneyFormat} from "@/lib/utils";
import {AiOutlineMobile} from "react-icons/ai";
import {Select, Typography} from "antd";
import {useEffect, useState} from "react";
import {setPaymentCurrency, setPaymentMethod} from "@/slices/transactionsSlice";
import {BsUiChecksGrid} from "react-icons/bs";
import {WalletOutlined} from "@ant-design/icons";

// Define the types for the user's payment methods
const { Title,Text } = Typography;
export default function PaymentMethods({totalInUsd}:{totalInUsd:number}) {

    const [supportedCurrencies,setSupportedCurrencies] = useState(['GHS', 'KES'])
    const cardCurrencies = ['GHS', 'KES']
    ;
    const {pawapayConfigs,paymentCurrency,paymentRate,currency,paymentMethod,availableBalance} = useAppSelector(state => state.transactions)
    const dispatch = useAppDispatch();

    useEffect(() => {
        let data:string[] = ['GHS', 'KES'];
        pawapayConfigs.forEach((config) => {
            config.correspondents.forEach((value) => {
                if (!data.includes(value.currency)){
                    data.push(value.currency);
                }
            })
        })
        setSupportedCurrencies(data)
    }, [pawapayConfigs]);
    return (
        <div>
            <div className={'flex justify-between'}>
                <Title level={4} className="font-semibold">Payment Methods</Title>
                <Select value={paymentCurrency} onChange={(value) => dispatch(setPaymentCurrency(value))} options={supportedCurrencies.map((currency) => ({value: currency, label: currency}))}/>
            </div>
            {paymentCurrency !== currency && <div>
                <div className={'flex gap-2'}>
                    <h3 className={'text-xl'}>Total Price: </h3>
                    <h2 className={'text-xl font-bold'}>{currency} {toMoneyFormat(totalInUsd)}</h2>
                </div>
                <div
                    className={'text-primary font-medium h4 mb-4 '}> 1 {currency} = {toMoneyFormat(paymentRate)} {paymentCurrency}
                </div>
            </div>
            }
            <div>
                <RadioGroup
                    value={paymentMethod}
                    onChange={(value) => dispatch(setPaymentMethod(value))}
                    className="grid grid-cols-2 gap-4"
                >
                    <Radio disabled={totalInUsd > availableBalance} value={'balance'}>
                        {({checked}) => (
                            <div
                                className={`w-full ${checked ? 'border-primary ' : totalInUsd > availableBalance? 'border-danger':'border-gray-400'} flex gap-2 border-solid py-3 px-2 rounded-xl `}>
                                <div className={'text-3xl'}>
                                    <WalletOutlined/>
                                </div>
                                <div className={'w-full'}>
                                    <div className="font-semibold">
                                        Lexstayz Balance
                                    </div>
                                    <div
                                        className={'font-bold text-lg'}>{currency} {toMoneyFormat(totalInUsd)}</div>
                                    <div>
                                        <h5 className={`font-semibold ${totalInUsd > availableBalance && 'text-danger' }`}>Available Balance: USD ${availableBalance}</h5>
                                    </div>
                                </div>

                            </div>
                        )}
                    </Radio>
                    {cardCurrencies.includes(paymentCurrency) && <Radio value={'card-payment'} className="">
                        {({checked}) => (
                            <div
                                className={`w-full ${checked ? 'border-primary ' : 'border-gray-400'} flex gap-2 border-solid py-3 px-2 rounded-xl `}>
                                <div className={'text-3xl'}>
                                    <CiCreditCard2/>
                                </div>
                                <div className={'w-full'}>
                                    <div className="font-semibold">
                                        Card Payment
                                    </div>
                                    <div
                                        className={'font-bold text-lg'}>{paymentCurrency} {toMoneyFormat(totalInUsd * paymentRate)}</div>

                                </div>

                            </div>
                        )}
                    </Radio>}
                    {supportedCurrencies.includes(paymentCurrency) &&
                        <Radio value={'mobile-money'} className="">
                            {({checked}) => (
                                <div
                                    className={`w-full ${checked ? 'border-primary ' : 'border-gray-400'} flex gap-2 border-solid py-3 px-2 rounded-xl `}>
                                    <div className={'text-3xl'}>
                                        <AiOutlineMobile/>
                                    </div>
                                    <div>
                                        <div className="font-semibold">
                                            Mobile Money
                                        </div>
                                        <div
                                            className={'font-bold text-lg'}>{paymentCurrency} {toMoneyFormat(totalInUsd * paymentRate)}</div>
                                    </div>
                                </div>
                            )}
                        </Radio>}
                </RadioGroup>
            </div>
        </div>
    );
}
