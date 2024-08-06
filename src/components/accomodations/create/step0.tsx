'use client'
import {Card, Form, Input, Select} from "antd";
import React, {useEffect, useState} from "react";
import {useAppDispatch} from "@/hooks/hooks";
import {useRouter} from "next/navigation";

import {setStayPartial} from "@/slices/createStaySlice";


export default function CreateStep0() {
    const [name, setName] = useState("");
    const [type, setType] = useState("Hotel");
    const [description, setDescription] = useState('');
    const dispatch = useAppDispatch()
    const router = useRouter()

    useEffect(() => {
        dispatch(setStayPartial({
            name: name,
            type: type,
            description: description,
        }))
    }, [name, type,description]);

    return <Card className={'flex justify-center w-full'}>
        <Form className={'w-screen text-nowrap md:max-w-sm'} layout={'vertical'}>
            <Form.Item label={'Accommodation Name'} className={'font-medium'} >
                <Input value={name} onChange={(e) => setName(e.target.value)}
                       placeholder={'Accommodation Name'}/></Form.Item>
            <Form.Item label={'Type'} >
                <Select defaultValue={'Hotel'} value={type} onChange={(value) => setType(value)}
                        options={[{value: 'Hotel', label: 'Hotel'}, {
                            value: 'Home',
                            label: 'Home',
                        }]}/> </Form.Item>
            <Form.Item label={'Description'} className={'font-medium'}>
                <Input.TextArea rows={4} placeholder={'Enter accommodation Description'}
                                onChange={(e) => setDescription(e.target.value)} value={description}/>
            </Form.Item>
        </Form>
    </Card>
}