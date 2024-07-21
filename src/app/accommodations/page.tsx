'use client'
import {Button, Card} from "antd";
import {PlusCircleOutlined} from "@ant-design/icons";
import {useAppSelector} from "@/hooks/hooks";
import {selectAllStays} from "@/slices/bookingSlice";
import ListingItem from "@/components/accomodations/ListingItem";

export default function ListingsPage(){
    const stays = useAppSelector(selectAllStays)
    return <div className={'px-4 py-4'}>
        <div className={'flex justify-between items-center my-2'}>
            <h1 className={'text-2xl font-semibold'}>Your Accommodations</h1>
            <Button type={'primary'} size={'large'} icon={<PlusCircleOutlined/>}>Create new</Button>
        </div>
        <div className={'grid grid-cols-4 gap-8'}>
            {stays?.map((item: any, index: number) => <ListingItem key={index} stay={item}/>)}
        </div>
    </div>
}