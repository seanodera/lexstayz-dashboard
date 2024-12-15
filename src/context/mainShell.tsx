'use client'
import { useEffect, useState } from "react";
import {Layout } from "antd";
import Sidebar from "@/components/navigation/sidebar";
import Navbar from "@/components/navigation/navbar";
import {
    fetchBookingsAsync,
    selectErrorMessage,
    selectHasError, selectIsBookingLoading,
} from "@/slices/bookingSlice";
import { auth } from "@/lib/firebase";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { selectIsAuthenticated } from "@/slices/authenticationSlice";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/LoadingScreen";
import {fetchStaysAsync, selectHasRun, selectIsLoading} from "@/slices/staySlice";
import {fetchUserChatsAsync} from "@/slices/messagingSlice";
import {fetchExchangeRates, fetchPawaPayConfigs, fetchPendingTransactions} from "@/slices/transactionsSlice";
import fetchStatistics from "@/slices/bookingThunks/fetchStatistics";
import {getOngoingFeatures, getPastAdverts, getUpcomingAdverts} from "@/slices/promotionSlice";

const { Content } = Layout;

export default function MainAppShell({ children }: { children: React.ReactNode }) {
    const [collapsed, setCollapsed] = useState(false); // Sidebar collapse state
    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector(selectIsAuthenticated); // Check if user is authenticated
    const isLoading = useAppSelector(selectIsLoading);
    const isBookingLoading = useAppSelector(selectIsBookingLoading);
    const hasError = useAppSelector(selectHasError);
    const errorMessage = useAppSelector(selectErrorMessage);
    const isMessagesLoading = useAppSelector(selectIsBookingLoading);
    const isPromotionsLoading = useAppSelector(state => state.promotion.loading)
    const hasRun = useAppSelector(selectHasRun);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            if (!hasRun) {
                dispatch(fetchStaysAsync());
                dispatch(fetchPendingTransactions());
                dispatch(fetchBookingsAsync({ page: 1, limit: 10 }));
                dispatch(fetchStatistics());
                dispatch(fetchUserChatsAsync());
                dispatch(fetchExchangeRates());
                dispatch(fetchPawaPayConfigs());
                dispatch(getOngoingFeatures())
                dispatch(getUpcomingAdverts())
                dispatch(getPastAdverts())
            }
        };

        const user = auth.currentUser;
        if (user) {
            fetchData(); // Fetch data if the user is authenticated
        }
    }, [dispatch, hasRun]);
    console.log(isLoading , isBookingLoading , isMessagesLoading,isPromotionsLoading)
    if (isLoading || isBookingLoading || isMessagesLoading || isPromotionsLoading) {
        // Show loading screen while data is being fetched
        return <div><LoadingScreen /></div>;
    }

    if (hasError) {
        // Display error message if there's an error
        return <div>Error: {errorMessage}</div>;
    }

    return (
        <Layout hasSider className="h-screen">
            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
            <Layout className="flex flex-col h-full">
                <Navbar />
                <Layout className="flex-1 overflow-y-auto">
                    <Content className="flex-1 overflow-y-scroll">
                        {children}
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
}
