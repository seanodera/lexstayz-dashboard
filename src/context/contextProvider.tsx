'use client'
import {useEffect, useState} from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import {
    selectErrorMessage,
    selectHasError, selectIsBookingLoading
} from "@/slices/bookingSlice";
import 'antd/dist/reset.css';
import { message } from 'antd';
import { usePathname, useRouter } from "next/navigation";
import {
    getUserDetailsAsync,
    logoutUser,
    selectCurrentUser,
    selectIsAuthLoading
} from "@/slices/authenticationSlice";
import {browserLocalPersistence, onAuthStateChanged, setPersistence} from "firebase/auth";
import { auth } from "@/lib/firebase";
import LoadingScreen from "@/components/LoadingScreen";
import MainAppShell from "@/context/mainShell";
import {selectIsLoading} from "@/slices/staySlice";

export const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password', '/user-information'];

export default function ContextProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const dispatch = useAppDispatch();
    const isLoading = useAppSelector(selectIsLoading);
    const isBookingLoading = useAppSelector(selectIsBookingLoading)
    const isAuthLoading = useAppSelector(selectIsAuthLoading)
    const hasError = useAppSelector(selectHasError);
    const errorMessage = useAppSelector(selectErrorMessage);
    const router = useRouter();
    const [userLoaded, setUserLoaded] = useState(false); // Track if user is loaded
    const currentUser = useAppSelector(selectCurrentUser); // Select current user from state

    useEffect(() => {
        const isAuthRoute = authRoutes.includes(pathname); // Check if current route is an auth-related route

        const initializeAuth = async () => {
            await setPersistence(auth, browserLocalPersistence); // Ensure Firebase persistence

            onAuthStateChanged(auth, async (user) => {
                if (user) {
                    if (!currentUser) {
                        // If Firebase user exists but no user details, fetch them
                        dispatch(getUserDetailsAsync(user.uid)).then((value) => {
                            if (value.meta.requestStatus === 'fulfilled' && !value.payload) {
                                router.push("/user-information"); // Redirect if user details are missing
                            }
                        });
                    }
                    setUserLoaded(true); // Mark user as loaded
                } else {
                    // Redirect to login if no Firebase user and not on an auth route
                    if (!isAuthRoute) {
                        dispatch(logoutUser({}));
                        router.push('/login');
                    }
                    setUserLoaded(false);
                }
            });
        };

        if (!userLoaded) {
            initializeAuth(); // Run auth initialization if user is not yet loaded
        }
    }, [userLoaded, currentUser, pathname, dispatch, router]);

    useEffect(() => {
        if (hasError) {
            message.error(errorMessage); // Display error message if there's an error
        }
    }, [hasError, errorMessage]);

    if ( isLoading || isBookingLoading || isAuthLoading) {
        // Show loading screen while waiting for user details or if any loading is happening
        return <div className="h-screen w-screen"><LoadingScreen /></div>;
    }

    if (authRoutes.includes(pathname)) {
        // Render children directly if on an auth route
        return <div>{children}</div>;
    } else {
        // Otherwise, wrap in the main app shell
        return <MainAppShell>{children}</MainAppShell>;
    }
}
