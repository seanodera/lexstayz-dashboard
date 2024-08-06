'use client';

import {Button, Card, Table} from "antd";
import { dateReader, timeFromDate, toMoneyFormat } from "@/lib/utils";
import {
    selectTotalBookings,
    selectPage,
    selectLimit,
    selectIsBookingLoading,
    fetchBookingsAsync,
    setPage, selectFetchedPages
} from "@/slices/bookingSlice";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getRooms, getTag } from "@/components/common";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import {Input} from "@headlessui/react";

const { Column } = Table;

export default function BookingPage() {
    const dispatch = useAppDispatch();
    const bookings = useAppSelector(selectTotalBookings);
    const page = useAppSelector(selectPage);
    const limit = useAppSelector(selectLimit);
    const isLoading = useAppSelector(selectIsBookingLoading);
    const fetchedPages = useAppSelector(selectFetchedPages);
    const [localPage, setLocalPage] = useState(1);

    useEffect(() => {
        if (localPage !== page) {
            console.log(page, limit, 'Booking page');
            setLocalPage(page);
            if (!fetchedPages.includes(page)) {
                dispatch(fetchBookingsAsync({ page, limit }));
            }
        }
    }, [localPage, page, limit, fetchedPages, dispatch]);

    const handleTableChange = (pagination: any, filters: any, sorter: any) => {
        console.log(pagination, filters, sorter, 'Change is coming from here');
        dispatch(setPage(pagination.current));
    };

    return (
        <div className="m-4">
            <div className="flex items-center justify-between">
                <h1 className="font-semibold">Bookings</h1>
                <div className={'flex gap-2'}>
                    <Input className={'rounded-lg'} placeholder="Search Bookings" />
                    <Button type={'primary'}>Search</Button>
                </div>
            </div>
            <Card>
                <Table
                    dataSource={bookings}
                    pagination={{
                        current: page,
                        pageSize: limit,
                        total: bookings.length + (isLoading ? limit : 0), // Adjust total for showing loading indicator
                        showSizeChanger: false,
                    }}
                    rowKey="id"
                    loading={isLoading}
                    onChange={handleTableChange}
                >
                    <Column
                        title="Guest"
                        dataIndex={['user']}
                        render={(value, record: any, index) => (
                            <div key={record.id}>
                                <div className="font-medium">{value.firstName} {value.lastName}</div>
                                <div className="text-gray-500">{value.email}</div>
                            </div>
                        )}
                        sorter={(a, b) => a.user.lastName.localeCompare(b.user.lastName)}
                    />
                    <Column
                        className="text-nowrap"
                        title="Booked at"
                        dataIndex="createdAt"
                        render={(value) => `${dateReader({ date: value })} ${timeFromDate({ date: value, am_pm: true })}`}
                        sorter={(a:any, b:any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()}
                    />
                    <Column
                        className="text-nowrap"
                        title="Check-In"
                        dataIndex="checkInDate"
                        render={(value) => dateReader({ date: value })}
                        sorter={(a:any, b:any) => new Date(a.checkInDate).getTime() - new Date(b.checkInDate).getTime()}
                    />
                    <Column
                        className="text-nowrap"
                        title="Check-Out"
                        dataIndex="checkOutDate"
                        render={(value) => dateReader({ date: value })}
                        sorter={(a:any, b:any) => new Date(a.checkOutDate).getTime() - new Date(b.checkOutDate).getTime()}
                    />
                    <Column
                        className={'text-nowrap'}
                        title={'Reference'}
                        dataIndex={'id'}
                        render={(value) => value.slice(0, 8).toUpperCase()}
                    />
                    <Column
                        className="text-nowrap"
                        title="Status"
                        dataIndex="status"
                        filters={[
                            { text: 'Confirmed', value: 'Confirmed' },
                            { text: 'Pending', value: 'Pending' },
                            { text: 'Cancelled', value: 'Cancelled' }
                        ]}
                        onFilter={(value, record:any) => record.status.includes(value)}
                        render={(value) => getTag(value)}
                    />
                    <Column
                        className="text-nowrap"
                        title="Rooms"
                        dataIndex="rooms"
                        render={(value) => getRooms(value)}
                    />
                    <Column
                        className="text-nowrap"
                        title="Guests"
                        dataIndex="numGuests"
                        sorter={(a:any, b:any) => a.numGuests - b.numGuests}
                    />
                    <Column
                        className="text-nowrap font-semibold"
                        title="Total"
                        dataIndex="totalPrice"
                        render={(value) => '$' + toMoneyFormat(value, {})}
                        sorter={(a:any, b:any) => a.totalPrice - b.totalPrice}
                    />
                    <Column
                        title=""
                        dataIndex="id"
                        render={(value) => (
                            <Link href={`/reservations/${value}`}>
                                <Button type="primary">View</Button>
                            </Link>
                        )}
                    />
                </Table>
            </Card>
        </div>
    );
}
