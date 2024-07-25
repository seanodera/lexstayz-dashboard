'use client'
import {Button, Card, Checkbox, Col, Image, Input, InputNumber, Row, TimePicker, Upload} from "antd";
import React, {useEffect, useState} from "react";
import {PlusCircleOutlined, PlusOutlined, UploadOutlined} from "@ant-design/icons";
import {UploadChangeParam} from "antd/es/upload";
import {UploadFile} from "antd/lib";
import {hotelFacilities} from "@/data/hotelsDataLocal";
import dayjs, {Dayjs} from "dayjs";
import Link from "next/link";
import {uploadStay} from "@/data/hotelsData";
import {useRouter} from "next/navigation";
import {Field, Fieldset, Label, Select} from "@headlessui/react";
import {countries} from "country-data";

import UploadImagesComponent from "@/components/accomodations/uploadImagesComponent";
import {fetchStaysAsync} from "@/slices/bookingSlice";
import {useAppDispatch} from "@/hooks/hooks";


export default function ListingEditComponent({stay, partial}: { stay?: any, partial?: any }) {
    const [name, setName] = useState<string>('');
    const [type, setType] = useState<string>('');
    const [poster, setPoster] = useState<any>('');
    const [images, setImages] = useState<string[]>([]);
    const [description, setDescription] = useState('');
    const [facilities, setFacilities] = useState<Array<string>>([]);
    const [checkInTime, setCheckInTime] = useState<string>('12:00');
    const [checkOutTime, setCheckOutTime] = useState<string>('14:00');
    const router = useRouter();

    const [country, setCountry] = useState<string>('Kenya');
    const [city,setCity] =   useState<string>('');
    const [district,setDistrict] =   useState<string>('');
    const [street,setStreet] =   useState<string>('');
    const [street2,setStreet2] = useState<string>('');
    const [zipCode,setZipCode] = useState<string>('');

    const [minAge,setMinAge] = useState<number>(18);
    const [smoking, setSmoking] = useState<string>('Designated Smoking Areas');
    const [parties,setParties] = useState<string>('Yes');
    const [pets,setPets] = useState<string>('No')

    const [cancellation,setCancellation] = useState<string>('Free')
    const [cancellationRate,setCancellationRate] = useState<number>(20);
    const [cancellationTime,setCancellationTime] = useState<number>(0);
    const [timeSpace,setTimeSpace] = useState<string>('Days');
    const [preDate,setPreDate] = useState<boolean>(true)
    const dispatch = useAppDispatch()

    const handleChange = (info: UploadChangeParam<UploadFile<any>>) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            setPoster(e.target?.result);
            //setFile(info.file.originFileObj);
        };
        reader.readAsDataURL(info.file.originFileObj as File);
    };
    useEffect(() => {
        if (stay) {

        } else if (partial) {
            setName(partial.name);
            setType(partial.type);
        }
    });

    async function SaveStay() {
        const newStay = {
            name: name,
            type: type,
            description: description,
            facilities: facilities,
            checkInTime: checkInTime,
            checkOutTime: checkOutTime,
            published: false,
            location: {
                street: street,
                street2: street2,
                district: district,
                city: city,
                country: country,
                zipCode: zipCode,
            },
            cancellation: {
                cancellation: cancellation,
                rate: cancellationRate,
                time: cancellationTime,
                timeSpace: timeSpace,
                preDate: preDate,
            },
            minAge: minAge,
            smoking: smoking,
            parties: parties,
            pets: pets,
        }
        if (partial) {
            uploadStay(newStay, poster, images).then((response) => {
                console.log('Done')

                // @ts-ignore
                dispatch(fetchStaysAsync());
                router.push('/accommodations');
            })
        }
    }

    return <div>
        <div className={'flex justify-between items-center mb-2'}>
            <div className={''}>
                <h3 className={'text-gray-500 font-bold mb-0'}>Rooms</h3>
                <h1 className={'font-bold'}>{name}</h1>
            </div>

            <div className={'space-x-2'}>
                <Button type={'primary'} size={'large'} onClick={() => SaveStay()}>Save</Button>
            </div>
        </div>
        <Card>
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
                            <h3 className={'text-nowrap'}>Check In Time</h3>
                            <TimePicker format={'HH:mm'} value={dayjs(checkInTime, 'HH:mm')}
                                        onChange={(_value, timeString) => setCheckInTime(timeString.toString())}/>
                        </div>
                        <div>
                            <h3 className={'text-nowrap'}>Check Out Time</h3>
                            <TimePicker format={'HH:mm'} value={dayjs(checkOutTime, 'HH:mm')}
                                        onChange={(_value, timeString) => setCheckOutTime(timeString.toString())}/>
                        </div>
                    </div>
                </Col>
                <Col span={18} className={'space-y-8'}>
                    <div>
                        <h3 className={'font-bold mb-0'}>Location</h3>
                        <Fieldset className={'grid grid-cols-3 gap-8'}>
                            <Field>
                                <Label className={'text-gray-500 font-bold mb-0'}>Street Address</Label>
                                <Input className={'w-full'} value={street} onChange={(e) => setStreet(e.target.value)}/>
                            </Field>
                            <Field>
                                <Label className={'text-gray-500 font-bold mb-0'}>Street Address 2</Label>
                                <Input className={'w-full'} value={street2}
                                       onChange={(e) => setStreet2(e.target.value)}/>
                            </Field>
                            <Field>
                                <Label className={'text-gray-500 font-bold mb-0'}>District</Label>
                                <Input className={'w-full'} value={district}
                                       onChange={(e) => setDistrict(e.target.value)}/>
                            </Field>
                            <Field>
                                <Label className={'text-gray-500 font-bold mb-0'}>City</Label>
                                <Input placeholder={'City'} value={city} onChange={(e) => setCity(e.target.value)}/>
                            </Field>
                            <Field>
                                <Label className={'text-gray-500 font-bold mb-0'}>Zip Code</Label>
                                <Input className={'w-full'} value={zipCode}
                                       onChange={(e) => setZipCode(e.target.value)}/>
                            </Field>
                            <Field>
                                <Label className={'text-gray-500 font-bold mb-0'}>Country</Label>
                                <Select className={'appearance-none py-1 rounded w-full active:border-primary'}
                                        value={country} onChange={(e) => setCountry(e.target.value)}>
                                    {countries.all.map((value, index) => <option key={index}
                                                                                 value={value.name}>{value.name}</option>)}
                                </Select>
                            </Field>
                        </Fieldset>
                    </div>

                    <div>
                        <h3 className={'font-bold mb-0'}>Rules</h3>
                        <Fieldset className={'grid grid-cols-3 gap-8'}>
                            <Field>
                                <Label className={'text-gray-500 font-bold mb-0'}>Age Restriction</Label>
                                <Input type={'number'} min={16} max={60} value={minAge}
                                       onChange={(e) => setMinAge(parseInt(e.target.value))}/>
                            </Field>
                            <Field>
                                <Label className={'text-gray-500 font-bold mb-0'}>Smoking</Label>
                                <Select className={'appearance-none py-1 rounded w-full active:border-primary'}
                                        value={smoking} onChange={(e) => setSmoking(e.target.value)}>
                                    <option value={'Designated Smoking Areas'}>Designated Smoking Areas</option>
                                    <option value={'Yes'}>Yes</option>
                                    <option value={'No'}>No</option>
                                </Select>
                            </Field>
                            <Field>
                                <Label className={'text-gray-500 font-bold mb-0'}>Pets allowed</Label>
                                <Select className={'appearance-none py-1 rounded w-full active:border-primary'}
                                        value={pets} onChange={(e) => setPets(e.target.value)}>
                                    <option value={'Yes'}>Yes</option>
                                    <option value={'No'}>No</option>
                                </Select>
                            </Field>
                            <Field>
                                <Label className={'text-gray-500 font-bold mb-0'}>Parties Allowed</Label>
                                <Select className={'appearance-none py-1 rounded w-full active:border-primary'}
                                        value={parties} onChange={(e) => setParties(e.target.value)}>
                                    <option value={'Yes'}>Yes</option>
                                    <option value={'No'}>No</option>
                                </Select>
                            </Field>
                            <Field>
                                <Label className={'text-gray-500 font-bold mb-0'}>Cancellation</Label>
                                <Select value={cancellation} onChange={(e) => setCancellation(e.target.value)} className={'appearance-none py-1 rounded w-full active:border-primary'}>
                                    <option value={'Free'}>Free</option>
                                    <option value={'Flat Rate'}>Flat Rate</option>
                                    <option value={'Percentage'}>Percentage</option>
                                </Select>
                            </Field>
                            <Field>
                                <Label className={'text-gray-500 font-bold mb-0'}>Cancellation Value</Label>
                                <Input type={'number'} disabled={cancellation === 'Free'} value={cancellationRate} onChange={(e) => setCancellationRate(parseInt(e.target.value))}/>
                            </Field>
                            <Field className={'grid grid-cols-subgrid col-span-3'}>
                                <Label className={'text-gray-500 font-bold mb-0'}>Cancellation Time</Label>
                                <Input className={'col-start-1'} disabled={cancellation === 'Free'} type={'number'} value={cancellationTime} onChange={(e) => setCancellationTime(parseInt(e.target.value))}/>
                                <Select disabled={cancellation === 'Free'} value={timeSpace} onChange={(e) => setTimeSpace(e.target.value)} className={'appearance-none py-1 rounded w-full active:border-primary col-start-2'}>
                                    <option>Days</option>
                                    <option>Weeks</option>
                                    <option>Months</option>
                                </Select>
                                <Select disabled={cancellation === 'Free'} value={String(preDate)} onChange={(value) => setPreDate(Boolean(value.target.value))} className={'appearance-none py-1 rounded w-full active:border-primary '}>
                                    <option value={String(true)}>Before Check In</option>
                                    <option value={String(false)}>After Booking Date</option>
                                </Select>
                            </Field>
                        </Fieldset>
                    </div>

                    <div>
                        <h3 className={'font-bold mb-0'}>Description</h3>
                        <Input.TextArea rows={4} placeholder={'Enter accommodation Description'}
                                        onChange={(e) => setDescription(e.target.value)} value={description}/>
                    </div>


                </Col>
            </Row>

            <UploadImagesComponent onImageListChange={(images) => {
                setImages(images)
                console.log(images)
            }}/>
            <h3 className={'font-bold mt-8'}>Room Facilities Offered</h3>
            <div className={'grid grid-cols-4 gap-4'}>
                {hotelFacilities.map((value: any, index: number) => {
                    let name = Object.keys(value)[ 0 ];

                    return <div key={index} className={'flex flex-col'}>
                        <h3 className={'font-medium mb-0'}>{name}</h3>
                        {value[ name ].map((item: string, index: number) => <Checkbox key={index} onChange={(e) => {
                            if (e.target.checked) {
                                if (!facilities.includes(item)) {
                                    setFacilities(facilities.concat([item]));
                                }
                            } else {
                                if (facilities.includes(item)) {
                                    setFacilities(facilities.toSpliced(facilities.indexOf(item), 1));
                                }
                            }
                            console.log(facilities)
                        }} checked={facilities.includes(item)}>{item}</Checkbox>)}
                    </div>
                })}
            </div>
        </Card>
    </div>
}