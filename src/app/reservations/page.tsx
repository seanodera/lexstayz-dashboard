'use client';

import { Table } from "antd";
import { dateReader, timeFromDate, toMoneyFormat } from "@/lib/utils";
import {
    selectTotalBookings,
    selectPage,
    selectLimit,
    selectIsBookingLoading,
    fetchBookingsAsync,
    setPage,
    selectFetchedPages,
    selectBookingsCount
} from "@/slices/bookingSlice";
import { useEffect, useState } from "react";
import { getRooms, getTag } from "@/components/common";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { Input } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { selectAllStays } from "@/slices/staySlice";

export default function BookingPage(){
    const dispatch = useAppDispatch();
    const bookings = useAppSelector(selectTotalBookings);
    const stays = useAppSelector(selectAllStays);
    const page = useAppSelector(selectPage);
    const limit = useAppSelector(selectLimit);
    const isLoading = useAppSelector(selectIsBookingLoading);
    const fetchedPages = useAppSelector(selectFetchedPages);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const bookingCount = useAppSelector(selectBookingsCount);
    const router = useRouter();

    useEffect(() => {
        if (!fetchedPages.includes(page)) {
            dispatch(fetchBookingsAsync({ page, limit }));
        }
    }, [page, limit, fetchedPages, dispatch]);

    const handleSearch = (value: string) => {
        setSearchTerm(value);
        const filteredResults = bookings.filter((booking: any) => {
            const searchFields = [
                booking.user.email,
                booking.user.phone,
                booking.user.firstName,
                booking.user.lastName,
                booking.id
            ];
            return searchFields.some(field => field.toLowerCase().includes(value.toLowerCase()));
        });

        setSearchResults(filteredResults);
    };

    const handleTableChange = (pagination: any) => {
        dispatch(setPage(pagination.current));
    };

    const handleRowClick = (record: any) => {
        router.push(`/reservations/${record.id}`);
    };

    const columns = [
        {
            title: "Guest",
            dataIndex: ['user'],
            key: 'guest',
            render: (value: any) => (
                <div className="font-medium text-nowrap">
                    {value.firstName.slice(0, 1)}. {value.lastName}
                </div>
            ),
            sorter: (a: any, b: any) => a.user.lastName.localeCompare(b.user.lastName),
        },
        {
            title: "Booked at",
            dataIndex: "createdAt",
            key: 'bookedAt',
            className: "text-nowrap",
            render: (value: any) => `${dateReader({ date: value, years: false })} ${timeFromDate({ date: value, am_pm: true })}`,
            sorter: (a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        },
        {
            title: "Check-In",
            dataIndex: "checkInDate",
            key: 'checkIn',
            className: "text-nowrap",
            render: (value: any) => dateReader({ date: value }),
            sorter: (a: any, b: any) => new Date(a.checkInDate).getTime() - new Date(b.checkInDate).getTime(),
        },
        {
            title: "Check-Out",
            dataIndex: "checkOutDate",
            key: 'checkOut',
            className: "text-nowrap",
            render: (value: any) => dateReader({ date: value }),
            sorter: (a: any, b: any) => new Date(a.checkOutDate).getTime() - new Date(b.checkOutDate).getTime(),
        },
        {
            title: 'Reference',
            dataIndex: 'id',
            key: 'reference',
            className: "text-nowrap",
            render: (value: any) => value.slice(0, 8).toUpperCase(),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: 'status',
            className: "text-nowrap",
            filters: [
                { text: 'Confirmed', value: 'Confirmed' },
                { text: 'Pending', value: 'Pending' },
                { text: 'Cancelled', value: 'Cancelled' }
            ],
            onFilter: (value: any, record: any) => record.status.includes(value),
            render: (value: any) => getTag(value),
        },
        {
            title: "Rooms",
            dataIndex: "rooms",
            key: 'rooms',
            className: "text-nowrap",
            render: (value: any) => value ? getRooms(value) : 'Home',
        },
        {
            title: 'Stay',
            dataIndex: 'accommodationId',
            key: 'stay',
            className: "text-nowrap",
            filters: stays.map((stay: any) => ({ text: stay.name, value: stay.id })),
            render: (value: any) => {
                return stays.find((stay: any) => stay.id === value)?.name || value;
            },
        },
        {
            title: "Guests",
            dataIndex: "numGuests",
            key: 'guests',
            className: "text-nowrap",
            sorter: (a: any, b: any) => a.numGuests - b.numGuests,
        },
        {
            title: "Total",
            dataIndex: "totalPrice",
            key: 'total',
            className: "text-nowrap font-semibold",
            render: (value: any) => 'USD' + toMoneyFormat(value),
            sorter: (a: any, b: any) => a.totalPrice - b.totalPrice,
        }
    ];

    return (
        <Table
            rowKey="id"
            title={() => (
                <div className="flex items-center justify-between">
                    <h1 className="font-semibold">Bookings</h1>
                    <div className={'flex gap-2 '}>
                        <Input className={'rounded-lg'} placeholder="Search Bookings"
                               onChange={(e) => handleSearch(e.target.value)} />
                        {/*<Button type={'primary'} onClick={() => handleSearch()}>Search</Button>*/}
                    </div>
                </div>
            )}
            columns={columns}
            dataSource={(searchTerm === '') ? bookings : searchResults}
            pagination={{
                current: page,
                pageSize: limit,
                total: bookingCount,
                showSizeChanger: false,
            }}
            loading={isLoading}
            onChange={handleTableChange}
            onRow={(record) => ({
                onClick: () => handleRowClick(record),
            })}
            className={'rounded-xl overflow-hidden shadow shadow-primary-100'}
            scroll={{ x: 'max-content' }} // Ensure the table is scrollable horizontally for responsive design
            bordered={false}
            rowClassName={'bg-white bg-opacity-70 hover:bg-primary hover:bg-opacity-100 hover:text-white my-2 rounded-xl'}
            rowHoverable={false}
            tableLayout={'auto'}
        />
    );
};
