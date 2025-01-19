'use client'
import {useParams} from "next/navigation";
import {useAppDispatch, useAppSelector} from "@/hooks/hooks";
import { selectCurrentStay, setCurrentStayFromId} from "@/slices/staySlice";
import React, {useEffect} from "react";
import RoomEditComponent from "@/components/accomodations/RoomEditComponent";
import {Button} from "antd";
import {Hotel} from "@/lib/types";


export default function Page() {
    const {id, roomId} = useParams()
    const dispatch = useAppDispatch();

    const stay = useAppSelector(selectCurrentStay);
    useEffect(() => {

        if (!stay || id && id !== stay.id){
            dispatch(setCurrentStayFromId(id.toString()));
        }
    }, [id]);



    if (!stay || stay.id === undefined) {
        return <div></div>;
    } else {
        const room = (stay as Hotel).rooms.find((value: any) => value.id.toString() === roomId.toString())

        return <div className={'pt-4 pb-10 px-10'}>
            <div className={'flex justify-between mb-4 items-center'}>
                <div className={''}>
                    <h3 className={'text-gray-500 font-bold mb-0'}>Edit Room</h3>
                    <h1 className={'font-bold'}>{stay.name}</h1>
                </div>
                <Button size={'large'} type={'primary'}>Save Changes</Button>
            </div>
            <RoomEditComponent room={room} stayId={stay.id}/>
        </div>;
    }
}
