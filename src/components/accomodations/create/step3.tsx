'use client'
import {Card, Input, TimePicker} from "antd";
import dayjs from "dayjs";
import React, {useEffect, useState} from "react";
import {Field, Fieldset, Label, Select} from "@headlessui/react";
import {useAppDispatch, useAppSelector} from "@/hooks/hooks";
import {selectPartialStay, updateRules} from "@/slices/createStaySlice";


export default function CreateStep3() {
    const stay = useAppSelector(selectPartialStay);
    const [checkInTime, setCheckInTime] = useState<string>(stay?.checkInTime || "12:00");
    const [checkOutTime, setCheckOutTime] = useState<string>(stay?.checkOutTime || "14:00");
    const [minAge, setMinAge] = useState<number>(stay?.minAge || 16); // default age 16
    const [smoking, setSmoking] = useState<string>(stay?.smoking || "Designated Smoking Areas");
    const [parties, setParties] = useState<string>(stay?.parties || "No");
    const [pets, setPets] = useState<string>(stay?.pets || "No");
    const dispatch = useAppDispatch()

    // useEffect(() => {
    //     if (stay) {
    //         setCheckInTime(stay.checkInTime);
    //         setCheckOutTime(stay.checkOutTime);
    //         setMinAge(stay.minAge);
    //         setSmoking(stay.smoking);
    //         setParties(stay.parties);
    //         setPets(stay.pets);
    //     }
    // },);
    useEffect(() => {
        dispatch(updateRules({
            checkInTime: checkOutTime,
            checkOutTime: checkOutTime,
            minAge: minAge,
            smoking: smoking,
            parties: parties,
            pets: pets,
        }))
    }, [checkInTime,
        checkOutTime,
        minAge,
        smoking,
        parties,
        pets]);
    return <Card>
        <h2>Accommodation Rules</h2>
        <div>
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
            <Fieldset className={'grid grid-cols-1 md:grid-cols-2 gap-8'}>
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
    </Card>
}