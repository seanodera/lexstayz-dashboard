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
import {MdOutlinePublish} from "react-icons/md";
import {getTag} from "@/components/common";
import {publishStayFirebase} from "@/data/hotelsData";


export default function Page(){
    const {id} = useParams();
    const dispatch = useAppDispatch();
    const stay = useAppSelector(selectCurrentStay);
    useEffect(() => {

            dispatch(setCurrentStayFromId(id.toString()));

    }, [id]);

    console.log(stay);
    if (!stay || stay.id === undefined) {
        return <div></div>;
    } else {
    return <div className={'pt-4 pb-10 px-10'}>
        <div className={'flex justify-between mb-4'}>
            <div className={'flex items-center gap-2'}>
                <h1 className={'font-bold'}>{stay.name}</h1>
                <span>{!stay.published? getTag('Draft'): getTag('Published')}</span>
            </div>
            <div className={'space-x-2'}>
            <Button type={'primary'} ghost icon={<EditOutlined/>} size={'large'}>Edit</Button>
                <Link href={`/accommodations/${stay.id}/rooms/create`}><Button type={'primary'} icon={<PlusCircleOutlined/>} size={'large'}> Add Room</Button></Link>
                {!stay.published? <Button type={'primary'} danger size={'large'} icon={<MdOutlinePublish/>} onClick={() => publishStayFirebase(stay)}>Publish</Button>: '' }
            </div>
        </div>
        <ListingDescription stay={stay}/>
        <h1 className={'font-bold my-4'}>Rooms</h1>
        <div className={'grid grid-cols-3 gap-8'}>
            {stay.rooms?.map((item: any, index: number) => <RoomComponent key={index} room={item} stayId={stay.id}/>)}
        </div>
    </div>
    }
}