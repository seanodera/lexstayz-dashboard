'use client'
import {Card, Form, InputNumber} from "antd";
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
     const [weeklyPrice, setWeeklyPrice] = useState()
     const [monthlyPrice, setMonthlyPrice] = useState()
     const [yearlyPrice, setYearlyPrice] = useState()


    const [maxGuests, setMaxGuests] = useState(1)
    useEffect(() => {
        dispatch(setStayPartial({
            bedrooms: bedrooms,
            bathrooms: bathrooms,
            beds: beds,
            maxGuests: maxGuests,
        }))
    }, [bathrooms, bedrooms, beds, dispatch, maxGuests]);

    useEffect(() => {
       let update: {
           base: number;
           weekly?: number;
           yearly?: number;
           monthly?: number;
       } = {
           base: price,
       }
       if (weeklyPrice){
           update.weekly = weeklyPrice
       }
       if (monthlyPrice){
           update.monthly = monthlyPrice
       }
       if (yearlyPrice){
           update.yearly = yearlyPrice
       }
       dispatch(setStayPartial({
           price: price,
           pricing: {
               ...stay.pricing,
               ...update,
           },
       }))
    },[dispatch, monthlyPrice, price, stay.pricing, weeklyPrice, yearlyPrice])

    return <Card className={'flex justify-center border-0'}>
        <h2>House Details</h2>
        <Form className={'w-screen text-nowrap md:max-w-sm grid grid-cols-2'} layout={'vertical'}>
            <Form.Item label={'Price'} className={'font-medium'}>
                <InputNumber prefix={stay.currency} value={stay.price} onChange={(value) => setPrice(value || 0)} min={0} step={1}/>
            </Form.Item>
            <Form.Item label={'Weekly Price'} className={'font-medium'}>
                <InputNumber prefix={stay.currency} value={stay.pricing.weekly} onChange={(value) => setWeeklyPrice(value || 0)} min={0} step={1}/>
            </Form.Item>
            <Form.Item label={'Monthly Price'} className={'font-medium'}>
                <InputNumber prefix={stay.currency} value={stay.pricing.monthly} onChange={(value) => setMonthlyPrice(value || 0)} min={0} step={1}/>
            </Form.Item>
            <Form.Item label={'Yearly Price'} className={'font-medium'}>
                <InputNumber prefix={stay.currency} value={stay.pricing.yearly} onChange={(value) => setYearlyPrice(value || 0)} min={0} step={1}/>
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
