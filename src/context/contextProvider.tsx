'use client'
import {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "@/hooks/hooks";
import hotelsData from "@/data/hotelsData";
import {setAllStays, setBalance, setBookings, setCurrentStayFromId, setWithdraw} from "@/slices/bookingSlice";
import 'antd/dist/reset.css';
import {Layout, theme} from 'antd';
import Navbar from "@/components/navigation/navbar";
import Sidebar from "@/components/navigation/sidebar";
import bookingsData from "@/data/bookingsData";
import withdrawData from "@/data/withdrawData";
import {getRandomInt} from "@/lib/utils";
import {usePathname, useRouter} from "next/navigation";
import {loginUser, logoutUser, selectIsAuthenticated} from "@/slices/authenticationSlice";
import {browserSessionPersistence, getAuth, onAuthStateChanged, setPersistence} from "firebase/auth";
import {getUserDetails} from "@/data/usersData";
import {auth} from "@/lib/firebase";


const {Header, Sider, Content} = Layout;


export default function ContextProvider({children}: { children: React.ReactNode }) {
    const pathname = usePathname()
    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const router = useRouter();
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: {colorBgContainer, borderRadiusLG},
    } = theme.useToken();

    useEffect(() => {
        setPersistence(auth, browserSessionPersistence).then(() => {
            onAuthStateChanged(auth,(user) =>{
                if (user){
                     getUserDetails(user.uid).then((userDetails) =>{
                         dispatch(loginUser(userDetails));
                     });
                     router.push('/')
                } else {
                    dispatch(logoutUser({}))
                    router.push('/login');
                }
            })
        })

        let isAuthRoute = pathname === '/login' || pathname === '/register';

        if (isAuthenticated) {
            const stays = hotelsData;
            dispatch(setAllStays(stays));
            dispatch(setCurrentStayFromId(0))
            dispatch(setBookings(bookingsData({stay: stays[ 0 ]})))
            dispatch(setBalance({
                available: getRandomInt({max: 100000, min: 10000}),
                pending: getRandomInt({max: 10000, min: 1000}),
            }))
            dispatch(setWithdraw(withdrawData()))
        } else {
            if (!isAuthRoute) {
                router.push('/login')
            }
        }
    }, [isAuthenticated])
    if (pathname === '/login' || pathname === '/register') {

        return <div>{children}</div>
    } else {
        return <Layout hasSider className={'h-screen'} style={{height: '100vh'}}>
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
}