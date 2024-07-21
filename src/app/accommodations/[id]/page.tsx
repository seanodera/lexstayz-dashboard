'use client'
import {resetBooking, selectCurrentId, selectCurrentStay, setCurrentStayFromId} from "@/slices/bookingSlice";
import {useAppDispatch, useAppSelector} from "@/hooks/hooks";
import {useEffect} from "react";
import {useParams} from "next/navigation";


export default function Page(){
    const params = useParams()['id'];
    const dispatch = useAppDispatch();
    const currentId = useAppSelector(selectCurrentId);

    useEffect(() => {
        if (currentId !== params) {
            dispatch(resetBooking(0));
            dispatch(setCurrentStayFromId(params));
        }
    }, [dispatch, params]);

    const stay = useAppSelector(selectCurrentStay);
    return <div>
        
    </div>
}