'use client'
import {Button, Card, Checkbox, Col, Image, Input, Row, TimePicker, Upload} from "antd";
import React, {useEffect, useState} from "react";
import {UploadChangeParam} from "antd/es/upload";
import {UploadFile} from "antd/lib";
import dayjs from "dayjs";
import {useRouter} from "next/navigation";
import {Field, Fieldset, Label, Select} from "@headlessui/react";
import {countries} from "country-data";

import UploadImagesComponent from "@/components/accomodations/uploadImagesComponent";
import {fetchStaysAsync, updateStayAsync, uploadStayAsync} from "@/slices/staySlice";
import {useAppDispatch} from "@/hooks/hooks";
import {UploadOutlined} from "@ant-design/icons";
import {hotelFacilities} from "@/data/hotelsDataLocal";
import {getAmenityIcon} from "@/components/utilities/amenityIcon";

export default function ListingEditComponent({stay, partial}: { stay?: any, partial?: any }) {
    const [name, setName] = useState<string>('');
    const [type, setType] = useState<string>('');
    const [poster, setPoster] = useState<any>('');
    const [images, setImages] = useState<string[]>([]);
    const [description, setDescription] = useState('');
    const [facilities, setFacilities] = useState<Array<string>>([]);
    const [checkInTime, setCheckInTime] = useState<string>('12:00');
    const [checkOutTime, setCheckOutTime] = useState<string>('14:00');
    const [currency, setCurrency] = useState<string>('USD')

    const [bedrooms, setBedrooms] = useState(0)
    const [bathrooms, setBathrooms] = useState(0)
    const [beds, setBeds] = useState(0)

    const [price, setPrice] = useState(0)
    const [weeklyPrice, setWeeklyPrice] = useState<number>()
    const [monthlyPrice, setMonthlyPrice] = useState<number>()
    const [yearlyPrice, setYearlyPrice] = useState<number>()

    const [maxGuests, setMaxGuests] = useState(1)

    const router = useRouter();

    const [country, setCountry] = useState<string>('Kenya');
    const [city, setCity] = useState<string>('');
    const [district, setDistrict] = useState<string>('');
    const [street, setStreet] = useState<string>('');
    const [street2, setStreet2] = useState<string>('');
    const [zipCode, setZipCode] = useState<string>('');

    const [minAge, setMinAge] = useState<number>(18);
    const [smoking, setSmoking] = useState<string>('Designated Smoking Areas');
    const [parties, setParties] = useState<string>('Yes');
    const [pets, setPets] = useState<string>('No')

    const [cancellation, setCancellation] = useState<string>('Free')
    const [cancellationRate, setCancellationRate] = useState<number>(20);
    const [cancellationTime, setCancellationTime] = useState<number>(0);
    const [timeSpace, setTimeSpace] = useState<string>('Days');
    const [preDate, setPreDate] = useState<boolean>(true)
    const dispatch = useAppDispatch()

    // Handle Change for poster image
    const handleChange = (info: UploadChangeParam<UploadFile<any>>) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            setPoster(e.target?.result);
        };
        reader.readAsDataURL(info.file.originFileObj as File);
    };

    useEffect(() => {
        if (stay) {
            setName(stay.name || '');
            setType(stay.type || '');
            setPoster(stay.poster || '');
            setImages(stay.images || []);
            setDescription(stay.description || '');
            setFacilities(stay.facilities || []);
            setCheckInTime(stay.checkInTime || '12:00');
            setCheckOutTime(stay.checkOutTime || '14:00');
            setCurrency(stay.currency || 'USD');

            setCountry(stay.location?.country || 'Kenya');
            setCity(stay.location?.city || '');
            setDistrict(stay.location?.district || '');
            setStreet(stay.location?.street || '');
            setStreet2(stay.location?.street2 || '');
            setZipCode(stay.location?.zipCode || '');

            setMinAge(stay.minAge || 18);
            setSmoking(stay.smoking || 'Designated Smoking Areas');
            setParties(stay.parties || 'Yes');
            setPets(stay.pets || 'No');

            setCancellation(stay.cancellation?.cancellation || 'Free');
            setCancellationRate(stay.cancellation?.rate || 20);
            setCancellationTime(stay.cancellation?.time || 0);
            setTimeSpace(stay.cancellation?.timeSpace || 'Days');
            setPreDate(stay.cancellation?.preDate ?? true); // Using ?? to ensure boolean handling

            if (stay.type === 'Home') {
                setPrice(stay.price || 0);
                setBedrooms(stay.bedrooms || 0);
                setBathrooms(stay.bathrooms || 0);
                setMaxGuests(stay.maxGuests || 0);
                setBeds(stay.beds || 0);

                if (stay.pricing){
                    const pricing = stay.pricing;
                    setWeeklyPrice(pricing.weekly);
                    setMonthlyPrice(pricing.monthly);
                    setYearlyPrice(pricing.yearly);
                }

            }
        } else if (partial) {
            setName(partial.name || '');
            setType(partial.type || '');
        }
    }, [stay, partial]);


    async function SaveStay() {
        let update: {
            base: number;
            weekly?: number;
            yearly?: number;
            monthly?: number;
        } = {
            base: price,
        }
        if (weeklyPrice) {
            update.weekly = weeklyPrice
        }
        if (monthlyPrice) {
            update.monthly = monthlyPrice
        }
        if (yearlyPrice) {
            update.yearly = yearlyPrice
        }
        const homeSpecific = (type === 'Home') ? {
            bedrooms: bedrooms,
            bathrooms: bathrooms,
            beds: beds,
            price: price,
            pricing: update,
            maxGuests: maxGuests
        } : {}
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
            rating: 0,
            currency: currency,
            ...homeSpecific
        }

        if (partial) {

            dispatch(uploadStayAsync({stay: newStay, poster, images})).then(() => {


                dispatch(fetchStaysAsync());
                router.push('/accommodations');
            });
        } else if (stay) {
            dispatch(updateStayAsync({
                stay,
                newStay: {...newStay, location: {...stay.location, ...newStay.location}},
                poster,
                images
            })).then(() => {
                router.push('/accommodations');
            })
        }
    }

    return <div>
        <div className={'flex justify-between items-center mb-2'}>
            <div className={''}>
                <h3 className={'text-gray-500 font-bold mb-0'}>Accommodation</h3>
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
                    <div className={'mt-2'}>
                        {stay.type === 'Home' && <div>
                            <Fieldset>
                                <Field>
                                    <Label className={'text-gray-500 font-bold mb-0'}>Price</Label>
                                    <Input className={'w-full'} type={'number'} value={price} min={1}
                                           onChange={(e) => setPrice(parseInt(e.target.value))}/>
                                </Field>
                                <Field>
                                    <Label className={'text-gray-500 font-bold mb-0'}>Weekly Price</Label>
                                    <Input className={'w-full'} type={'number'} value={weeklyPrice}
                                           onChange={(e) => setWeeklyPrice(parseInt(e.target.value))}/>
                                </Field>
                                <Field>
                                    <Label className={'text-gray-500 font-bold mb-0'}>Monthly Price</Label>
                                    <Input className={'w-full'} type={'number'} value={monthlyPrice}
                                           onChange={(e) => setMonthlyPrice(parseInt(e.target.value))}/>
                                </Field>
                                <Field>
                                    <Label className={'text-gray-500 font-bold mb-0'}>Yearly Price</Label>
                                    <Input className={'w-full'} type={'number'} value={yearlyPrice}
                                           onChange={(e) => setYearlyPrice(parseInt(e.target.value))}/>
                                </Field>
                                <div className={'grid grid-cols-2 gap-3'}>
                                    <Field>
                                        <Label className={'text-gray-500 font-bold mb-0'}>Max Guests</Label>
                                        <Input className={'w-full'} type={'number'} value={maxGuests} min={1}
                                               onChange={(e) => setMaxGuests(parseInt(e.target.value))}/>
                                    </Field>
                                    <Field>
                                        <Label className={'text-gray-500 font-bold mb-0'}>Bedrooms</Label>
                                        <Input className={'w-full'} type={'number'} value={bedrooms} min={1}
                                               onChange={(e) => setBedrooms(parseInt(e.target.value))}/>
                                    </Field>
                                    <Field>
                                        <Label className={'text-gray-500 font-bold mb-0'}>Beds</Label>
                                        <Input className={'w-full'} type={'number'} value={beds} min={1}
                                               onChange={(e) => setBeds(parseInt(e.target.value))}/>
                                    </Field>
                                    <Field>
                                        <Label className={'text-gray-500 font-bold mb-0'}>Baths</Label>
                                        <Input className={'w-full'} type={'number'} value={bathrooms} min={1}
                                               onChange={(e) => setBathrooms(parseInt(e.target.value))}/>
                                    </Field>
                                </div>
                            </Fieldset>
                        </div>}
                        {/*<h3 className={'text-nowrap'}>Stay Currency</h3>*/}
                        {/*<Select value={currency} onChange={(value) => setCurrency(value.target.value)} className={'appearance-none py-1 rounded active:border-primary'}>*/}
                        {/*    <option value={'GHS'}>GHS</option>*/}
                        {/*    <option value={'USD'}>USD</option>*/}
                        {/*    <option value={'GBP'}>GBP</option>*/}
                        {/*    <option value={'EUR'}>EUR</option>*/}
                        {/*</Select>*/}
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
                                <Select value={smoking} onChange={(e) => setSmoking(e.target.value)}
                                        className={'appearance-none py-1 rounded w-full active:border-primary'}>
                                    <option value="Designated Smoking Areas">Designated Smoking Areas</option>
                                    <option value="No Smoking Areas">No Smoking Areas</option>
                                </Select>
                            </Field>
                            <Field>
                                <Label className={'text-gray-500 font-bold mb-0'}>Parties</Label>
                                <Select value={parties} onChange={(e) => setParties(e.target.value)}
                                        className={'appearance-none py-1 rounded w-full active:border-primary'}>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </Select>
                            </Field>
                            <Field>
                                <Label className={'text-gray-500 font-bold mb-0'}>Pets</Label>
                                <Select value={pets} onChange={(e) => setPets(e.target.value)}
                                        className={'appearance-none py-1 rounded w-full active:border-primary'}>
                                    <option value="No">No</option>
                                    <option value="Yes">Yes</option>
                                </Select>
                            </Field>
                        </Fieldset>
                    </div>
                    <div>
                        <h3 className={'font-bold mb-0'}>Cancellation Policy</h3>
                        <Fieldset className={'grid grid-cols-3 gap-8'}>
                            <Field className={'col-span-1'}>
                                <Label className={'text-gray-500 font-bold mb-0'}>Cancellation</Label>
                                <Select value={cancellation} onChange={(e) => setCancellation(e.target.value)}
                                        className={'appearance-none py-1 rounded w-full active:border-primary'}>
                                    <option value="Free">Free</option>
                                    <option value="Non-Refundable">Non-Refundable</option>
                                    <option value="Other">Other</option>
                                </Select>
                            </Field>
                            <Field className={'col-span-1'}>
                                <Label className={'text-gray-500 font-bold mb-0'}>Cancellation Rate (%)</Label>
                                <Input disabled={!(cancellation === 'Other')} type={'number'} className={'w-full'}
                                       value={cancellationRate}
                                       onChange={(e) => setCancellationRate(parseInt(e.target.value))}/>
                            </Field>
                            <Field className={'col-span-1'}>
                                <Label className={'text-gray-500 font-bold mb-0'}>Cancellation Time</Label>
                                <div className={'flex space-x-2 items-center'}>
                                    <Input disabled={!(cancellation === 'Other')} className={'w-full'}
                                           value={cancellationTime}
                                           onChange={(e) => setCancellationTime(parseInt(e.target.value))}/>
                                    <Select disabled={!(cancellation === 'Other')} value={timeSpace}
                                            onChange={(e) => setTimeSpace(e.target.value)}
                                            className={'appearance-none py-1 rounded w-full active:border-primary disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-400'}>
                                        <option value="Days">Days</option>
                                        <option value="Hours">Hours</option>
                                    </Select>
                                </div>
                            </Field>
                            <Field className={'col-span-1'}>
                                <Label className={'text-gray-500 font-bold  mb-0'}>Pre-Date Cancellation</Label>
                                <Select disabled={!(cancellation === 'Other')} value={String(preDate)}
                                        onChange={(value) => setPreDate(Boolean(value.target.value))}
                                        className={'appearance-none py-1 rounded w-full active:border-primary disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-400'}>
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

            <UploadImagesComponent images={images} onImageListChange={(images) => {
                setImages(images)
                console.log(images)
            }}/>
            <h3 className={'font-bold mt-8'}>Room Facilities Offered</h3>
            <div className={'grid grid-cols-4 gap-4'}>
                {hotelFacilities.map((value: any, index: number) => {
                    let name = Object.keys(value)[ 0 ];

                    return <div key={index} className={'flex flex-col'}>
                        <h3 className={'font-medium mb-0'}>{name}</h3>
                        {value[ name ].map((item: string, index: number) => {
                            const IconComponent = getAmenityIcon(item);

                            function handleChange(e: any) {
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
                            }

                            return <Checkbox key={index} onChange={handleChange}
                                             checked={facilities.includes(item)}><span
                                className={'text-primary'}><IconComponent/></span> {item}</Checkbox>;
                        })}
                    </div>
                })}
            </div>
        </Card>
    </div>
}
