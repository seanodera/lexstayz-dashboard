'use client'
import { useParams, usePathname } from "next/navigation";
import { Button } from "antd";
import { EditOutlined, PlusCircleOutlined } from "@ant-design/icons";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { selectCurrentStay, setCurrentStayFromId } from "@/slices/staySlice";
import RoomDescription from "@/components/accomodations/RoomDescription";
import Link from "next/link";
import {Hotel} from "@/lib/types";

export default function Page() {
    const pathname = usePathname();
    const { id, roomId } = useParams();
    const dispatch = useAppDispatch();
    const stay = useAppSelector(selectCurrentStay);

    useEffect(() => {
        if (!stay || (id && id !== stay.id)) {
            dispatch(setCurrentStayFromId(id.toString()));
        }
    }, [id, stay, dispatch]);

    if (!stay || stay.id === undefined) {
        return <div>Loading...</div>; // Added a loading state
    } else {
        return (
            <div className="px-4 pt-4 md:px-10">
                <div className="flex flex-col md:flex-row justify-between mb-4 items-center">
                    <div>
                        <h3 className="text-gray-500 font-bold mb-1 text-lg md:text-xl">{stay.name}</h3>
                        <h1 className="font-bold capitalize my-0 text-xl md:text-2xl">
                            {(stay as Hotel).rooms.find((value: any) => value.id === roomId)?.name}
                        </h1>
                    </div>
                    <div className="mt-4 md:mt-0 flex gap-2">
                        <Link href={`${pathname}/edit`}>
                            <Button type="primary" ghost icon={<EditOutlined />} size="large">
                                Edit
                            </Button>
                        </Link>
                        <Link href={`/accommodations/${stay.id}/rooms/create`}>
                            <Button type="primary" icon={<PlusCircleOutlined />} size="large">
                                Add Room
                            </Button>
                        </Link>
                    </div>
                </div>
                <RoomDescription room={(stay as Hotel).rooms.find((value: any) => value.id === roomId.toString())} />
            </div>
        );
    }
}
