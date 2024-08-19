'use client'
import {Card, Input} from "antd";
import React, {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "@/hooks/hooks";
import {Field, Fieldset, Label, Select} from "@headlessui/react";
import {selectPartialStay, setStayPartial, updateCancellation} from "@/slices/createStaySlice";


export default function CreateStep4() {
    const [cancellation, setCancellation] = useState<string>('Free')
    const [cancellationRate, setCancellationRate] = useState<number>(20);
    const [cancellationTime, setCancellationTime] = useState<number>(0);
    const [timeSpace, setTimeSpace] = useState<string>('Days');
    const [preDate, setPreDate] = useState<boolean>(true)
    const dispatch = useAppDispatch()
    const stay = useAppSelector(selectPartialStay)
    // useEffect(() => {
    //     if (stay){
    //         setCancellation(stay.cancellation.cancellation);
    //         setCancellationRate(stay.cancellation.rate);
    //         setCancellationTime(stay.cancellation.time);
    //         setTimeSpace(stay.cancellation.timeSpace);
    //         setPreDate(stay.cancellation.preDate);
    //     }
    // }, []);
    useEffect(() => {
        dispatch(updateCancellation({
            cancellation: cancellation,
            rate: cancellationRate,
            time: cancellationTime,
            timeSpace: timeSpace,
            preDate: preDate,
        }))
    }, [cancellation, cancellationRate, cancellationTime, preDate, timeSpace]);

    function updatePartial(data: any){
        dispatch(setStayPartial(data))
    }
    return <Card>
        <h2>Cancellation Policy</h2>
        <Fieldset className={'grid grid-cols-1 md:grid-cols-2 gap-8'}>
            <Field className={'col-span-1'}>
                <Label className={'text-gray-500 font-bold mb-0'}>Cancellation</Label>
                <Select value={stay.cancellation.cancellation} onChange={(e) => setCancellation(e.target.value)}
                        className={'appearance-none py-1 rounded w-full active:border-primary'}>
                    <option value="Free">Free</option>
                    <option value="Non-Refundable">Non-Refundable</option>
                    <option value="Other">Other</option>
                </Select>
            </Field>
            <Field className={'col-span-1'}>
                <Label className={'text-gray-500 font-bold mb-0'}>Cancellation Rate (%)</Label>
                <Input disabled={!(stay.cancellation.cancellation === 'Other')} type={'number'} className={'w-full'}
                       value={stay.cancellation.rate}
                       onChange={(e) => setCancellationRate(parseInt(e.target.value))}/>
            </Field>
            <Field className={'col-span-1'}>
                <Label className={'text-gray-500 font-bold mb-0'}>Cancellation Time</Label>
                <div className={'flex space-x-2 items-center'}>
                    <Input disabled={!(stay.cancellation.cancellation === 'Other')} className={'w-full'}
                           value={stay.cancellation.time}
                           onChange={(e) => setCancellationTime(parseInt(e.target.value))}/>
                    <Select disabled={!(stay.cancellation.cancellation === 'Other')} value={stay.cancellation.timeSpace}
                            onChange={(e) => setTimeSpace(e.target.value)}
                            className={'appearance-none py-1 rounded w-full active:border-primary disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-400'}>
                        <option value="Days">Days</option>
                        <option value="Hours">Hours</option>
                    </Select>
                </div>
            </Field>
            <Field className={'col-span-1'}>
                <Label className={'text-gray-500 font-bold  mb-0'}>Pre-Date Cancellation</Label>
                <Select disabled={!(stay.cancellation.cancellation === 'Other')} value={String(stay.cancellation.preDate)}
                        onChange={(value) => setPreDate(Boolean(value.target.value))}
                        className={'appearance-none py-1 rounded w-full active:border-primary disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-400'}>
                    <option value={String(true)}>Before Check In</option>
                    <option value={String(false)}>After Booking Date</option>
                </Select>
            </Field>
        </Fieldset>
    </Card>
}