'use client'
import React, {useEffect, useState} from "react";
import {
    Button,
    Card,
    Checkbox,
    Col,
    Empty,
    Form,
    Image,
    Input,
    InputNumber,
    Modal,
    Row,
    Select,
    Upload
} from "antd";
import {IoBedOutline} from "react-icons/io5";
import {LuBedSingle} from "react-icons/lu";
import {DeleteOutlined, UploadOutlined} from "@ant-design/icons";
import {RcFile, UploadChangeParam} from "antd/es/upload";
import {UploadFile} from "antd/lib";
import {bedTypes, hotelFacilities} from "@/data/hotelsDataLocal";
import {useAppDispatch, useAppSelector} from "@/hooks/hooks";

import {
    addRoomAsync,
    selectCurrentStay,

    updateRoomAsync
} from "@/slices/staySlice";
import {useRouter} from "next/navigation";

const {TextArea} = Input;

export default function RoomEditComponent({room, stayId}: { room?: any, stayId: string }) {
    const dispatch = useAppDispatch();
    const currentStay = useAppSelector(selectCurrentStay);

    const [name, setName] = useState('');
    const [poster, setPoster] = useState<any>(undefined);
    const [images, setImages] = useState<Array<any>>([]);
    const [maxGuests, setMaxGuests] = useState<number | null>(2);
    const [beds, setBeds] = useState<Array<any>>([]);
    const [description, setDescription] = useState('');
    const [amenities, setAmenities] = useState<Array<string>>([]);
    const [price, setPrice] = useState<number | null>(0);
    const [available, setAvailable] = useState<number | null>(10);
    const router = useRouter();

    useEffect(() => {
        if (room) {
            setName(room.name);
            setPoster(room.poster);
            setDescription(room.description);
            setImages(room.images);
            setMaxGuests(room.maxGuests);
            setBeds(room.beds);
            setAmenities(room.amenities);
            setPrice(room.price);
            setAvailable(room.available);
        }
    }, [room]);

    const handleChange = (info: UploadChangeParam<UploadFile<any>>) => {
        setPoster(URL.createObjectURL(info.file.originFileObj as File));
    };

    const handleChangeDetails = (file: RcFile) => {
        setImages(images.concat(URL.createObjectURL(file)));
    };

    const handleSubmit = async () => {
        const roomData = {
            name,
            maxGuests,
            beds,
            description,
            amenities,
            price,
            available
        };
        console.log(stayId, 'Room Edit')
        if (room){


            await dispatch(updateRoomAsync({room: roomData, previousRoom: room, stayId,roomId: room.id, poster, images})).then((value:any) => {
                console.log(value)
                router.push(`/accommodations/${stayId}/${room.id}`);
            })

        } else {
            try {
                console.log('here')

                console.log(roomData);

                // Add new room
                console.log(stayId);

                await dispatch(addRoomAsync({room: roomData, stayId, poster, images})).then((value) => {

                    router.push(`/accommodations/${stayId}`)
                });


                //dispatch(fetchStaysAsync());
                console.log(stayId)

            } catch (error) {
                console.log(error);
            }
        }
    };

    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <Card className={'rounded-2xl'}>
            <div className={'flex justify-between items-center my-2'}>
                <Form.Item layout={'vertical'} label={<h3 className={'font-bold mb-0'}>Room Name</h3>}
                           className={'font-bold h3 text-xl'}>
                    <Input value={name} onChange={(value) => setName(value.target.value)} placeholder={'Name'}/>
                </Form.Item>
                <Button type={"primary"} size={'large'} onClick={handleSubmit}>Confirm</Button>
            </div>
            <Row gutter={[16, 16]}>
                <Col span={5}>
                    <div className={'flex justify-between items-center mb-1'}>
                        <h3 className={'font-bold mb-0'}>Main Image</h3>
                        <Upload className={'mt-4'} multiple={false} onChange={handleChange} maxCount={1}
                                showUploadList={false}>
                            <Button icon={<UploadOutlined/>}>
                                Select Poster
                            </Button>
                        </Upload>
                    </div>
                    {(poster === '') ?
                        <div
                            className={'flex items-center justify-center border border-dashed border-primary rounded-xl w-full aspect-video object-cover'}>
                        </div> :
                        <Image src={poster} alt={'Main Image'}
                               className={'rounded-xl mb-4 aspect-video object-cover'}/>}
                </Col>
                <Col span={19}>
                    <div className={'flex justify-between items-center mb-1'}><h3 className={'font-bold'}>Detailed Room
                        Images</h3>
                        <Upload disabled={images.length >= 4} multiple={false} className={'mt-4'} beforeUpload={(file) => handleChangeDetails(file)}
                                showUploadList={false}>
                            <Button icon={<UploadOutlined/>}>
                                Add Image
                            </Button>
                        </Upload>
                    </div>
                    <div className={'grid grid-cols-4 gap-4'}>
                        {images?.slice(0, 4).map((image: string, index: number) => <div key={index}><Image
                            className={'rounded-xl aspect-video object-cover'}
                            src={image}
                            alt={'Other Images ' + index}/>
                            <Button className={'mt-1 mx-auto'} type={'default'} danger={true} icon={<DeleteOutlined/>}
                                    onClick={() => setImages(images.toSpliced(index, 1))}>Remove</Button>
                        </div>)}
                        {images.length < 4 ? <div
                            className={'flex items-center justify-center border border-dashed border-primary rounded-xl w-full aspect-video object-cover'}>
                        </div> : ''}
                    </div>
                </Col>
            </Row>
            <div className={'grid grid-cols-3 gap-8 my-4'}>
                <div>
                    <h3 className={'font-bold mb-0'}>Description</h3>
                    <TextArea rows={4} placeholder={'Enter room Description'}
                              onChange={(e) => setDescription(e.target.value)} value={description}/>
                </div>
                <div>
                    <h3 className={'font-bold'}>Details</h3>
                    <Form className={'w-full'} layout={'vertical'} labelAlign={'left'}
                          rootClassName={'font-semibold text-lg w-full'}>
                        <Form.Item label={'Nightly Rate'}>
                            <InputNumber prefix={currentStay.currency? currentStay.currency : 'USD'} min={0} value={price}
                                         onChange={(value: number | null) => setPrice(value)}/>
                        </Form.Item>
                        <Form.Item label={'Maximum Guests'}>
                            <InputNumber min={0} value={maxGuests}
                                         onChange={(value: number | null) => setMaxGuests(value)}/>
                        </Form.Item>
                        <Form.Item label={'Available rooms'}>
                            <InputNumber min={0} value={available}
                                         onChange={(value: number | null) => setAvailable(value)}/>
                        </Form.Item>
                    </Form>
                </div>
                <div>
                    <div className={'flex justify-between items-center'}><h3 className={'font-bold mb-0'}>Beds</h3>
                        <Button type={'primary'} onClick={() => setIsModalOpen(true)}>Add Bed Configuration</Button>
                    </div>
                    {beds.length > 0 ? <div className={'flex items-center gap-2 mb-4 mt-3'}>
                        {
                            beds.map((bed: any, index: number) => <div key={index}
                                                                       className={'p-3 hover:p-5 text-center border-solid border border-gray-500 shadow-md rounded text-nowrap group'}>
                                <span
                                    className={'hidden group-hover:block mx-auto aspect-square h-full text-2xl text-danger'}
                                    onClick={() => setBeds(beds.toSpliced(index, 1))}><DeleteOutlined/></span>
                                <span
                                    className={'mx-auto block group-hover:hidden'}>{(bed.type.toLowerCase() === 'king' || bed.type.toLowerCase() === 'double') ?
                                    <IoBedOutline size={28}/> : <LuBedSingle size={28}/>}</span>
                                <span
                                    className={'group-hover:hidden'}>{bed.number} {bed.type} {bed.number === 1 ? 'Bed' : 'Beds'}</span>
                            </div>)
                        }
                    </div> : <Empty className={'mt-4'}/>}
                    <BedDialog isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} beds={beds} setBeds={setBeds}/>
                </div>
            </div>
            <div>
                <h3 className={'font-bold'}>Amenities</h3>
                <div className={'grid grid-rows-7 grid-cols-2 gap-2'}>
                    {hotelFacilities[ 0 ][ 'Guest Room Amenities' ]?.map((value, index) => <Checkbox key={index}
                                                                                                     checked={amenities.includes(value)}
                                                                                                     onChange={(e) => {
                                                                                                         if (e.target.checked) {
                                                                                                             if (!amenities.includes(value)) {
                                                                                                                 setAmenities(amenities.concat([value]));
                                                                                                             }
                                                                                                         } else {
                                                                                                             setAmenities(amenities.filter((item) => item !== value));
                                                                                                         }
                                                                                                     }}>{value}</Checkbox>)}
                </div>
            </div>
        </Card>
    );
}

const BedDialog = ({
                       isModalOpen,
                       setIsModalOpen,
                       beds,
                       setBeds
                   }: {
    isModalOpen: boolean,
    setIsModalOpen: any,
    beds: Array<any>,
    setBeds: any
}) => {
    const [form] = Form.useForm();
    const handleAddBed = (values: any) => {
        setBeds(beds.concat(values));
        form.resetFields();
        setIsModalOpen(false);
    };

    return (
        <Modal title="Add Bed" open={isModalOpen} onOk={form.submit} onCancel={() => setIsModalOpen(false)}>
            <Form form={form} onFinish={handleAddBed}>
                <Form.Item name="type" label="Bed Type" rules={[{required: true}]}>
                    <Select>
                        {bedTypes.map((type: string) => (
                            <Select.Option key={type} value={type}>
                                {type}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item name="number" label="Number of Beds" rules={[{required: true}]}>
                    <InputNumber min={1}/>
                </Form.Item>
            </Form>
        </Modal>
    );
};
