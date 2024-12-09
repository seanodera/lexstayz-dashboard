import { Card, Dropdown, Table } from "antd";
import { useSelector } from "react-redux";
import { selectAllStays, selectCurrentStay, setCurrentStayFromId } from "@/slices/staySlice";
import { dateReader, toMoneyFormat } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { BsChevronDown } from "react-icons/bs";
import { getRooms, getTag } from "@/components/common";
import { selectBookings } from "@/slices/bookingSlice";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

export default function BookingsPanel() {
    const bookings = useSelector(selectBookings);
    const [displayBookings, setDisplayBookings] = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => {
        let localBookings = [...bookings];
        let filtered = localBookings.filter(value => value.status !== 'Rejected')
            .sort((a: any, b: any) => dayjs(a.createdAt).diff(dayjs(b.createdAt)));
        setDisplayBookings(filtered);
    }, [bookings]);

    const dispatch = useAppDispatch();
    const stays = useAppSelector(selectAllStays);
    const currentStay = useAppSelector(selectCurrentStay);
    const menuItems = stays.map((item: any, index: number) => ({
        key: index,
        label: (
            <div onClick={() => dispatch(setCurrentStayFromId(item.id))} className={''}>
                <div className={'font-semibold'}>{item.name}</div>
                <div className={'text-gray-500 '}>{item.location.district}, {item.location.country}</div>
            </div>
        ),
    }));

    const handleRowClick = (record: any) => {
        router.push(`/reservations/${record.id}`);
    };

    const columns = [
        {
            title: 'Guest',
            dataIndex: ['user'],
            key: 'guest',
            className: 'rounded-s-2xl', // Add this line
            render: (value: any) => `${value.firstName.slice(0, 1)}. ${value.lastName}`,
        },
        {
            title: 'Check-In',
            dataIndex: 'checkInDate',
            key: 'checkInDate',
            className: 'text-nowrap ', // Add this line
            render: (value: any) => dateReader({ date: value }),
        },
        {
            title: 'Check-Out',
            dataIndex: 'checkOutDate',
            key: 'checkOutDate',
            className: 'text-nowrap ', // Add this line
            render: (value: any) => dateReader({ date: value }),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            className: 'text-nowrap ', // Add this line
            render: (value: any) => getTag(value),
        },
        {
            title: 'Rooms',
            dataIndex: 'rooms',
            key: 'rooms',
            className: 'text-nowrap ', // Add this line
            render: (value: any) => (value ? getRooms(value) : 'Home'),
        },
        {
            title: 'Guests',
            dataIndex: 'numGuests',
            key: 'numGuests',
            className: 'text-nowrap', // Add this line
        },
        {
            title: 'Total',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            className: 'text-nowrap rounded-e-2xl', // Add this line
            render: (value: any) => 'USD' + toMoneyFormat(value),
        },
    ];

    // <Dropdown menu={{ items: menuItems }}>
    //     <div className={'border border-solid border-gray-300 px-3 py-2 rounded flex justify-between items-center gap-2 hover:border-primary'}>
    //         {currentStay?.name} <BsChevronDown className={'text-xs'} />
    //     </div>
    // </Dropdown>

    return (
        <Table
            id={'tour-dashboard-recent'}
            className={'bg-transparent rounded-xl overflow-hidden bg-cross-dots-light shadow shadow-primary-100'}
            scroll={{ x: true }}
            dataSource={displayBookings.slice(0, 8)}
            pagination={false}
            columns={columns}
            bordered={false}
            rowClassName={' bg-white bg-opacity-70 hover:bg-primary hover:bg-opacity-100 hover:text-white my-2 rounded-xl'}
            rowHoverable={false}
            tableLayout={'auto'}
            title={() => <h2 className={'mb-0 font-semibold'}>Recent Bookings</h2>}
            onRow={(record) => ({
                onClick: () => handleRowClick(record), // Click row
            })}
        />
    );
}
