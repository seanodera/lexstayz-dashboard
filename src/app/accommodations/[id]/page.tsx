'use client';
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "antd";
import ListingDescription from "@/components/accomodations/ListingDescription";
import RoomComponent from "@/components/accomodations/roomComponent";
import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from "@ant-design/icons";
import Link from "next/link";
import { MdOutlinePublish } from "react-icons/md";
import { getTag } from "@/components/common";
import {
    deleteStayAsync,
    publishStayAsync,
    selectCurrentStay,
    setCurrentStayFromId,
    unPublishStayAsync
} from "@/slices/staySlice";

export default function Page() {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const stay = useAppSelector(selectCurrentStay);

    useEffect(() => {
        if (!stay || id && id !== stay.id) {
            dispatch(setCurrentStayFromId(id.toString()));
        }
    }, [dispatch, id, stay]);

    console.log(stay);
    if (!stay || stay.id === undefined) {
        return <div></div>;
    } else {
        return (
            <div className="pt-4 pb-10 px-4 sm:px-6 md:px-8 lg:px-10">
                <div className="flex flex-col lg:flex-row lg:justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <h1 className="font-bold text-xl sm:text-2xl lg:text-3xl">{stay.name}</h1>
                        <span>{!stay.published ? getTag('Draft') : getTag('Published')}</span>
                    </div>
                    <div className="mt-4 lg:mt-0">
                        <FunctionButtons stay={stay} />
                    </div>
                </div>
                <ListingDescription stay={stay} />
                {stay.type === 'Hotel' && (
                    <div>
                        <h1 className="font-bold text-lg sm:text-xl md:text-2xl my-4">Rooms</h1>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                            {stay.rooms?.map((item: any, index: number) => (
                                <RoomComponent key={index} room={item} stayId={stay.id} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

function FunctionButtons({ stay }: { stay: any }) {
    const dispatch = useAppDispatch();
    if (stay.published) {
        return (
            <div className="space-y-2 lg:space-y-0 lg:space-x-2 lg:flex lg:items-center">
                <Button onClick={() => dispatch(unPublishStayAsync(stay))} type="primary" danger size="large">
                    UnPublish
                </Button>
            </div>
        );
    } else {
        return (
            <div className="space-y-2 lg:space-y-0 lg:space-x-2 lg:flex lg:items-center">
                <Link href={`/accommodations/${stay.id}/edit`}>
                    <Button type="primary" ghost icon={<EditOutlined />} size="large">
                        Edit
                    </Button>
                </Link>
                {stay.type === 'Hotel' && (
                    <Link href={`/accommodations/${stay.id}/rooms/create`}>
                        <Button type="primary" icon={<PlusCircleOutlined />} size="large">
                            Add Room
                        </Button>
                    </Link>
                )}
                <Button type="primary" danger size="large" icon={<MdOutlinePublish />} onClick={() => dispatch(publishStayAsync(stay))}>
                    Publish
                </Button>
                <Button type="primary" danger size="large" icon={<DeleteOutlined />} onClick={() => dispatch(deleteStayAsync(stay))}>
                    Delete
                </Button>
            </div>
        );
    }
}
