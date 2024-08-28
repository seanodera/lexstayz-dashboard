'use client'
import {Avatar, Button, Drawer, Menu} from "antd";
import Link from "next/link";
import {Input} from "@headlessui/react";
import {PlusOutlined} from "@ant-design/icons";
import React from "react";
import {menuItems} from "@/components/navigation/sidebar";
import {usePathname} from "next/navigation";
import {useAppSelector} from "@/hooks/hooks";
import {selectCurrentUser} from "@/slices/authenticationSlice";
import FocusSelector from "@/components/navigation/focusSelector";


export default function NavDrawer({show, setShow}: {show: boolean, setShow: any}) {
    const pathname = usePathname();
    const currentUser = useAppSelector(selectCurrentUser);
    const collapsed = false;
    const renderMenuItem = (item: any) => (
        {
            key: item.key,
            icon: item.icon,
            label: <Link href={item.href}>{item.label}</Link> ,
        }
    );

    return <Drawer title={<Link href={'/'}
                                className={`flex items-center text-dark gap-2 ${collapsed && 'justify-center'}`}>
        <div className={`p-1 h-12 bg-white bg-opacity-10 rounded-lg`}><img src={'/logo/lexstayz-logo-transparent-square.png'}
                                                                                         className={'fill-primary object-contain h-full w-full'}/></div>
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

                {/*<div className={'flex text-current gap-1 items-center mt-6 justify-center'}>*/}
                {/*    <Avatar shape="circle" className="bg-primary capitalize ">*/}
                {/*        {currentUser?.accountType === 'Individual' ? `${currentUser?.firstName.charAt(0).toUpperCase()}${currentUser?.lastName.charAt(0).toUpperCase()}` : currentUser?.companyName.charAt(0)}*/}
                {/*    </Avatar>*/}
                {/*    <div className={`${collapsed && 'hidden'}`}>*/}
                {/*        <h4 className={'mb-0 text-sm font-medium'}>{currentUser?.firstName} {currentUser?.lastName}</h4>*/}
                {/*        <span className={'text-gray-500 text-xs'}>{currentUser?.email}</span>*/}
                {/*    </div>*/}
                {/*</div>*/}
            </div>
        </div>
    </Drawer>
}