import {Button, Card, Table} from "antd";
import {useEffect, useState} from "react";
import dayjs from "dayjs";
import {useSelector} from "react-redux";
import {selectBookings} from "@/slices/bookingSlice";
import {useAppSelector} from "@/hooks/hooks";
import {selectAllStays} from "@/slices/staySlice";
import {EyeOutlined} from "@ant-design/icons";
import Link from "next/link";

const {Column} = Table;
export default function CheckInPanel() {
    const [displayBookings,setDisplayBookings] = useState<any[]>([]);
    const bookings = useSelector(selectBookings);
    const stays = useAppSelector(selectAllStays)
    useEffect(() => {
        let filtered =  bookings.filter((value:any) => {
            let checkIn = dayjs(value.checkInDate).toISOString().split("T")[0];
            let today = dayjs().toISOString().split("T")[0];
            console.log('Check In: ' ,checkIn,' Today: ', today , checkIn === today)
            return checkIn === today && value.status === 'Confirmed';
        })

        setDisplayBookings(filtered);
    }, [bookings]);

    return <Card id={'tour-dashboard-check-ins'} className={'bg-white bg-opacity-70 shadow-md shadow-primary-100'} classNames={{
        // header: 'bg-lightGray bg-opacity-70',
    }}>
        <h2 className={'mb-4'}>Check ins</h2>
        <div className={'grid grid-cols-2 gap-4'}>
            {displayBookings.map((booking, index) => (<ListItem key={index} id={booking.id} user={booking.user}
                                                                stay={stays.find((value: any) => value.id === booking.accommodationId)}/>))}
        </div>
    </Card>
}


function ListItem({id, user, stay }: { id: string; user: any; stay: any }) {

    return (
        <div className="border border-solid border-gray-200 p-4 rounded-lg flex justify-between items-center group hover:border-primary">
            <div>
                <div className="text-gray-500">{id.slice(0, 8).toUpperCase()}</div>
                <div className="text-lg font-medium">
                    {user.firstName} {user.lastName}
                </div>
                <div className="text-sm">{stay?.name}</div>
            </div>
            <Link href={`/reservations/${id}`}>
            <Button
                className="hidden group-hover:block"
                type={'text'}
                icon={<EyeOutlined />}
                shape="circle"
            />
            </Link>
        </div>
    );
}


