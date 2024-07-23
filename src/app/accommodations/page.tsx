'use client'
import {Button} from "antd";
import {PlusCircleOutlined} from "@ant-design/icons";
import {useAppSelector} from "@/hooks/hooks";
import {selectAllStays} from "@/slices/bookingSlice";
import ListingItem from "@/components/accomodations/ListingItem";
import {useState} from "react";
import CreateDialog from "@/components/accomodations/createDialog";

export default function ListingsPage() {
    const stays = useAppSelector(selectAllStays)
    const [isModalOpen, setIsModalOpen] = useState(false)
    return <div className={'pt-4 pb-10 px-10'}>
        <div className={'flex justify-between items-center my-2'}>
            <h1 className={'text-2xl font-bold'}>Your Accommodations</h1>
            <Button onClick={() => setIsModalOpen(true)} type={'primary'} size={'large'} icon={<PlusCircleOutlined/>}>Create
                new</Button>
        </div>
        <div className={'grid grid-cols-4 gap-8'}>
            {stays?.map((item: any, index: number) => <ListingItem key={index} stay={item}/>)}
        </div>
        <div>
            <hr/>
            <h3 className={'text-2xl font-bold'}>Drafts</h3>
        </div>
        <CreateDialog isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}/>
    </div>
}