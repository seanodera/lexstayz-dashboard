import { Avatar, MenuProps, theme, Dropdown } from 'antd';
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { selectAllStays, selectCurrentStay, setCurrentStayFromId, setCurrentStay } from "@/slices/bookingSlice";
import { BsChevronDown } from "react-icons/bs";

const { useToken } = theme;

export default function FocusSelector() {
    const stays = useAppSelector(selectAllStays);
    const currentStay = useAppSelector(selectCurrentStay);
    const dispatch = useAppDispatch();
    const [items, setItems] = useState<MenuProps['items']>([]);

    useEffect(() => {
        const list: MenuProps['items'] = [
            {
                key: 'all',
                label: (
                    <div onClick={() => dispatch(setCurrentStay({}))} className="bg-primary-50 border-2 border-black rounded-xl">
                        <div className="flex gap-1 text-dark px-2 py-2 items-center">
                            <Avatar shape="square" className="bg-primary">A</Avatar>
                            <div>
                                <div className="font-medium">All Stays</div>
                            </div>
                        </div>
                    </div>
                ),
            },
            ...stays.map((item: any) => ({
                key: item.id,
                label: (
                    <div onClick={() => dispatch(setCurrentStayFromId(item.id))} className="bg-primary-50 border-2 border-black rounded-xl">
                        <div className="flex gap-1 text-dark px-2 py-2 items-center">
                            <Avatar shape="square" className="bg-primary">
                                {item.name.split(' ').slice(1).map((value:any) => value.charAt(0).toUpperCase())}
                            </Avatar>
                            <div>
                                <div className="font-medium">{item.name}</div>
                                <div className="text-gray-500 text-sm">{item.location.district}, {item.location.country}</div>
                            </div>
                        </div>
                    </div>
                ),
            })),
        ];
        setItems(list);
    }, [dispatch, stays]);

    return (
        <Dropdown menu={{ items }} placement="bottom">
            <div className="flex gap-1 text-dark px-2 py-2 items-center">
                <Avatar shape="square" className="bg-primary">
                    {currentStay?.name ? currentStay.name.split(' ').slice(1).map((value:any) => value.charAt(0).toUpperCase()) : 'A'}
                </Avatar>
                <div>
                    <div className="font-medium py-0">{currentStay?.name || 'All Stays'}</div>
                    <div className="text-gray-500 text-xs font-medium">{currentStay?.location?.district || ''}</div>
                </div>
                <span className="text-end ms-2"><BsChevronDown /></span>
            </div>
        </Dropdown>
    );
}
