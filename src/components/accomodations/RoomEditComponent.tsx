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
import {UploadChangeParam} from "antd/es/upload";
import {UploadFile} from "antd/lib";
import {bedTypes, hotelFacilities} from "@/data/hotelsDataLocal";

const {TextArea} = Input;

export default function RoomEditComponent({room}: {room?: any}) {
    const [name, setName] = useState('');
    const [poster, setPoster] = useState<any>('');
    const [images, setImages] = useState<Array<any>>([]);
    const [maxGuests, setMaxGuests] = useState<number | null>(2);
    const [beds, setBeds] = useState<Array<any>>([]);
    const [description, setDescription] = useState('');
    const [amenities, setAmenities] = useState<Array<string>>([]);
    const [price, setPrice] = useState<number | null>(0);
    const [discounted, setDiscounted] = useState(false);
    const [discount, setDiscount] = useState({});
    const [available, setAvailable] = useState<number | null>(10);

    useEffect(() => {
        if (room){
            setName(room.name);
            setPoster(room.poster);
            setDescription(room.description);
            setImages(room.images);
            setMaxGuests(room.maxGuests);
            setBeds(room.beds);
            setAmenities(room.amenities);
            setPrice(room.price);
            setDiscount(room.discounted);
            setAvailable(room.available);
        }
    }, [room]);

    const handleChange = (info: UploadChangeParam<UploadFile<any>>) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            setPoster(e.target?.result);
            //setFile(info.file.originFileObj);
        };
        reader.readAsDataURL(info.file.originFileObj as File);
    };

    const handleChangeDetails = (info: UploadChangeParam<UploadFile<any>>) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            if (!images.includes(e.target?.result)) {
                setImages(images.concat(e.target?.result));
            }
            //setFile(info.file.originFileObj);
        };
        reader.readAsDataURL(info.file.originFileObj as File);
    };
    const [isModalOpen, setIsModalOpen] = useState(false)
    return <Card className={'rounded-2xl'}>
        <div className={'flex justify-between items-center my-2'}>
            <Form.Item layout={'vertical'} label={<h3 className={'font-bold mb-0'}>Room Name</h3>} className={'font-bold h3 text-xl'}>
                <Input value={name} onChange={(value) => setName(value.target.value)} placeholder={'Name'} />
            </Form.Item>
            {room? false : <Button type={"primary"} size={'large'}>Confirm</Button>}
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
                    <Image src={poster} alt={'Main Image'} className={'rounded-xl mb-4 aspect-video object-cover'}/>}
            </Col>
            <Col span={19}>
                <div className={'flex justify-between items-center mb-1'}><h3 className={'font-bold'}>Detailed Room
                    Images</h3>
                    <Upload disabled={images.length >= 4} className={'mt-4'} onChange={handleChangeDetails}
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
                        <InputNumber prefix={'$'} min={0} value={price}
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
                            <span className={'hidden group-hover:block mx-auto aspect-square h-full text-2xl text-danger'} onClick={() => setBeds(beds.toSpliced(index,1))}><DeleteOutlined/></span>
                    <span
                        className={'mx-auto block group-hover:hidden'}>{(bed.type.toLowerCase() === 'king' || bed.type.toLowerCase() === 'double') ?
                        <IoBedOutline size={28}/> : <LuBedSingle size={28}/>}</span>
                            <span className={'group-hover:hidden'}>{bed.number} {bed.type} {bed.number === 1 ? 'Bed' : 'Beds'}</span>
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
                                                                                                         if (amenities.includes(value)) {
                                                                                                             setAmenities(amenities.toSpliced(amenities.indexOf(value), 1));
                                                                                                         }
                                                                                                     }
                                                                                                     console.log(amenities)
                                                                                                 }}>{value}</Checkbox>)}
            </div>
        </div>
    </Card>
}

function BedDialog({isModalOpen, setIsModalOpen, beds, setBeds}: {
    isModalOpen: boolean,
    setIsModalOpen: any,
    beds: any,
    setBeds: any
}) {
    const [numBeds, setNumBeds] = useState<number | null>(0);
    const [bedType, setBedType] = useState('King');
    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setBeds(beds.concat({number: numBeds, type: bedType}));
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={false}>
        <Form layout={'vertical'}>
            <Form.Item label={'Number Of Beds'}>
                <InputNumber min={1} onChange={(value: number | null) => setNumBeds(value)}/>
            </Form.Item>
            <Form.Item label={'Bed Type'}>
                <Select defaultValue={'King'}
                        onChange={(value) => setBedType(value)}
                        options={bedTypes.map((value, index) => ({value: value, label: value + ' Bed'}))}/>
            </Form.Item>
            <Form.Item>
                <Button type={'primary'} block onClick={handleOk}>Add</Button>
            </Form.Item>
        </Form>
    </Modal>
}