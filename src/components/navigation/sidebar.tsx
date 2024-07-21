'use client'

import {usePathname} from "next/navigation";
import React, {SetStateAction, useEffect, useState} from "react";
import Link from "next/link";
import {Layout, Menu} from "antd";
import {
    DashboardOutlined,
    BookOutlined,
    UserOutlined,
    HomeOutlined,
    BarChartOutlined,
    SettingOutlined,
    QuestionCircleOutlined,
    LogoutOutlined
} from '@ant-design/icons';
import {MdOutlineLocalHotel} from "react-icons/md";
import LogoIcon from "@/components/LogoIcon";

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
        key: "guests",
        icon: <UserOutlined />,
        label: "Guests",
        href: "/guests"
    },
    {
        key: "reports",
        icon: <BarChartOutlined />,
        label: "Reports",
        href: "/reports"
    },
    {
        key: "settings",
        icon: <SettingOutlined />,
        label: "Settings",
        href: "/settings"
    },
    {
        key: "help",
        icon: <QuestionCircleOutlined />,
        label: "Help",
        href: "/help"
    },
    {
        key: "logout",
        icon: <LogoutOutlined />,
        label: "Logout",
        href: "/logout"
    }
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


    console.log(pathname.split('/'));
    return <Layout.Sider className={'h-full sticky left-0 top-64'} collapsible theme={'dark'} collapsed={collapsed} onCollapse={(value: boolean) => {setCollapsed(value)}}>
        <Link href={'/'} className={`flex items-center gap-2 px-2 py-2 ${collapsed && 'justify-center'}`}>
            <div className={`p-1 h-12 aspect-square bg-white bg-opacity-10 rounded-lg`}><LogoIcon className={'fill-primary'}/></div>
            <div className={`font-semibold text-lg ${collapsed? 'hidden':''}`}>LexStayz</div>
        </Link>
        <Menu theme="dark" mode="inline" selectedKeys={[pathname.split('/')[1]]} defaultSelectedKeys={['dashboard']} items={
            menuItems.map(item => renderMenuItem(item))
        }>

        </Menu>
    </Layout.Sider>
}
export {menuItems};