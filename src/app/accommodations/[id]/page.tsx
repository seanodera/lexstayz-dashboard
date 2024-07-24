'use client'
import {resetBooking, selectCurrentId, selectCurrentStay, setCurrentStayFromId} from "@/slices/bookingSlice";
import {useAppDispatch, useAppSelector} from "@/hooks/hooks";
import React, {useEffect} from "react";
import {useParams} from "next/navigation";
import {Button} from "antd";
import ListingDescription from "@/components/accomodations/ListingDescription";
import RoomComponent from "@/components/accomodations/roomComponent";
import {EditOutlined, PlusCircleOutlined} from "@ant-design/icons";
import Link from "next/link";


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
    if (!stay || stay.id === undefined) {
        return <div></div>;
    } else {
    return <div className={'pt-4 pb-10 px-10'}>
        <div className={'flex justify-between mb-4'}>
            <h1 className={'font-bold'}>{stay.name}</h1>
            <div className={'space-x-2'}>
                <Button type={'primary'} ghost icon={<EditOutlined/>} size={'large'}>Edit</Button>
                <Link href={`/accommodations/${stay.id}/rooms/create`}><Button type={'primary'} icon={<PlusCircleOutlined/>} size={'large'}> Add Room</Button></Link>
            </div>
        </div>
        <ListingDescription stay={stay}/>
        <h1 className={'font-bold my-4'}>Rooms</h1>
        {/*<div className={'grid grid-cols-3 gap-8'}>*/}
        {/*    {stay.rooms?.map((item: any, index: number) => <RoomComponent key={index} room={item}/>)}*/}
        {/*</div>*/}
    </div>
    }
}