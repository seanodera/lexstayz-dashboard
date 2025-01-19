'use client'

import {usePathname} from "next/navigation";
import React from "react";
import Link from "next/link";
import {Avatar, Button, Layout, Menu} from "antd";
import {
    DashboardOutlined,
    BookOutlined,
    UserOutlined,
    HomeOutlined,
    BarChartOutlined,
    QuestionCircleOutlined,
    WalletOutlined, MessageOutlined, PlusOutlined
} from '@ant-design/icons';
import LogoIcon from "@/components/LogoIcon";
import {useAppSelector} from "@/hooks/hooks";
import {selectCurrentUser} from "@/slices/authenticationSlice";
import {Input} from "@headlessui/react";
import {MdCampaign} from "react-icons/md";


const menuItems = [
    {
        key: "dashboard",
        icon: <DashboardOutlined />,
        label: "Dashboard",
        href: "/",
        id: "tour-dashboard", // Add id for Tour Target
    },
    {
        key: "accommodations",
        icon: <HomeOutlined />,
        label: "Accommodations",
        href: "/accommodations",
        id: "tour-accommodations", // Add id for Tour Target
    },
    {
        key: "reservations",
        icon: <BookOutlined />,
        label: "Reservations",
        href: "/reservations"
    },
    // {
    //     key: "promotions",
    //     icon: <MdCampaign/>,
    //     label: "Promotions",
    //     href: "/promotions",
    // },
    {
        key: "cashier",
        icon: <WalletOutlined />,
        label: "Cashier",
        href: "/cashier"
    },
    {
        key: 'messages',
        icon: <MessageOutlined />,
        label: "Messages",
        href: "/messages"
    }
];

const renderMenuItem = (item: any) => (
    {
        key: item.key,
        icon: item.icon,
        label: <Link id={item.id} href={item.href}>{item.label}</Link> ,
    }
);


export default function Sidebar({collapsed, setCollapsed}: {collapsed: boolean, setCollapsed: any}) {
    const pathname = usePathname();
    const currentUser = useAppSelector(selectCurrentUser);
    return <Layout.Sider className={`h-screen flex flex-col flex-1  max-md:hidden z-10`} breakpoint={'md'} collapsible theme={'dark'} collapsed={collapsed} onCollapse={(value: boolean) => {setCollapsed(value)}}>
        <div className={'flex flex-col justify-between h-screen pb-8  w-full'}>
            <div className={' w-full'}>
                <Link href={'/'}
                      className={`flex items-center text-white gap-2 px-2 py-2 ${collapsed && 'justify-center'}`}>
                    <div className={`p-1 h-12 aspect-square bg-white bg-opacity-10 rounded-lg`}><img src={'/logo/lexstayz-logo-transparent-square.png'}
                        className={'fill-primary object-contain aspect-square h-full w-full'}/></div>
                    <div className={`font-semibold text-lg  ${collapsed ? 'hidden' : ''}`}>LexStayz</div>
                </Link>

                {/*<div className={'mx-2 mb-4'}>*/}
                {/*    <Input className={`rounded-lg w-full border-0 bg-gray-300 bg-opacity-40 placeholder-white  ${collapsed && 'hidden'}`} placeholder={'Enter ID'}/>*/}
                {/*</div>*/}
                <Menu theme="dark" className={'flex flex-col h-full flex-1'} mode="inline"
                      selectedKeys={[pathname.split('/')[ 1 ]]} items={
                    menuItems.map(item => renderMenuItem(item))
                }>
                </Menu>
            </div>

            <div className={` ${!collapsed && 'w-full'} mb-6`}>
                <Link href={'/accommodations/create'}
                    className={`m-2  flex flex-col justify-center items-center rounded-lg group hover:border-primary hover:border-solid ${!collapsed && 'aspect-video bg-[#f5f5f5] bg-opacity-40'} gap-3`}>
                    <Button type={'primary'} icon={ <PlusOutlined/>} shape={'circle'}/>
                    <div className={`text-white text-sm ${collapsed && 'hidden'}`}>Create Stay</div>
                </Link>
                <div className={'flex text-current gap-1 items-center mt-6 justify-center'}>
                    <Avatar shape="circle" className="bg-primary capitalize " >
                        {currentUser?.accountType === 'Individual' ? `${currentUser?.firstName.charAt(0).toUpperCase()}${currentUser?.lastName.charAt(0).toUpperCase()}` : currentUser?.companyName?.charAt(0)}
                    </Avatar>
                    <div className={`${collapsed && 'hidden'}`}>
                        <h4 className={'mb-0 text-sm font-medium'}>{currentUser?.firstName} {currentUser?.lastName}</h4>
                        <span className={'text-gray-500 text-xs'}>{currentUser?.email}</span>
                    </div>
                </div>
            </div>
        </div>
    </Layout.Sider>
}
export {menuItems};
