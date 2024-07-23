'use client'
import {Button, Card, Checkbox, Col, Image, Input, Row, TimePicker, Upload} from "antd";
import React, {useState} from "react";
import {PlusOutlined, UploadOutlined} from "@ant-design/icons";
import {UploadChangeParam} from "antd/es/upload";
import {UploadFile} from "antd/lib";
import {hotelFacilities} from "@/data/hotelsData";
import dayjs, {Dayjs} from "dayjs";


export default function ListingEditComponent() {
    const [poster, setPoster] = useState<any>('');
    const [images, setImages] = useState([]);
    const [description, setDescription] = useState('');
    const [facilities, setFacilities] = useState<Array<string>>([]);
    const timeList = Array(24).map((value,index) => `${value}:00`)
    const [checkInTime,setCheckInTime] = useState<string>('12:00');
    const [checkOutTime,setCheckOutTime] = useState<string>('14:00');
    const handleChange = (info: UploadChangeParam<UploadFile<any>>) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            setPoster(e.target?.result);
            //setFile(info.file.originFileObj);
        };
        reader.readAsDataURL(info.file.originFileObj as File);
    };
    return <Card>
        <Row gutter={[16, 16]}>
            <Col span={6}>
                <div className={'flex justify-between items-center py-0 mb-2'}>
                    <h3 className={'font-bold mb-0'}>Main Image</h3>
                    <Upload className={''} multiple={false} onChange={handleChange} maxCount={1}
                            showUploadList={false}>
                        <Button icon={<UploadOutlined/>}>
                            Select Poster
                        </Button>
                    </Upload>
                </div>
                {(poster === '') ? <div
                    className={'flex items-center justify-center border border-dashed border-primary rounded-xl w-full aspect-video object-cover'}>

                </div> : <Image className={'aspect-video rounded-xl object-cover'} src={poster} alt=""/>}

                <div className={'flex gap-8 mt-4'}>
                    <div>
                        <h3>Check In Time</h3>
                        <TimePicker format={'HH:mm'} value={dayjs(checkInTime, 'HH:mm')}
                                    onChange={(_value, timeString) => setCheckInTime(timeString.toString())}/>
                    </div>
                    <div>
                        <h3>Check Out Time</h3>
                        <TimePicker format={'HH:mm'} value={dayjs(checkOutTime, 'HH:mm')}
                                    onChange={(_value, timeString) => setCheckOutTime(timeString.toString())}/>
                    </div>
                </div>
            </Col>
            <Col span={18}>
                <div>
                    <h3 className={'font-bold mb-4'}>Other Images</h3>
                    <Upload className={'object-cover'} prefixCls={'object-cover'} rootClassName={'object-cover'} listType={'picture-card'} maxCount={20} multiple={true} directory={true}>
                        <button style={{border: 0, background: 'none'}} type="button">
                            <PlusOutlined/>
                            <div style={{marginTop: 8}}>Upload</div>
                        </button>
                    </Upload>
                </div>

                <div>
                <h3 className={'font-bold mb-4'}>Description</h3>
                    <Input.TextArea rows={4} placeholder={'Enter accommodation Description'}
                                    onChange={(e) => setDescription(e.target.value)} value={description}/>
                </div>


            </Col>
        </Row>
        <h3 className={'font-bold mt-8'}>Room Facilities Offered</h3>
        <div className={'grid grid-cols-4 gap-4'}>
            {hotelFacilities.map((value: any, index: number) => {
                let name = Object.keys(value)[ 0 ];

                return <div key={index} className={'flex flex-col'}>
                    <h3 className={'font-medium mb-0'}>{name}</h3>
                    {value[ name ].map((item: string, index: number) => <Checkbox key={index}
                                                                                  checked={facilities.includes(item)}>{item}</Checkbox>)}
                </div>
            })}
        </div>
    </Card>
}