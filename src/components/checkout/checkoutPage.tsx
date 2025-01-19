'use client'
import {useParams, useSearchParams} from "next/navigation";
import {Button, message, Result} from "antd";
import {useEffect, useState} from "react";
import {doc, updateDoc} from "@firebase/firestore";
import {firestore} from "@/lib/firebase";
import {deleteDoc} from "firebase/firestore";
import {verifyPayment} from "@/data/payment";
import LoadingScreen from "@/components/LoadingScreen";




export default function CheckOutPage() {
    const {reference} = useParams();
    const params = useSearchParams()
    const method = params.get('method')
    const depositId = params.get('depositId')
    const [messageApi, contextHolder] = message.useMessage();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('')
    const [hasRun, setHasRun] = useState(false)

    async function runBooking() {
        console.log(reference,method)
        if (reference) {
            const response = await verifyPayment(depositId ? depositId : reference.toString(),method? method.toString() : 'unsigned');
            if (response.status === 'success') {

                await updateDoc(doc(firestore, 'adverts', reference.toString()), {
                    isConfirmed: true,
                    paymentData: response,
                }).then((value) => {
                    messageApi.info('promotion successfully created')
                    setIsLoading(false)
                });
            } else {
                await deleteDoc(doc(firestore, 'adverts', reference.toString()))
                messageApi.error('An error occurred with your payment')
                setErrorMessage('An error occurred with your payment')
                setError(true)
            }

        }

    }


    useEffect(() => {
        runBooking()
    }, []);


    return <div className={'h-screen w-full flex flex-col justify-center bg-gray-100'}>
        {contextHolder}
        {isLoading ? <LoadingScreen/> : <Result

            title={`Booking Request ${error ? 'Failed' : 'Sent'}`}
            status={error ? 'error' : 'success'}
            subTitle={error ? errorMessage : <div>
                <div className={'text-gray-400'}>Your payment has been received successfully.
                </div>
            </div>}
            extra={<Button href={'/promotions'} type={'primary'} ghost>View Promos</Button>}/>}
    </div>
}
