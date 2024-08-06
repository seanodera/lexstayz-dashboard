'use client'
import {Button, Form, Input, Modal, Select} from "antd";
import {useState} from "react";
import {useAppDispatch} from "@/hooks/hooks";
import {setStayPartial} from "@/slices/createStaySlice";
import {useRouter} from "next/navigation";


export default function CreateDialog({isModalOpen, setIsModalOpen}: { isModalOpen: boolean, setIsModalOpen?: any }) {
    const [name, setName] = useState("");
    const [type, setType] = useState("Hotel");
    const dispatch = useAppDispatch()
    const router = useRouter()

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        dispatch(setStayPartial({
            name: name,
            type: type,
        }))
        router.push('/accommodations/create')
        setIsModalOpen(false);

    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return <Modal title={'New Accommodation'} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}
                  footer={<div/>}>
        <Form layout={'vertical'} >
            <Form.Item label={'Accommodation Name'} className={'font-medium'} vertical>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={'Accommodation Name'}/></Form.Item>
            <Form.Item label={'Type'} vertical>
                <Select defaultValue={'Hotel'} value={type} onChange={(value) => setType(value)} options={[{value: 'Hotel', label: 'Hotel'}, {
                                                           value: 'Home',
                                                           label: 'Home',
                                                       }]}/> </Form.Item>

            <Form.Item><Button onClick={() => handleOk()} type={'primary'} size={'large'}>Create</Button></Form.Item>
        </Form>


    </Modal>
}