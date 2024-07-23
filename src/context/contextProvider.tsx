'use client'
import {useEffect, useState} from "react";
import {useAppDispatch} from "@/hooks/hooks";
import hotelsData from "@/data/hotelsData";
import {setAllStays, setBalance, setBookings, setCurrentStayFromId, setWithdraw} from "@/slices/bookingSlice";
import 'antd/dist/reset.css';
import {Layout, theme} from 'antd';
import Navbar from "@/components/navigation/navbar";
import Sidebar from "@/components/navigation/sidebar";
import bookingsData from "@/data/bookingsData";
import withdrawData from "@/data/withdrawData";
import {getRandomInt} from "@/lib/utils";


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
        dispatch(setBalance({
            available: getRandomInt({max: 100000, min: 10000}),
            pending: getRandomInt({max: 10000, min: 1000}),
        }))
        dispatch(setWithdraw(withdrawData()))
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