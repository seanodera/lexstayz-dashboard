'use client'
import {useParams} from "next/navigation";
import {Button} from "antd";
import {EditOutlined, PlusCircleOutlined} from "@ant-design/icons";
import React, {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "@/hooks/hooks";
import {resetBooking, selectCurrentId, selectCurrentStay, setCurrentStayFromId} from "@/slices/bookingSlice";
import RoomDescription from "@/components/accomodations/RoomDescription";
import Link from "next/link";


export default function Page() {
    const {id,roomId} = useParams()
    const dispatch = useAppDispatch();
    const currentId = useAppSelector(selectCurrentId);

    useEffect(() => {
        if (currentId !== id) {
            dispatch(resetBooking(0));
            dispatch(setCurrentStayFromId(id));
        }
    }, [currentId, dispatch, id]);

    const stay = useAppSelector(selectCurrentStay);
    if (!stay || stay.id === undefined) {
        return <div></div>;
    } else{
    console.log("params", id, roomId)
    return <div className={'px-4 py-4'}>
        <div className={'flex justify-between mb-4 items-center'}>
            <div className={''}>
                <h3 className={'text-gray-500 font-bold mb-0'}>{stay.name}</h3>
                <h1 className={'font-bold capitalize my-0'}>{stay.rooms.find((value: any) => value.id === parseInt(roomId.toString())).name}</h1>
            </div>
            <div className={'space-x-2'}>
                <Button type={'primary'} ghost icon={<EditOutlined/>} size={'large'}>Edit</Button>
                <Link href={`/accommodations/${stay.id}/rooms/create`}><Button type={'primary'} icon={<PlusCircleOutlined/>} size={'large'}> Add Room</Button></Link>
            </div>
        </div>
        <RoomDescription room={stay.rooms.find((value: any) => value.id === parseInt(roomId.toString()))}/>
    </div>
}}