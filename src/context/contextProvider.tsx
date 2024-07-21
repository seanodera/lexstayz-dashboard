'use client'
import {useEffect, useState} from "react";
import {useAppDispatch} from "@/hooks/hooks";
import hotelsData from "@/data/hotelsData";
import {setAllStays, setBookings, setCurrentStayFromId} from "@/slices/bookingSlice";
import 'antd/dist/reset.css';
import {Button, Divider, Layout, Menu, theme, Typography} from 'antd';
import Navbar from "@/components/navigation/navbar";
import Sidebar from "@/components/navigation/sidebar";
import FocusSelector from "@/components/navigation/focusSelector";
import bookingsData from "@/data/bookingsData";

const {Header, Sider, Content} = Layout;


export default function ContextProvider({children}: { children: React.ReactNode }) {
    const dispatch = useAppDispatch();
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: {colorBgContainer, borderRadiusLG},
    } = theme.useToken();

    useEffect(() => {
        const stays = hotelsData;
        dispatch(setAllStays(stays));
        dispatch(setCurrentStayFromId(0))
        dispatch(setBookings(bookingsData({stay: stays[0]})))
    },)
    return <Layout hasSider className={'h-screen'} style={{height:'100vh'}}>
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed}/>
        <Layout className={'h-full'}>
            <Navbar/>
            <Layout className={'overscroll-contain overflow-y-scroll h-full'}>
                <Content className={''}>
                    {children}
                </Content>
            </Layout>
        </Layout>
    </Layout>
}