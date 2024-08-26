'use client';

import {Button, Card, Table} from "antd";
import {dateReader, timeFromDate, toMoneyFormat} from "@/lib/utils";
import {
    selectTotalBookings,
    selectPage,
    selectLimit,
    selectIsBookingLoading,
    fetchBookingsAsync,
    setPage, selectFetchedPages, selectBookingsCount
} from "@/slices/bookingSlice";
import Link from "next/link";
import {useEffect, useState} from "react";
import {getRooms, getTag} from "@/components/common";
import {useAppDispatch, useAppSelector} from "@/hooks/hooks";
import {Input} from "@headlessui/react";
import {useRouter} from "next/navigation";
import {selectAllStays, selectCurrentStay} from "@/slices/staySlice";

const {Column} = Table;

export default function BookingPage() {
    const dispatch = useAppDispatch();
    const bookings = useAppSelector(selectTotalBookings);
    const stays = useAppSelector(selectAllStays)
    const page = useAppSelector(selectPage);
    const limit = useAppSelector(selectLimit);
    const isLoading = useAppSelector(selectIsBookingLoading);
    const fetchedPages = useAppSelector(selectFetchedPages);
    const [localPage, setLocalPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const bookingCount = useAppSelector(selectBookingsCount)
    const router = useRouter();
    useEffect(() => {
        if (!fetchedPages.includes(page)) {

            dispatch(fetchBookingsAsync({page, limit}));
        }
    }, [page, limit, fetchedPages]);

    const handleSearch = (value: string) => {
        setSearchTerm(value)
        const filteredResults = bookings.filter((booking: any) => {
            const searchFields = [
                booking.user.email,
                booking.user.phone,
                booking.user.firstName,
                booking.user.lastName,
                booking.id
            ]
            return searchFields.some(field => field.toLowerCase().includes(value.toLowerCase()));
        });

        console.log(filteredResults);
        setSearchResults(filteredResults);
    };
    const handleTableChange = (pagination: any, filters: any, sorter: any) => {
        console.log(pagination, filters, sorter, 'Change is coming from here');
        dispatch(setPage(pagination.current));
    };
    console.log(bookings.length)
    const handleRowClick = (record: any) => {
        console.log("Row clicked:", record);
        router.push(`/reservations/${record.id}`);
    }
    return (
        <div className="m-4">
            <div className="flex items-center justify-between">
                <h1 className="font-semibold">Bookings</h1>
                <div className={'flex gap-2'}>
                    <Input className={'rounded-lg'} placeholder="Search Bookings"
                           onChange={(e) => handleSearch(e.target.value)}/>
                    {/*<Button type={'primary'} onClick={() => handleSearch()}>Search</Button>*/}
                </div>
            </div>
            <Card>
                <Table
                    rowKey="id"
                    dataSource={(searchTerm === '') ? bookings : searchResults}
                    pagination={{
                        current: page,
                        pageSize: limit,
                        total: bookingCount, // Adjust total for showing loading indicator
                        showSizeChanger: false,
                    }}

                    loading={isLoading}
                    onChange={handleTableChange}
                    onRow={(record) => {
                        return {
                            onClick: () => handleRowClick(record), // Click row
                        };
                    }}
                >
                    <Column
                        title="Guest"
                        dataIndex={['user']}
                        render={(value, record: any, index) => (
                            <div key={record.id} className="font-medium">{value.firstName.slice(0,1)}. {value.lastName}</div>
                        )}
                        sorter={(a, b) => a.user.lastName.localeCompare(b.user.lastName)}></Column>
                    <Column
                        className="text-nowrap"
                        title="Booked at"
                        dataIndex="createdAt"
                        render={(value) => `${dateReader({date: value, years: false})} ${timeFromDate({date: value, am_pm: true})}`}
                        sorter={(a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()}
                    />
                    <Column
                        className="text-nowrap"
                        title="Check-In"
                        dataIndex="checkInDate"
                        render={(value) => dateReader({date: value})}
                        sorter={(a: any, b: any) => new Date(a.checkInDate).getTime() - new Date(b.checkInDate).getTime()}
                    />
                    <Column
                        className="text-nowrap"
                        title="Check-Out"
                        dataIndex="checkOutDate"
                        render={(value) => dateReader({date: value})}
                        sorter={(a: any, b: any) => new Date(a.checkOutDate).getTime() - new Date(b.checkOutDate).getTime()}
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
                            {text: 'Confirmed', value: 'Confirmed'},
                            {text: 'Pending', value: 'Pending'},
                            {text: 'Cancelled', value: 'Cancelled'}
                        ]}
                        onFilter={(value, record: any) => record.status.includes(value)}
                        render={(value) => getTag(value)}
                    />
                    <Column
                        className="text-nowrap"
                        title="Rooms"
                        dataIndex="rooms"
                        render={(value) => value? getRooms(value) : 'Home'}
                    />
                    <Column className={'text-nowrap'} title={'Stay'} dataIndex={'accommodationId'} render={(value:string) => {
                        return stays.find((stay) => stay.id === value)?.name || value;
                    }}/>
                    <Column
                        className="text-nowrap"
                        title="Guests"
                        dataIndex="numGuests"
                        sorter={(a: any, b: any) => a.numGuests - b.numGuests}
                    />
                    <Column
                        className="text-nowrap font-semibold"
                        title="Total"
                        dataIndex="totalPrice"
                        render={(value, record, index) => {
                            console.log(record)
                            return 'USD' + toMoneyFormat(value);
                        }}
                        sorter={(a: any, b: any) => a.totalPrice - b.totalPrice}
                    />
                    {/*<Column*/}
                    {/*    title=""*/}
                    {/*    dataIndex="id"*/}
                    {/*    fixed={'right'}*/}
                    {/*    render={(value) => (*/}
                    {/*        <Link href={`/reservations/${value}`}>*/}
                    {/*            <Button type="primary">View</Button>*/}
                    {/*        </Link>*/}
                    {/*    )}*/}
                    {/*/>*/}
                </Table>
            </Card>
        </div>
    );
}
