'use client'
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import {
    fetchStaysAsync, resetHasRun, selectErrorMessage,
    selectHasError, selectHasRun, selectIsLoading
} from "@/slices/bookingSlice";
import 'antd/dist/reset.css';
import { Layout, message } from 'antd';
import Navbar from "@/components/navigation/navbar";
import Sidebar from "@/components/navigation/sidebar";
import { usePathname, useRouter } from "next/navigation";
import { loginUser, logoutUser, selectIsAuthenticated } from "@/slices/authenticationSlice";
import {browserLocalPersistence, browserSessionPersistence, onAuthStateChanged, setPersistence} from "firebase/auth";
import { getUserDetails } from "@/data/usersData";
import { auth } from "@/lib/firebase";
import withdrawData from "@/data/withdrawData";
import LoadingScreen from "@/components/LoadingScreen";
import MainAppShell from "@/context/mainShell";

export const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];

export default function ContextProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const isLoading = useAppSelector(selectIsLoading);
    const hasError = useAppSelector(selectHasError);
    const errorMessage = useAppSelector(selectErrorMessage);
    const hasRun = useAppSelector(selectHasRun);
    const router = useRouter();

    useEffect(() => {
        const isAuthRoute = authRoutes.includes(pathname);
        const initializeAuth = async () => {
            await setPersistence(auth, browserSessionPersistence);
            onAuthStateChanged(auth, async (user) => {
                if (user) {
                    const userDetails = await getUserDetails(user.uid);
                    console.log(userDetails);
                    dispatch(loginUser(userDetails));
                } else {
                    if (!isAuthRoute) {
                        dispatch(logoutUser({}));
                        router.push('/login');
                    }
                }
            });
        };
        initializeAuth();
        console.log(isLoading, 'CP')
    }, [pathname, dispatch, router]);

    useEffect(() => {
        if (hasError) {
            message.error(errorMessage);
        }
    }, [hasError, errorMessage]);

    if (isLoading) {
        return <div className="h-screen w-screen">
            <LoadingScreen />
        </div>;
    }

    if (authRoutes.includes(pathname)) {
        return <div>{children}</div>;
    } else {
        return <MainAppShell>{children}</MainAppShell>;
    }
}
