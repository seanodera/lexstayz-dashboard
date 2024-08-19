'use client'
import {useParams} from "next/navigation";
import {useAppDispatch, useAppSelector} from "@/hooks/hooks";
import {selectCurrentStay, setCurrentStayFromId} from "@/slices/staySlice";
import {useEffect} from "react";
import ListingEditComponent from "@/components/accomodations/ListingEditComponent";


export default function Page(){
    const {id} = useParams();
    const dispatch = useAppDispatch();
    const stay = useAppSelector(selectCurrentStay);
    useEffect(() => {

        dispatch(setCurrentStayFromId(id.toString()));

    }, [id]);

    return <div className={'p-8'}>
        <ListingEditComponent stay={stay}/>
    </div>
}