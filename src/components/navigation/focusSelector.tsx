'use client'
import {Avatar, MenuProps, Dropdown} from 'antd';
import React, {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "@/hooks/hooks";
import {selectAllStays, selectCurrentStay, setCurrentStayFromId, setCurrentStay} from "@/slices/staySlice";
import {BsChevronDown} from "react-icons/bs";
import {Home, Hotel, Stay} from "@/lib/types";
import {logoutUser, selectCurrentUser} from "@/slices/authenticationSlice";
import Link from "next/link";
import {signOut} from "firebase/auth";
import {auth} from "@/lib/firebase";
import {router} from "next/client";
import {useRouter} from "next/navigation";


export function FocusSelectorOld({stays, currentStay}:{stays:any, currentStay: any}) {

    const dispatch = useAppDispatch();
    const [items, setItems] = useState<MenuProps['items']>([]);

    useEffect(() => {
        const list: MenuProps['items'] = [
            {
                key: 'all',
                label: (
                    <div onClick={() => dispatch(setCurrentStay({} as (Hotel | Home)))}
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
                            <Avatar shape="square" className="bg-primary" src={item.poster}>
                                {item.name.split(' ').slice(1).map((value: any) => value.charAt(0).toUpperCase())}
                            </Avatar>
                            <div>
                                <div className="font-medium">{item.name}</div>
                                <div
                                    className="text-gray-500 text-sm">{item?.location?.district}, {item?.location?.country}</div>
                            </div>
                        </div>
                    </div>
                ),
            })),
        ];
        setItems(list);
    }, [ stays]);
    return (
        <Dropdown menu={{items}} placement="bottomLeft">
            <div className="flex p-2 w-full justify-between gap-1 text-dark items-center">
                <div>
                    <div className="py-0 text-gray-500 text-sm">{currentStay?.name || 'All Stays'}</div>
                </div>
                <span className="text-end ms-2"><BsChevronDown/></span>
            </div>
        </Dropdown>
    );
}

export default function FocusSelector() {
    const stays = useAppSelector(selectAllStays);
    const currentStay = useAppSelector(selectCurrentStay);
    const currentUser = useAppSelector(selectCurrentUser);
    const dispatch = useAppDispatch();
    const router = useRouter()
    function handleLogout(e:any){
        console.log('Signing out')
        signOut(auth).then(() => {
            dispatch(logoutUser({}))
            router.push('/')
        });

    }

    return <Dropdown menu={{
        items: [
            {
                key: 'stays',
                label: (
                    <div className={'hover:bg-transparent'}><FocusSelectorOld stays={stays} currentStay={currentStay}/></div>
                ),
            },
            {
                type: 'divider',
            },
            {
            key: 'profile',
                label: <Link href={'/profile'}>Profile</Link>
            },
            {
                key: 'logout',
                danger:true,
                label: <div onClick={handleLogout}>Logout</div>,
            }
        ]
    }}>
        <div className="flex max-md:w-full max-md:justify-between gap-1 text-dark px-2 py-2 items-center">
            <div className={'flex gap-2'}>
                <Avatar shape="circle" className="bg-primary capitalize">
                    {currentUser?.accountType === 'Individual'? `${currentUser?.firstName.charAt(0).toUpperCase()}${currentUser?.lastName.charAt(0).toUpperCase()}` : currentUser?.companyName?.charAt(0)}
                </Avatar>
                <div>
                    <div
                        className="font-medium">{currentUser?.accountType === 'Individual' ? `${currentUser?.firstName} ${currentUser?.lastName}` : currentUser?.companyName}</div>
                    <div className="py-0 text-gray-500 text-sm">{currentStay?.name || 'All Stays'}</div>
                </div>
            </div>
            <span className="text-end ms-2"><BsChevronDown/></span>
        </div>
    </Dropdown>
}
