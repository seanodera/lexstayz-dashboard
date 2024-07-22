'use client'
import {useParams} from "next/navigation";
import {useAppDispatch, useAppSelector} from "@/hooks/hooks";
import {resetBooking, selectCurrentId, selectCurrentStay, setCurrentStayFromId} from "@/slices/bookingSlice";
import React, {useEffect} from "react";
import RoomEditComponent from "@/components/accomodations/RoomEditComponent";


export default function Page() {
    const {id, roomId} = useParams()
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
    } else {
        const room = stay.rooms.find((value: any) => value.id.toString() === roomId.toString())

        return <div>
            <RoomEditComponent room={room}/>
        </div>;
    }
}
