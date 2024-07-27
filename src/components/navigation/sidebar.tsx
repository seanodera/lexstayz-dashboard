'use client'

import {usePathname} from "next/navigation";
import React from "react";
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
    LogoutOutlined, WalletOutlined
} from '@ant-design/icons';
import LogoIcon from "@/components/LogoIcon";
import {signOut} from "firebase/auth";
import {auth} from "@/lib/firebase";

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
    return <Layout.Sider className={'h-full flex flex-col justify-between flex-1 sticky left-0 top-64'} collapsible theme={'dark'} collapsed={collapsed} onCollapse={(value: boolean) => {setCollapsed(value)}}>
        <div><Link href={'/'} className={`flex items-center gap-2 px-2 py-2 text-white ${collapsed && 'justify-center'}`}>
            <div className={`p-1 h-12 aspect-square bg-white bg-opacity-10 rounded-lg`}><LogoIcon className={'fill-primary'}/></div>
            <div className={`font-semibold text-lg  ${collapsed? 'hidden':''}`}>LexStayz</div>
        </Link>
            <Menu theme="dark" mode="inline" selectedKeys={[pathname.split('/')[1]]} items={
                menuItems.map(item => renderMenuItem(item))
            }>
            </Menu></div>
        <Menu className={'mt-auto align-bottom'} theme={'dark'} mode="inline" items={
            [{
                key: '',
                icon:<LogoutOutlined />,
                label: <span onClick={(e) => signOut(auth)}>Logout</span>
            }]
        }></Menu>
    </Layout.Sider>
}
export {menuItems};