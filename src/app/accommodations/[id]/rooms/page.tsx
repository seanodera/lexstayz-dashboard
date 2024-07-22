'use client'

import {Button, Card} from "antd";
import {EditOutlined, PlusCircleOutlined} from "@ant-design/icons";
import React, {useEffect} from "react";
import {useParams} from "next/navigation";
import {useAppDispatch, useAppSelector} from "@/hooks/hooks";
import {resetBooking, selectCurrentId, selectCurrentStay, setCurrentStayFromId} from "@/slices/bookingSlice";
import ListingItem from "@/components/accomodations/ListingItem";
import RoomComponent from "@/components/accomodations/roomComponent";

export default function Page() {
    const params = useParams()[ 'id' ];
    const dispatch = useAppDispatch();
    const currentId = useAppSelector(selectCurrentId);

    useEffect(() => {
        if (currentId !== params) {
            dispatch(resetBooking(0));
            dispatch(setCurrentStayFromId(params));
        }
    }, [currentId, dispatch, params]);

    const stay = useAppSelector(selectCurrentStay);
    return <div className={'px-4 py-4'}>
        <div className={'flex justify-between items-center'}>
            <div className={''}>
                <h3 className={'text-gray-500 font-bold mb-0'}>Rooms</h3>
                <h1 className={'font-bold'}>{stay.name}</h1>
            </div>

            <div className={'space-x-2'}>
                <Button type={'primary'} icon={<PlusCircleOutlined/>} size={'large'}> Add Room</Button>
            </div>
        </div>
        <div className={'grid grid-cols-3 gap-8'}>
            {stay.rooms?.map((item: any, index: number) => <Card key={index} className={'rounded-2xl'}><RoomComponent
                room={item}/></Card>)}
        </div>
    </div>
}