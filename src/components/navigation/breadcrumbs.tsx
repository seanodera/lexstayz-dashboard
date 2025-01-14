'use client'
import {Breadcrumb} from 'antd';
import Link from 'next/link';
import React, {useEffect} from 'react';
import {usePathname} from 'next/navigation';
import {useAppSelector} from '@/hooks/hooks';
import {selectCurrentBooking} from '@/slices/bookingSlice';
import {BsChevronRight} from 'react-icons/bs';
import {selectCurrentStay} from "@/slices/staySlice";
import {Hotel} from "@/lib/types";

const Breadcrumbs: React.FC = () => {
    const pathname = usePathname();
    const currentStay = useAppSelector(selectCurrentStay);
    const currentBooking = useAppSelector(selectCurrentBooking);
    const [currentPath, setCurrentPath] = React.useState('Dashboard');
    const pathSnippets = pathname.split('/').filter(i => i);

    // Helper function to find the room name by ID
    const getRoomNameById = (id: string) => {
        return (currentStay as Hotel)?.rooms?.find((room: any) => room.id === id)?.name || 'Room';
    };

    const breadcrumbItems = pathSnippets.map((snippet, index) => {
        const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
        let path = snippet;

        if (index > 0) {
            const prevSnippet = pathSnippets[ index - 1 ];
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
            title: <Link href="/">Dashboard</Link>,
        },
        ...breadcrumbItems,
    ];
    useEffect(() => {
        console.log(pathSnippets.length);
        if (pathSnippets.length > 1) {

            let snippet = pathSnippets[pathSnippets.length - 1];
            let path = snippet;

                const prevSnippet = pathSnippets[ pathSnippets.length - 2 ];
                if (prevSnippet === 'accommodations' && snippet !== 'create') {
                    path = currentStay?.name || 'Stay';
                } else if (prevSnippet === 'rooms' && snippet !== 'create') {
                    path = getRoomNameById(snippet);
                } else if (prevSnippet === 'reservations') {
                    path = currentBooking?.bookingCode || snippet.slice(0, 6).toUpperCase();
                }
            setCurrentPath(path);
        } else if (pathSnippets.length === 1){
            setCurrentPath(pathSnippets[0])
        } else {
            if (pathname === '/') {
                setCurrentPath('Dashboard');
            } else {
                setCurrentPath(pathname);
            }
        }

    }, [pathname]);

    return (
        <div>
            <h2 className={'font-semibold mb-0 capitalize'}>{currentPath}</h2>
            <Breadcrumb className="items-center" separator={<BsChevronRight/>} items={items}/>
        </div>
    );
};

export default Breadcrumbs;
