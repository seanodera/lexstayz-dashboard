'use client'
import React from "react";
import { Field, Fieldset, Label } from "@headlessui/react";
import { Input } from "antd";
import { useAppSelector, useAppDispatch } from "@/hooks/hooks";
import { updateLocation, selectPartialStay } from "@/slices/createStaySlice";
import { countries } from "country-data";

export default function LocationForm() {
    const stay = useAppSelector(selectPartialStay);
    const location = stay.location;
    const dispatch = useAppDispatch();

    if (!location.street) {
        return null; // Hide the form if no location is selected
    }
    console.log(location)
    return (
        <Fieldset className={'grid grid-cols-1 md:grid-cols-2 gap-8 mt-4'}>
            <Field>
                <Label className={'text-gray-500 font-bold mb-0'}>Street Address 2</Label>
                <Input
                    className={'w-full'}
                    value={location.street2}
                    onChange={(e) => dispatch(updateLocation({ street2: e.target.value }))}
                />
            </Field>
            <Field>
                <Label className={'text-gray-500 font-bold mb-0'}>District</Label>
                <Input
                    className={'w-full'}
                    value={location.district || ''}
                    onChange={(e) => dispatch(updateLocation({ district: e.target.value }))}
                />
            </Field>
            <Field>
                <Label className={'text-gray-500 font-bold mb-0'}>City</Label>
                <Input
                    placeholder={'City'}
                    value={location.city || ''}
                    onChange={(e) => dispatch(updateLocation({ city: e.target.value }))}
                />
            </Field>
            <Field>
                <Label className={'text-gray-500 font-bold mb-0'}>Zip Code</Label>
                <Input
                    className={'w-full'}
                    value={location.zipCode || ''}
                    onChange={(e) => dispatch(updateLocation({ zipCode: e.target.value }))}
                />
            </Field>
            <Field>
                <Label className={'text-gray-500 font-bold mb-0'}>Country</Label>
                <select
                    className={'appearance-none py-1 rounded w-full active:border-primary'}
                    value={location.country || ''}
                    onChange={(e) => dispatch(updateLocation({ country: e.target.value }))}
                >
                    {countries.all.map((value, index) => (
                        <option key={index} value={value.name}>{value.name}</option>
                    ))}
                </select>
            </Field>
        </Fieldset>
    );
}
