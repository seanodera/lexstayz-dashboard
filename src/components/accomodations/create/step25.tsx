'use client'
import {Card, Form, Input, InputNumber} from "antd";
import {useAppDispatch, useAppSelector} from "@/hooks/hooks";
import {useEffect, useState} from "react";
import {selectPartialStay, setStayPartial} from "@/slices/createStaySlice";


export default function CreateStep25() {
    const dispatch = useAppDispatch()
    const stay = useAppSelector(selectPartialStay);
    const [bedrooms, setBedrooms] = useState(0)
    const [bathrooms, setBathrooms] = useState(0)
    const [beds, setBeds] = useState(0)
    const [price, setPrice] = useState(0)
    const [maxGuests, setMaxGuests] = useState(1)
    useEffect(() => {
        dispatch(setStayPartial({
            bedrooms: bedrooms,
            bathrooms: bathrooms,
            beds: beds,
            price: price,
            maxGuests: maxGuests,
        }))
    }, [bathrooms, bedrooms, beds, dispatch, price]);

    return <Card className={'flex justify-center border-0'}>
        <h2>House Details</h2>
        <Form className={'w-screen text-nowrap md:max-w-sm grid grid-cols-2'} layout={'vertical'}>
            <Form.Item label={'Price'} className={'font-medium'}>
                <InputNumber prefix={stay.currency} value={stay.price} onChange={(value) => setPrice(value || 0)} min={0} step={1}/>
            </Form.Item>
            <Form.Item label={'Guests'} className={'font-medium'}>
                <InputNumber value={stay.maxGuests} onChange={(value) => setMaxGuests(value || 0)} min={1} step={1}/>
            </Form.Item>
            <Form.Item label={'Bedroom'} className={'font-medium'} >
                <InputNumber value={stay.bedrooms} onChange={(value) => setBedrooms(value || 0)} min={1}/>
            </Form.Item>
            <Form.Item label={'Beds'} className={'font-medium'} >
                <InputNumber value={stay.beds} onChange={(value) => setBeds(value || 0)} min={1}/>
            </Form.Item>
            <Form.Item label={'Baths'} className={'font-medium'} >
                <InputNumber min={0} value={stay.bathrooms} onChange={(value) => setBathrooms(value)}/>
            </Form.Item>
        </Form>
    </Card>
}