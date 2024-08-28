'use client'
import { Drawer, Menu} from "antd";
import Link from "next/link";
import React, {useEffect} from "react";
import {menuItems} from "@/components/navigation/sidebar";
import {usePathname} from "next/navigation";
import {useAppSelector} from "@/hooks/hooks";
import {selectCurrentUser} from "@/slices/authenticationSlice";
import FocusSelector from "@/components/navigation/focusSelector";
import Image from "next/image";


export default function NavDrawer({show, setShow}: {show: boolean, setShow: any}) {
    const pathname = usePathname();
    useAppSelector(selectCurrentUser);
    const collapsed = false;
    const renderMenuItem = (item: any) => (
        {
            key: item.key,
            icon: item.icon,
            label: <Link href={item.href}>{item.label}</Link> ,
        }
    );

    useEffect(() => {
        setShow(false);
    }, [pathname, setShow]);

    return <Drawer title={<Link href={'/'}
                                className={`flex items-center text-dark gap-2 ${collapsed && 'justify-center'}`}>
        <div className={`p-1 h-12  bg-white bg-opacity-10 rounded-lg`}><Image height={48} width={48} src={'/logo/lexstayz-logo-transparent-square.png'}
                                                                                         className={'fill-primary object-contain h-full w-full'} alt={'logo'}/></div>
        <div className={`font-semibold text-lg  ${collapsed ? 'hidden' : ''}`}>LexStayz</div>
    </Link>} className={'max-w-sm w-full'} open={show} onClose={()=>{setShow(false)}}>
        <div className={'flex flex-col justify-between h-screen pb-8  w-full'}>
            <div className={' w-full'}>

                <FocusSelector/>

                {/*<div className={'mx-2 mb-4'}>*/}
                {/*    <Input*/}
                {/*        className={`rounded-lg w-full border-0 bg-gray-300 bg-opacity-40 placeholder-white  ${collapsed && 'hidden'}`}*/}
                {/*        placeholder={'Enter ID'}/>*/}
                {/*</div>*/}

                <Menu theme="light" className={'border-0 mt-4'} mode="inline"
                      selectedKeys={[pathname.split('/')[ 1 ]]} items={
                    menuItems.map(item => renderMenuItem(item))
                }>
                </Menu>
            </div>

            <div className={` ${!collapsed && 'w-full'} mb-6`}>


            </div>
        </div>
    </Drawer>
}