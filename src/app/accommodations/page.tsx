'use client'
import {Button} from "antd";
import {PlusCircleOutlined} from "@ant-design/icons";
import {useAppSelector} from "@/hooks/hooks";
import {selectAllStays} from "@/slices/staySlice";
import ListingItem from "@/components/accomodations/ListingItem";
import {useEffect, useState} from "react";
import CreateDialog from "@/components/accomodations/createDialog";
import {getStaysFirebase} from "@/data/hotelsData";

export default function ListingsPage() {
    const stays = useAppSelector(selectAllStays)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [firebaseStays, setFirebaseStays] = useState<Array<any>>([])
    // useEffect(()=>{
    //     async function getData(){
    //         const data = await getStaysFirebase();
    //         if (data){
    //             setFirebaseStays(data);
    //         }
    //     }
    //    if(firebaseStays.length === 0){
    //        getData()
    //    }
    // })
    return <div className={'pt-4 pb-10 px-10'}>
        <div className={'flex justify-between items-center my-2'}>
            <h1 className={'text-2xl font-bold'}>Your Accommodations</h1>
            <Button onClick={() => setIsModalOpen(true)} type={'primary'} size={'large'} icon={<PlusCircleOutlined/>}>Create new</Button>
        </div>
        <div className={'grid grid-cols-4 gap-8'}>
            {stays.filter((item: any, index: number) => item.published === true).map((item: any, index: number) => <ListingItem key={index} stay={item}/>)}
        </div>
        <div className={'mt-8'}>
            <hr/>
            <h3 className={'text-2xl font-bold'}>Drafts</h3>
            <div className={'grid grid-cols-4 gap-8'}>
                {stays.filter((item: any, index: number) => item.published === false).map((item: any, index: number) => <ListingItem key={index} stay={item}/>)}
            </div>
        </div>
        <CreateDialog isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}/>
    </div>
}