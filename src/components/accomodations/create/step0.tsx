'use client'
import {Card, Form, Input, Select} from "antd";
import React, {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "@/hooks/hooks";
import {useRouter} from "next/navigation";

import {selectPartialStay, setStayPartial} from "@/slices/createStaySlice";


export default function CreateStep0() {
    const [name, setName] = useState("");
    const [type, setType] = useState("Hotel");
    const [description, setDescription] = useState('');
    const [homeType, setHomeType] = useState("House");
    const stay = useAppSelector(selectPartialStay)
    const dispatch = useAppDispatch()
    const router = useRouter()

    // useEffect(() => {
    //     dispatch(setStayPartial({
    //         name: name,
    //         type: type,
    //         description: description,
    //         homeType: homeType,
    //     }))
    // }, [name, type, description, homeType]);

    return <Card className={'flex justify-center w-full border-0'}>
        <Form className={'w-screen text-nowrap md:max-w-sm'} layout={'vertical'}>
            <Form.Item label={'Accommodation Name'} className={'font-medium'}>
                <Input value={stay.name} onChange={(e) => dispatch(setStayPartial({name: e.target.value}))}
                       placeholder={'Accommodation Name'}/></Form.Item>
            <Form.Item label={'Type'} className={'font-medium'}>
                <Select defaultValue={'Hotel'} value={stay.type} onChange={(value) => dispatch(setStayPartial({type: value}))}
                        options={[{value: 'Hotel', label: 'Hotel'}, {
                            value: 'Home',
                            label: 'Home',
                        }]}/> </Form.Item>
            {stay.type === "Home" && (<Form.Item label={'Home Type'} className={'font-medium'}>
                <Select defaultValue={'Hotel'} value={stay.homeType} onChange={(value) => dispatch(setStayPartial({homeType: value}))} options={[
                    {
                        value: 'House',
                        label: 'House',
                    },
                    {
                        value: 'Apartment',
                        label: 'Apartment',
                    },
                    {
                        value: 'Guest House',
                        label: 'Guest House'
                    },
                    {
                        value: 'Other',
                        label: 'Other',
                    }
                ]}/>
            </Form.Item>)}
            <Form.Item label={'Description'} className={'font-medium'}>
                <Input.TextArea rows={4} placeholder={'Enter accommodation Description'}
                                onChange={(e) => dispatch(setStayPartial({description: e.target.value}))} value={stay.description}/>
            </Form.Item>
        </Form>
    </Card>
}