'use client'
import {Card, Checkbox} from "antd";
import React, {useEffect, useState} from "react";
import {homeFacilities, hotelFacilities} from "@/data/hotelsDataLocal";
import {getAmenityIcon} from "@/components/utilities/amenityIcon";
import {useAppDispatch, useAppSelector} from "@/hooks/hooks";
import {selectPartialStay, updateFacilities} from "@/slices/createStaySlice";


export default function CreateStep5() {
    const stay = useAppSelector(selectPartialStay);
    const [facilities, setFacilities] = useState<Array<string>>([]);
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(updateFacilities(facilities))
    },[facilities]);

    return <Card>

        <h2 className={'font-bold'}>Accommodation Facilities Offered</h2>
        {stay.type === 'Home'? <div className={'grid md:grid-cols-2 lg:grid-cols-3  gap-4'}>
            {homeFacilities.map((value, index: number) => {
                return <div key={index} className={'flex flex-col'}>
                    <h3 className={'font-medium mb-0'}>{value.name}</h3>
                    {value.features.map((item, index) => {
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

                        return <Checkbox key={index} onChange={handleChange} checked={facilities.includes(item)}><span
                            className={'text-primary'}><IconComponent/></span> {item}</Checkbox>;
                    })}</div>;
            })}
        </div> : <div className={'grid md:grid-cols-2 lg:grid-cols-3 4 gap-4'}>
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

                        return <Checkbox key={index} onChange={handleChange} checked={facilities.includes(item)}><span
                            className={'text-primary'}><IconComponent/></span> {item}</Checkbox>;
                    })}
                </div>
            })}
        </div>}
    </Card>
}