'use client'
import RoomEditComponent from "@/components/accomodations/RoomEditComponent";
import React from "react";
import {useAppSelector} from "@/hooks/hooks";
import {selectCurrentStay} from "@/slices/bookingSlice";


export default function Page(){
    const stay = useAppSelector(selectCurrentStay);
    return <div className={'pt-4 pb-10 px-10'}>
        <div className={''}>
            <h3 className={'text-gray-500 font-bold mb-0'}>Create Room</h3>
            <h1 className={'font-bold'}>{stay.name}</h1>
        </div>
        <RoomEditComponent/>
    </div>
}