'use client'
import {resetBooking, selectCurrentId, selectCurrentStay, setCurrentStayFromId} from "@/slices/bookingSlice";
import {useAppDispatch, useAppSelector} from "@/hooks/hooks";
import React, {useEffect} from "react";
import {useParams} from "next/navigation";
import {Description} from "@headlessui/react";
import {Button, Descriptions} from "antd";
import DescriptionsItem from "antd/es/descriptions/Item";
import { Image } from "antd";
import ListingDescription from "@/components/accomodations/ListingDescription";
import RoomComponent from "@/components/accomodations/roomComponent";
import {EditOutlined, PlusCircleOutlined} from "@ant-design/icons";


export default function Page(){
    const params = useParams()['id'];
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
        <div className={'flex justify-between mb-4'}>
            <h2 className={'font-bold'}>{stay.name}</h2>
            <div className={'space-x-2'}>
                <Button type={'primary'} ghost icon={<EditOutlined/>} size={'large'}>Edit</Button>
                <Button type={'primary'} icon={<PlusCircleOutlined/>} size={'large'}> Add Room</Button>
            </div>
        </div>
        <ListingDescription stay={stay}/>
        <h2 className={'font-bold my-4'}>Rooms</h2>
        <div className={'grid grid-cols-3 gap-8'}>
            {stay.rooms.map((item: any, index: number) => <RoomComponent key={index} room={item}/>)}
        </div>
    </div>
}