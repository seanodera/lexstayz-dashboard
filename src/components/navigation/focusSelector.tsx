import {DownOutlined, SmileOutlined} from '@ant-design/icons';
import {MenuProps, theme} from 'antd';
import {Dropdown, Space} from 'antd';
import React, {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "@/hooks/hooks";
import {selectAllStays, selectCurrentStay, setCurrentStayFromId} from "@/slices/bookingSlice";

const {useToken} = theme;


export default function FocusSelector() {
    const stays = useAppSelector(selectAllStays);
    const currentStay = useAppSelector(selectCurrentStay);
    let dispatch = useAppDispatch();
    const [items, setItems] = useState<MenuProps['items']>([])
    useEffect(() => {
        let list: MenuProps['items'] = []

        stays.forEach((item: any, index: number) => list.push({
            key: index,
            label: (<div onClick={() => dispatch(setCurrentStayFromId(index))} className={'bg-primary-50 border-2 border-black rounded-xl'}>
                <div className={'flex gap-1 text-dark px-2 py-2 items-center'}>
                    <div
                        className={'aspect-square bg-primary bg-opacity-50 flex justify-center items-center h-full p-3 rounded-lg'}>
                        {item.name.split(' ').slice(1).map((value: string, index: number) => value.charAt(0).toUpperCase())}
                    </div>
                    <div>
                        <div className={'font-medium'}>{item.name}</div>
                        <div className={'text-gray-500 text-sm'}>{item.location.city}, {item.location.country}</div>
                    </div>
                </div>
            </div>)
        }))
        setItems(list)
    }, [stays]);
    console.log(currentStay, stays)
    return (
        <Dropdown className={'flex'} menu={{items}} placement={'bottom'}>
            <div className={'bg-primary-50 border border-solid border-gray-300 rounded-xl'}>
                <div className={'flex gap-1 text-dark px-2 py-2 items-center'}>
                    <div
                        className={'aspect-square bg-primary bg-opacity-50 flex justify-center items-center w-max p-3 rounded-lg'}>
                        {currentStay.name?.split(' ').slice(1).map((value: string, index: number) => value.charAt(0).toUpperCase())}
                    </div>
                    <div>
                        <div className={'font-medium py-0'}>{currentStay.name}</div>
                        <div className={'text-gray-500 text-xs font-medium'}>{currentStay.location?.city}</div>
                        {/*<div className={'text-gray-500 text-xs'}>{currentStay.location?.country}</div>*/}
                    </div>
                </div>
            </div>
        </Dropdown>
    );


}