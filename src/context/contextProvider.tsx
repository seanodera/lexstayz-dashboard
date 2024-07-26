'use client'
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { setAllStays, setBalance, setBookings, setCurrentStayFromId, setWithdraw, fetchStaysAsync, resetHasRun, selectHasRun, selectIsLoading, selectHasError, selectErrorMessage } from "@/slices/bookingSlice";
import 'antd/dist/reset.css';
import { Layout, theme, message } from 'antd';
import Navbar from "@/components/navigation/navbar";
import Sidebar from "@/components/navigation/sidebar";
import { getRandomInt } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { loginUser, logoutUser, selectIsAuthenticated } from "@/slices/authenticationSlice";
import { browserLocalPersistence, onAuthStateChanged, setPersistence } from "firebase/auth";
import { getUserDetails } from "@/data/usersData";
import { auth } from "@/lib/firebase";
import withdrawData from "@/data/withdrawData";
import LoadingScreen from "@/components/LoadingScreen";

const { Header, Sider, Content } = Layout;

export default function ContextProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const isLoading = useAppSelector(selectIsLoading);
    const hasError = useAppSelector(selectHasError);
    const errorMessage = useAppSelector(selectErrorMessage);
    const hasRun = useAppSelector(selectHasRun);
    const router = useRouter();
    const [collapsed, setCollapsed] = useState(false);
    const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];
    useEffect(() => {
        const isAuthRoute = authRoutes.includes(pathname);
        const initializeAuth = async () => {
            await setPersistence(auth, browserLocalPersistence);
            onAuthStateChanged(auth, async (user) => {
                if (user) {
                    const userDetails = await getUserDetails(user.uid);
                    dispatch(loginUser(userDetails));
                    // router.push('/');
                } else {
                    dispatch(logoutUser({}));
                    if (!isAuthRoute){
                        router.push('/login');
                    }
                }
            });
        };
        initializeAuth();



        const fetchData = async () => {
            if (!hasRun) {


                // @ts-ignore
                dispatch(fetchStaysAsync());
                dispatch(setBookings([]));
                dispatch(setBalance({
                    available: getRandomInt({ max: 100000, min: 10000 }),
                    pending: getRandomInt({ max: 10000, min: 1000 }),
                }));
                dispatch(setWithdraw(withdrawData()));
            }
        };
        const user = auth.currentUser;
         if (!isAuthRoute) {
             if (user) {
                 fetchData();
             } else{
            router.push('/login');
             }
        }

        return () => {
            if (hasRun) {
                dispatch(resetHasRun());
            }
        };
    }, [dispatch, hasRun, isAuthenticated, pathname, router]);

    useEffect(() => {
        if (hasError) {
            message.error(errorMessage);
        }
    }, [hasError, errorMessage]);

    if (authRoutes.includes(pathname)) {
        return <div>{children}</div>;
    } else if (isLoading){
        return <div className={'h-screen w-screen'}>
            <LoadingScreen/>
        </div>;
    } else {
        return (
            <Layout hasSider className="h-screen" style={{ height: '100vh' }}>
                <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
                <Layout className="h-full">
                    <Navbar />
                    <Layout className="overscroll-contain overflow-y-scroll h-full">
                        <Content>
                            {children}
                        </Content>
                    </Layout>
                </Layout>
            </Layout>
        );
    }
}
