import {Avatar, MenuProps, theme, Dropdown} from 'antd';
import React, {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "@/hooks/hooks";
import {selectAllStays, selectCurrentStay, setCurrentStayFromId, setCurrentStay} from "@/slices/staySlice";
import {BsChevronDown} from "react-icons/bs";
import {Stay} from "@/lib/types";
import {selectCurrentUser} from "@/slices/authenticationSlice";


export default function FocusSelector() {
    const stays = useAppSelector(selectAllStays);
    const currentStay = useAppSelector(selectCurrentStay);
    const currentUser = useAppSelector(selectCurrentUser);
    const dispatch = useAppDispatch();
    const [items, setItems] = useState<MenuProps['items']>([]);

    useEffect(() => {
        const list: MenuProps['items'] = [
            {
                key: 'all',
                label: (
                    <div onClick={() => dispatch(setCurrentStay({} as Stay))}
                         className="bg-primary-50 border-2 border-black rounded-xl">
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
                    <div onClick={() => dispatch(setCurrentStayFromId(item.id))}
                         className="bg-primary-50 border-2 border-black rounded-xl">
                        <div className="flex gap-1 text-dark px-2 py-2 items-center">
                            <Avatar shape="square" className="bg-primary">
                                {item.name.split(' ').slice(1).map((value: any) => value.charAt(0).toUpperCase())}
                            </Avatar>
                            <div>
                                <div className="font-medium">{item.name}</div>
                                <div
                                    className="text-gray-500 text-sm">{item.location.district}, {item.location.country}</div>
                            </div>
                        </div>
                    </div>
                ),
            })),
        ];
        setItems(list);
    }, [dispatch, stays]);
    console.log(currentUser)
    return (
        <Dropdown menu={{items}} placement="bottom">
            <div className="flex gap-1 text-dark px-2 py-2 items-center">
                <Avatar shape="circle" className="bg-primary">
                    {currentStay?.name ? currentStay.name.split(' ').slice(1).map((value: any) => value.charAt(0).toUpperCase()) : 'A'}
                </Avatar>
                <div>
                    <div
                        className="font-medium">{currentUser?.accountType === 'Individual' ? `${currentUser?.firstName} ${currentUser?.lastName}` : currentUser?.companyName}</div>
                    <div className="py-0 text-gray-500 text-sm">{currentStay?.name || 'All Stays'}</div>
                </div>
                <span className="text-end ms-2"><BsChevronDown/></span>
            </div>
        </Dropdown>
    );
}
