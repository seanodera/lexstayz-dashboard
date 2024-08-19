'use client'
import { Breadcrumb } from 'antd';
import Link from 'next/link';
import React from 'react';
import { usePathname } from 'next/navigation';
import { useAppSelector } from '@/hooks/hooks';
import { selectCurrentBooking } from '@/slices/bookingSlice';
import { BsChevronRight } from 'react-icons/bs';
import { selectCurrentStay } from "@/slices/staySlice";

const Breadcrumbs: React.FC = () => {
    const pathname = usePathname();
    const currentStay = useAppSelector(selectCurrentStay);
    const currentBooking = useAppSelector(selectCurrentBooking);

    const pathSnippets = pathname.split('/').filter(i => i);

    // Helper function to find the room name by ID
    const getRoomNameById = (id: string) => {
        return currentStay?.rooms?.find((room: any) => room.id === id)?.name || 'Room';
    };

    const breadcrumbItems = pathSnippets.map((snippet, index) => {
        const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
        let path = snippet;

        if (index > 0) {
            const prevSnippet = pathSnippets[index - 1];
            if (prevSnippet === 'accommodations' && snippet !== 'create') {
                path = currentStay?.name || 'Stay';
            } else if (prevSnippet === 'rooms' && snippet !== 'create') {
                path = getRoomNameById(snippet);
            } else if (prevSnippet === 'reservations') {
                path = currentBooking?.bookingCode || snippet.slice(0, 6).toUpperCase();
            }
        }

        return {
            key: url,
            title: <Link href={url}>{path}</Link>,
        };
    });

    const items = [
        {
            key: 'home',
            title: <Link href="/">Home</Link>,
        },
        ...breadcrumbItems,
    ];

    return (
        <Breadcrumb className="items-center" separator={<BsChevronRight />} items={items} />
    );
};

export default Breadcrumbs;
