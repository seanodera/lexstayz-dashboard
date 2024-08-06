'use client'
import {Card, Input} from "antd";
import {useAppDispatch, useAppSelector} from "@/hooks/hooks";
import {selectPartialStay, updateLocation} from "@/slices/createStaySlice";
import {Field, Fieldset, Label, Select} from "@headlessui/react";
import {countries} from "country-data";
import React, {useEffect, useState} from "react";


export default function CreateStep1() {
    const stay = useAppSelector(selectPartialStay)
    const location = stay.location;
    const [country, setCountry] = useState<string>('');
    const [city, setCity] = useState<string>('');
    const [district, setDistrict] = useState<string>('');
    const [street, setStreet] = useState<string>('');
    const [street2, setStreet2] = useState<string>('');
    const [zipCode, setZipCode] = useState<string>('');

    useEffect(() => {
        if (location) {
            setCountry(location.country || '');
            setCity(location.city || '');
            setDistrict(location.district || '');
            setStreet(location.street || '');
            setStreet2(location.street2 || '');
            setZipCode(location.zipCode || '');
        }
    }, [location]);
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(updateLocation({
            country: country,
            city: city,
            district:district,
            street:street,
            street2:street2,
            zipCode:zipCode,
        }));
    }, [city, country, district, street, street2, zipCode]);
    console.log(stay)
    return <Card>
        <h3 className={'font-semibold mb-1'}>Where is your hotel located</h3>
        <div>
            <Fieldset className={'grid grid-cols-1 md:grid-cols-2 gap-8'}>
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
    </Card>
}