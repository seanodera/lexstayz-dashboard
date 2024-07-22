import {Button, Form, Input, Modal, Select} from "antd";
import Link from "next/link";
import {PlusCircleOutlined} from "@ant-design/icons";


export default function CreateDialog({isModalOpen, setIsModalOpen}: { isModalOpen: boolean, setIsModalOpen?: any }) {


    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return <Modal title={'New Accommodation'} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}
                  footer={<div/>}>
        <Form layout={'vertical'}>
            <Form.Item label={'Accommodation Name'} className={'font-medium'} vertical><Input placeholder={'Accommodation Name'}/></Form.Item>
            <Form.Item label={'Type'} vertical><Select defaultValue={'Hotel'}
                                                       options={[{value: 'Hotel', label: 'Hotel'}, {
                                                           value: 'Home',
                                                           label: 'Home',
                                                       }]}/> </Form.Item>

            <Form.Item><Link href={'/accommodations/create'}><Button type={'primary'} size={'large'}
                                                                     >Create
            </Button></Link></Form.Item>
        </Form>


    </Modal>
}