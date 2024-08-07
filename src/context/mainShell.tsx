'use client'
import { useEffect, useState } from "react";
import {Layout } from "antd";
import Sidebar from "@/components/navigation/sidebar";
import Navbar from "@/components/navigation/navbar";
import {
    fetchBookingsAsync,
    selectErrorMessage,
    selectHasError, selectIsBookingLoading,
    setBalance, setWithdraw
} from "@/slices/bookingSlice";
import { getRandomInt } from "@/lib/utils";
import withdrawData from "@/data/withdrawData";
import { auth } from "@/lib/firebase";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { selectIsAuthenticated } from "@/slices/authenticationSlice";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/LoadingScreen";
import {fetchStaysAsync, selectHasRun, selectIsLoading} from "@/slices/staySlice";
import {fetchUserChatsAsync} from "@/slices/messagingSlice";

const { Content } = Layout;

export default function MainAppShell({ children }: { children: React.ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);
    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const isLoading = useAppSelector(selectIsLoading);
    const isBookingLoading = useAppSelector(selectIsBookingLoading)
    const hasError = useAppSelector(selectHasError);
    const errorMessage = useAppSelector(selectErrorMessage);
    const isMessagesLoading = useAppSelector(selectIsBookingLoading);
    const hasRun = useAppSelector(selectHasRun);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            if (!hasRun) {
                console.log('Function is running and hasRun: ', hasRun)
                // @ts-ignore
                dispatch(fetchStaysAsync());

                // @ts-ignore
                dispatch(fetchBookingsAsync({page: 1, limit: 10}));

                // @ts-ignore
                dispatch(fetchUserChatsAsync())

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

        }

      });



    if (isLoading || isBookingLoading || isMessagesLoading) {
        return <div><LoadingScreen/></div>;
    }

    if (hasError) {
        return <div>Error: {errorMessage}</div>;
    }

    return (
        <Layout hasSider className="h-screen">
            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
            <Layout className="flex flex-col h-full">
                <Navbar />
                <Layout className="flex-1 overflow-y-auto">
                    <Content className="flex-1">
                        {children}
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
}
