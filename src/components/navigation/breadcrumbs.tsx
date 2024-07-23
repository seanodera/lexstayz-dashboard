'use client'
import { Breadcrumb } from 'antd';
import Link from 'next/link';
import React from 'react';
import {usePathname} from "next/navigation";
import {useAppSelector} from "@/hooks/hooks";
import {selectCurrentBooking, selectCurrentStay} from "@/slices/bookingSlice";
import {BsChevronRight} from "react-icons/bs";

const Breadcrumbs: React.FC = () => {
    const pathname = usePathname();
    const currentStay = useAppSelector(selectCurrentStay);
    const currentBooking = useAppSelector(selectCurrentBooking);
    const pathSnippets = pathname.split('/').filter(i => i);

    const breadcrumbItems = pathSnippets.map((snippet, index) => {
        const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
        let path = snippet;
        if (index > 0){
            let prevSnippet = pathSnippets[index - 1];
            if (prevSnippet === 'accommodations' && snippet !== 'create'){
                path = currentStay.name;
            } else if (prevSnippet === 'rooms' && snippet !== 'create'){
                path = currentStay.rooms.find((room:any) => room.id.toString() === snippet).name;
            } else if (prevSnippet === 'reservations'){
                path = currentBooking.bookingCode;
            }
        }
        return (
            <Breadcrumb.Item key={url}>
                <Link href={url}>{path}</Link>
            </Breadcrumb.Item>
        );
    });

    return (
        <Breadcrumb className={'items-center'} separator={<BsChevronRight/>}>
            <Breadcrumb.Item key="home">
                <Link href="/">Home</Link>
            </Breadcrumb.Item>
            {breadcrumbItems}
        </Breadcrumb>
    );
};

export default Breadcrumbs;
