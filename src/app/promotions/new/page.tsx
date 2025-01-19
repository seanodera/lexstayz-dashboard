'use client';

import {useState} from "react";
import {Button, Card, DatePicker, Form, Input, Typography, Upload} from "antd";
import {DeleteOutlined, PlusOutlined} from "@ant-design/icons";
import {UploadFile} from "antd/es/upload/interface";
import dayjs from "dayjs";
import {useAppDispatch, useAppSelector} from "@/hooks/hooks";
import {checkAvailabilitySync, createPromotionAsync, resetAvailability} from "@/slices/promotionSlice";
import {differenceInDays} from "date-fns";
import {Stay} from "@/lib/types";
import ListingItem from "@/components/accomodations/ListingItem";
import AddStayModal from "@/components/promote/AddStayModal";
import PaymentMethods from "@/components/promote/paymentMethods";
import {useRouter} from "next/navigation";

const {Title, Text} = Typography;

export default function CreatePromotionPage() {
    const [posterList, setPosterList] = useState<UploadFile[]>([]);
    const [stays, setStays] = useState<Stay[]>([])
    const [stayModal, setStayModal] = useState<boolean>(false);
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const dispatch = useAppDispatch();
    const promoRate = 50
    const router = useRouter();
    const {isAvailable, isAvailableLoading, isAvailableMessage} = useAppSelector(state => state.promotion)
    const handlePosterChange = ({fileList}: { fileList: UploadFile[] }) => {
        setPosterList(fileList);
    };

    const handleFormFinish = (values: any) => {
        console.log("Form Values:", {...values, poster: posterList});
        // Logic to save the promotion goes here
       if (!posterList[0].originFileObj){
            throw new Error('No image selected')
        }
        dispatch(createPromotionAsync({
            promotion: {
                id: "",
                hostId: "",
                poster: "",
                name: values.name,
                startDate: startDate,
                endDate: endDate,
                createdAt: new Date().toISOString(),
                description: values.description,
                stays: stays.map((stay) => stay.id),
                currency: "USD",
                amount: promoRate * (differenceInDays(endDate, startDate) + 1),
                status: "Created"
            },
            poster: posterList[0].originFileObj
        })).then((value) => {
            router.push(value.payload)
        })
    };

    return (
        <div className="px-8 py-4 space-y-6">
            <Title level={2} className="text-center">Create a New Promotion</Title>
            <Form
                layout="vertical"
                onFinish={handleFormFinish}
                className="max-w-screen-md mx-auto space-y-6"
            >
                <Card>
                    <div className={'grid grid-cols-3 gap-4 mb-4'}>
                        <div>
                            <Form.Item
                                label="Cover Image"
                                name="poster"
                                rules={[{required: true, message: "Please upload a poster"}]}
                            >
                                <Upload
                                    listType="picture-card"
                                    fileList={posterList}
                                    onChange={handlePosterChange}
                                    beforeUpload={() => false} // Prevents automatic uploads
                                    className={'aspect-square w-full'}
                                    prefixCls={(posterList.length > 0) ? 'ant-upload ant-upload-select aspect-square w-full rounded-lg ' : undefined}
                                    itemRender={(originNode, file: UploadFile, fileList: object[], actions) => {


                                        const url = (file.originFileObj) ? URL.createObjectURL(file.originFileObj) : ''
                                        return <div className="relative w-full aspect-square rounded-lg group">
                                            <img src={url} alt=""
                                                 className="w-full aspect-square rounded-lg object-cover"/>
                                            <div
                                                className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <Button
                                                    danger
                                                    type="primary"
                                                    shape="round"
                                                    icon={<DeleteOutlined/>}
                                                    onClick={() => actions.remove()}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </div>;
                                    }}

                                >
                                    {posterList.length < 1 && (
                                        <div className={''}>
                                            <PlusOutlined/>
                                            <div style={{marginTop: 8}}>Upload</div>
                                        </div>
                                    )}
                                </Upload>
                            </Form.Item>
                        </div>
                        <div className={'col-span-2'}>
                            <Form.Item
                                label="Promotion Name"
                                name="name"
                                rules={[{required: true, message: "Please enter the promotion name"}]}
                            >
                                <Input placeholder="Enter promotion name"/>
                            </Form.Item>


                            <Form.Item
                                label="Description"
                                name="description"
                                rules={[{required: true, message: "Please enter a description"}]}
                            >
                                <Input.TextArea placeholder="Enter promotion description" rows={4}/>
                            </Form.Item>

                            <div className={'flex gap-2 items-center'}>
                                <Form.Item
                                    label="Promotion Date Range"
                                    name="dateRange"
                                    className={'w-full'}
                                    rules={[{required: true, message: "Please select the date range"}]}
                                >
                                    <DatePicker.RangePicker value={[
                                        dayjs(startDate),
                                        dayjs(endDate),
                                    ]} onChange={(value) => {
                                        console.log(value);
                                        if (value && value[ 0 ] && value[ 1 ]) {
                                            setStartDate(value[ 0 ].toISOString())
                                            setEndDate(value[ 1 ].toISOString())
                                            dispatch(resetAvailability())
                                        }
                                    }} disabledDate={(currentDate) => currentDate && currentDate < dayjs().startOf('day')
                                    } style={{width: "100%"}} format={'DD MMM YYYY'}/>
                                </Form.Item>
                                <Button type={'primary'} loading={isAvailableLoading}
                                        onClick={() => dispatch(checkAvailabilitySync({
                                            startDate: startDate,
                                            endDate: endDate
                                        }))} ghost>Check Availability</Button>
                            </div>

                            <div className={'grid grid-cols-3'}>
                                <div>
                                    <Title level={5}>Current Price</Title>
                                    <Text className={'font-semibold'}>{promoRate} USD / day</Text>
                                </div>
                                <div>
                                    <Title level={5}>Promotion Length</Title>
                                    <Text
                                        className={'font-semibold'}>{differenceInDays(endDate, startDate) + 1} days</Text>
                                </div>
                                <div>
                                    <Title level={5}>Total Cost</Title>
                                    <Text
                                        className={'font-semibold'}>{promoRate * (differenceInDays(endDate, startDate) + 1)} USD</Text>
                                </div>
                            </div>

                        </div>
                    </div>
                </Card>
                <Card>
                    <div className={'flex justify-between items-center'}>
                        <Title level={4}>Relevant Stays</Title>
                        <Button type={'primary'} onClick={() => setStayModal(true)}>Add Stay</Button>
                    </div>
                    <div className={'grid grid-cols-4 gap-4'}>
                        {stays.map((stay, index) => {
                            return <div key={index}>
                                <ListingItem stay={stay}/>
                                <Button onClick={() => {
                                    setStays(stays.filter((value) => value.id !== stay.id));
                                }} danger type={'primary'} icon={<DeleteOutlined/>}>Remove</Button>
                            </div>
                        })}
                    </div>
                </Card>

                <Card className={'my-3'}>
                    <PaymentMethods totalInUsd={(promoRate * (differenceInDays(endDate, startDate) + 1)) || 0}/>
                </Card>
                <div className={'mt-3'} style={{textAlign: "right"}}>
                    <Button disabled={!isAvailable} size={'large'} type="primary" htmlType="submit"
                            style={{marginLeft: 8}}>
                        Proceed
                    </Button>
                </div>
            </Form>
            <AddStayModal show={stayModal} setShow={setStayModal} stays={stays} setStays={setStays}/>
        </div>
    );
}
