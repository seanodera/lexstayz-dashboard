import {DownOutlined, SmileOutlined} from '@ant-design/icons';
import {Avatar, MenuProps, theme} from 'antd';
import {Dropdown, Space} from 'antd';
import React, {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "@/hooks/hooks";
import {selectAllStays, selectCurrentStay, setCurrentStayFromId} from "@/slices/bookingSlice";
import {BsChevronDown} from "react-icons/bs";

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
            label: (<div onClick={() => dispatch(setCurrentStayFromId(index))}
                         className={'bg-primary-50 border-2 border-black rounded-xl'}>
                <div className={'flex gap-1 text-dark px-2 py-2 items-center'}>
                    <Avatar shape={'square'}
                            className={' bg-primary '}>
                        {item.name.split(' ').slice(1).map((value: string, index: number) => value.charAt(0).toUpperCase())}
                    </Avatar>
                    <div>
                        <div className={'font-medium'}>{item.name}</div>
                        <div className={'text-gray-500 text-sm'}>{item.location.district}, {item.location.country}</div>
                    </div>
                </div>
            </div>)
        }))
        setItems(list)
    }, [dispatch, stays]);

    return (
        <Dropdown className={''} menu={{items}} placement={'bottom'}>
            <div className={'flex gap-1 text-dark px-2 py-2 items-center'}>
                <Avatar shape={'square'}
                        className={' bg-primary '}>
                    {currentStay?.name?.split(' ').slice(1).map((value: string, index: number) => value.charAt(0).toUpperCase())}
                </Avatar>
                <div>
                    <div className={'font-medium py-0'}>{currentStay?.name}</div>
                    <div className={'text-gray-500 text-xs font-medium'}>{currentStay?.location?.district}</div>
                    {/*<div className={'text-gray-500 text-xs'}>{currentStay.location?.country}</div>*/}
                </div>
                <span className={'text-end ms-2'}><BsChevronDown/></span>
            </div>
        </Dropdown>
    );


}