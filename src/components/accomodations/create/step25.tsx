'use client'
import {Card, Form, Input, InputNumber} from "antd";
import {useAppDispatch} from "@/hooks/hooks";
import {useEffect, useState} from "react";
import {setStayPartial} from "@/slices/createStaySlice";


export default function CreateStep25() {
    const dispatch = useAppDispatch()
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
        }))
    }, [bathrooms, bedrooms, beds, dispatch, price]);

    return <Card className={'flex justify-center border-0'}>
        <h2>House Details</h2>
        <Form className={'w-screen text-nowrap md:max-w-sm '} layout={'vertical'}>
            <Form.Item label={'Price'} className={'font-medium'}>
                <InputNumber value={price} onChange={(value) => setPrice(value || 0)} min={0} step={1}/>
            </Form.Item>
            <Form.Item label={'Guests'} className={'font-medium'}>
                <InputNumber value={maxGuests} onChange={(value) => setMaxGuests(value || 0)} min={1} step={1}/>
            </Form.Item>
            <Form.Item label={'Bedroom'} className={'font-medium'} >
                <InputNumber value={bedrooms} onChange={(value) => setBedrooms(value || 0)} min={1}/>
            </Form.Item>
            <Form.Item label={'Beds'} className={'font-medium'} >
                <InputNumber value={beds} onChange={(value) => setBeds(value || 0)} min={1}/>
            </Form.Item>
            <Form.Item label={'Baths'} className={'font-medium'} >
                <InputNumber min={0} value={bathrooms} onChange={(value) => setBathrooms(bathrooms)}/>
            </Form.Item>
        </Form>
    </Card>
}