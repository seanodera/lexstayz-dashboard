'use client'
import { useEffect, useState } from "react";
import { Layout } from "antd";
import Sidebar from "@/components/navigation/sidebar";
import Navbar from "@/components/navigation/navbar";
import {
    fetchStaysAsync, resetHasRun, selectErrorMessage,
    selectHasError, selectHasRun, selectIsLoading,
    setBalance, setBookings, setWithdraw
} from "@/slices/bookingSlice";
import { getRandomInt } from "@/lib/utils";
import withdrawData from "@/data/withdrawData";
import { auth } from "@/lib/firebase";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { selectIsAuthenticated } from "@/slices/authenticationSlice";
import { useRouter } from "next/navigation";
import { authRoutes } from "@/context/contextProvider";
import LoadingScreen from "@/components/LoadingScreen";

const { Content } = Layout;

export default function MainAppShell({ children }: { children: React.ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);
    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const isLoading = useAppSelector(selectIsLoading);
    const hasError = useAppSelector(selectHasError);
    const errorMessage = useAppSelector(selectErrorMessage);
    const hasRun = useAppSelector(selectHasRun);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            if (!hasRun) {
                console.log('Actual Fetch Data', hasRun);
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

        if (user) {
            fetchData();
            console.log("Fetching data", hasRun);
        } else {
            console.log("Redirecting to login", hasRun);
            router.push('/login');
        }

        return () => {
            // if (hasRun) {
            //     dispatch(resetHasRun());
            // }
        };
    }, [hasRun, dispatch, router]);

    if (isLoading) {
        return <div><LoadingScreen/></div>;
    }

    if (hasError) {
        return <div>Error: {errorMessage}</div>;
    }

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
