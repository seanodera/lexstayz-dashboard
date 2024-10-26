'use client'
import { Button } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useAppSelector } from "@/hooks/hooks";
import { selectAllStays } from "@/slices/staySlice";
import ListingItem from "@/components/accomodations/ListingItem";
import {useEffect, useState} from "react";
import CreateDialog from "@/components/accomodations/createDialog";
import {useTour} from "@/context/tourContext";
import {selectCurrentUser} from "@/slices/authenticationSlice";

export default function ListingsPage() {
    const stays = useAppSelector(selectAllStays);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const publishedStays = stays.filter((item: any) => item.published);
    const draftStays = stays.filter((item: any) => !item.published);
    const {openAccommodationsTour,isMainOpen,isAccommodationsOpen} = useTour()
    const user = useAppSelector(selectCurrentUser)
    useEffect(() => {
        if (stays.length !== 0 && !isMainOpen && isAccommodationsOpen && !user?.onboarded?.includes('accommodations')) {
            openAccommodationsTour()
        }
    }, []);
    return (
        <div className='pt-4 pb-10 px-4 md:px-10'>
            <div id={'tour-published-accommodations'} className='flex flex-col md:flex-row justify-between items-center my-2'>
                <h1 className='text-2xl font-bold'>Your Accommodations</h1>
                <Button
                    className='mt-4 md:mt-0'
                    onClick={() => setIsModalOpen(true)}
                    type='primary'
                    size='large'
                    icon={<PlusCircleOutlined />}
                    id={'tour-create-stay'}

                >
                    {'Create new'}
                </Button>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8'>
                {publishedStays.map((item: any, index: number) => (
                    <ListingItem
                        key={index}
                        stay={item}
                        id={index === 0 ? 'tour-accommodation-component' : undefined}
                    />
                ))}
            </div>
            <div id={'tour-draft-accommodations'} className='mt-8'>
                <hr />
                <h3 className='text-xl md:text-2xl font-bold mt-4'>Drafts</h3>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8'>
                    {draftStays.map((item: any, index: number) => (
                        <ListingItem
                            key={index}
                            stay={item}
                            id={publishedStays.length === 0 && index === 0 ? 'tour-accommodation-component' : undefined}
                        />
                    ))}
                </div>
            </div>
            <CreateDialog isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
        </div>
    );
}
