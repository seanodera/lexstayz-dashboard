'use client'
import {useParams, usePathname} from "next/navigation";
import {Button} from "antd";
import {EditOutlined, PlusCircleOutlined} from "@ant-design/icons";
import React, {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "@/hooks/hooks";
import {selectCurrentStay, setCurrentStayFromId} from "@/slices/staySlice";
import RoomDescription from "@/components/accomodations/RoomDescription";
import Link from "next/link";


export default function Page() {
    const pathname = usePathname();
    const {id,roomId}  = useParams();
    const dispatch = useAppDispatch();
    const stay = useAppSelector(selectCurrentStay);
    useEffect(() => {

        if ( !stay || id && id !== stay.id){
            dispatch(setCurrentStayFromId(id.toString()));
        }
    }, [id]);

    console.log(stay);
    if (!stay || stay.id === undefined) {
        return <div></div>;
    } else{
    console.log("params", id, roomId)
    return <div className={'pt-4 pb-10 px-10'}>
        <div className={'flex justify-between mb-4 items-center'}>
            <div className={''}>
                <h3 className={'text-gray-500 font-bold mb-0'}>{stay.name}</h3>
                <h1 className={'font-bold capitalize my-0'}>{stay.rooms.find((value: any) => value.id === roomId).name}</h1>
            </div>
            <div className={'space-x-2'}>
                <Link href={`${pathname}/edit`}> <Button type={'primary'} ghost icon={<EditOutlined/>} size={'large'}>Edit</Button></Link>
                <Link href={`/accommodations/${stay.id}/rooms/create`}><Button type={'primary'} icon={<PlusCircleOutlined/>} size={'large'}> Add Room</Button></Link>
            </div>
        </div>
        <RoomDescription room={stay.rooms.find((value: any) => value.id === roomId.toString())}/>
    </div>
}}