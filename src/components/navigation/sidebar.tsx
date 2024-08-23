'use client'

import {usePathname} from "next/navigation";
import React from "react";
import Link from "next/link";
import {Avatar, Layout, Menu} from "antd";
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

const menuItems = [
    {
        key: "",
        icon: <DashboardOutlined />,
        label: "Dashboard",
        href: "/"
    },
    {
        key: "accommodations",
        icon: <HomeOutlined />,
        label: "Accommodations",
        href: "/accommodations"
    },
    {
        key: "reservations",
        icon: <BookOutlined />,
        label: "Reservations",
        href: "/reservations"
    },
    {
        key: "Cashier",
        icon: <WalletOutlined />,
        label: "Cashier",
        href: "/cashier"
    },
    {
        key: 'messages',
        icon: <MessageOutlined />,
        label: "Messages",
        href: "/messages"
    },
    // {
    //     key: "guests",
    //     icon: <UserOutlined />,
    //     label: "Guests",
    //     href: "/guests"
    // },
    // {
    //     key: "reports",
    //     icon: <BarChartOutlined />,
    //     label: "Reports",
    //     href: "/reports"
    // },
    // {
    //     key: "help",
    //     icon: <QuestionCircleOutlined />,
    //     label: "Help",
    //     href: "/help"
    // },
];
const renderMenuItem = (item: any) => (
    {
        key: item.key,
        icon: item.icon,
        label: <Link href={item.href}>{item.label}</Link> ,
    }
);


export default function Sidebar({collapsed, setCollapsed}: {collapsed: boolean, setCollapsed: any}) {
    const pathname = usePathname();
    const currentUser = useAppSelector(selectCurrentUser);
    return <Layout.Sider className={'h-screen flex flex-col flex-1 w-full max-w-60 max-md:hidden bg-white z-10'}  theme={'light'} collapsed={collapsed} onCollapse={(value: boolean) => {setCollapsed(value)}}>
        <div className={'flex flex-col justify-between h-screen pb-8  w-full'}>
            <div className={' w-full'}>
                <Link href={'/'}
                      className={`flex items-center gap-2 px-2 py-2 text-dark ${collapsed && 'justify-center'}`}>
                    <div className={`p-1 h-12 aspect-square bg-white bg-opacity-10 rounded-lg`}><LogoIcon
                        className={'fill-primary'}/></div>
                    <div className={`font-semibold text-lg  ${collapsed ? 'hidden' : ''}`}>LexStayz</div>
                </Link>

                <div className={'mx-4 mb-4'}>
                    <Input className={'rounded-lg border-0 bg-gray-200 w-full'} placeholder={'Find Anything by ID'}/>
                </div>
                <Menu theme="light" className={'flex flex-col h-full flex-1'} mode="inline"
                      selectedKeys={[pathname.split('/')[ 1 ]]} items={
                    menuItems.map(item => renderMenuItem(item))
                }>
                </Menu>
            </div>

            <div className={' w-full'}>
                <div
                    className={'m-2 bg-[#f5f5f5] flex flex-col justify-center items-center rounded-lg aspect-video gap-3'}>
                    <div className={'bg-primary text-white p-1 w-min rounded-full text-xl aspect-square text-center'}>
                        <PlusOutlined/>
                    </div>
                    <div className={'text-dark text-sm'}>Create New Accommodation</div>
                </div>
                <div className={'flex text-dark gap-1 items-center mx-2 mt-6'}>
                    <Avatar shape="circle" className="bg-primary capitalize " >
                        {currentUser?.accountType === 'Individual' ? `${currentUser?.firstName.charAt(0).toUpperCase()}${currentUser?.lastName.charAt(0).toUpperCase()}` : currentUser?.companyName.charAt(0)}
                    </Avatar>
                    <div className={''}>
                        <h4 className={'mb-0 text-sm font-medium'}>{currentUser?.firstName} {currentUser?.lastName}</h4>
                        <span className={'text-gray-500 text-xs'}>{currentUser?.email}</span>
                    </div>
                </div>
            </div>
        </div>
    </Layout.Sider>
}
export {menuItems};