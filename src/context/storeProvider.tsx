'use client'
import { Provider } from 'react-redux'
import store from "@/data/store";
import {ReactNode} from "react";
import {TourContextProvider} from "@/context/tourContext";


export default function StoreProvider({ children } : {children: ReactNode}) {



    return <Provider store={store}><TourContextProvider>{children}</TourContextProvider></Provider>
}
