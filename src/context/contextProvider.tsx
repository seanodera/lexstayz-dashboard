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
import {browserSessionPersistence, onAuthStateChanged, setPersistence} from "firebase/auth";
import { auth } from "@/lib/firebase";
import LoadingScreen from "@/components/LoadingScreen";
import MainAppShell from "@/context/mainShell";
import {selectIsLoading} from "@/slices/staySlice";

export const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];

export default function ContextProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const dispatch = useAppDispatch();
    const isLoading = useAppSelector(selectIsLoading);
    const isBookingLoading = useAppSelector(selectIsBookingLoading)
    const isAuthLoading = useAppSelector(selectIsAuthLoading)
    const hasError = useAppSelector(selectHasError);
    const errorMessage = useAppSelector(selectErrorMessage);
    const router = useRouter();
    const [userLoaded, setUserLoaded] = useState(false);
    const currentUser = useAppSelector(selectCurrentUser);
    useEffect(() => {
        const isAuthRoute = authRoutes.includes(pathname);
        const initializeAuth = async () => {
            await setPersistence(auth, browserSessionPersistence);
            onAuthStateChanged(auth, async (user) => {
                if (user) {
                    if (!currentUser){

                        dispatch(getUserDetailsAsync(user.uid)).then((value) => {

                            if (value.meta.requestStatus === 'fulfilled'){
                                if (!value.payload){
                                    console.log(value)
                                    router.push("/user-information");
                                }
                            }
                        });
                        setUserLoaded(true);
                    }
                } else {

                    if (!isAuthRoute) {
                        console.log('Taking me to login: ContextProvider')
                        setUserLoaded(false);
                        dispatch(logoutUser({}));
                        router.push('/login');
                    }
                }
            });
        };
        if (!userLoaded){
        initializeAuth();
        }
    });

    useEffect(() => {
        if (hasError) {
            message.error(errorMessage);
        }
    }, [hasError, errorMessage]);

    if (isLoading || isBookingLoading || isAuthLoading) {
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
