'use client'

import {Button, Card, Table, Tag} from "antd";
import {dateReader, toMoneyFormat} from "@/lib/utils";
import {useSelector} from "react-redux";
import {selectBookings} from "@/slices/bookingSlice";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {getRooms, getTag} from "@/components/common";

const {Column} = Table;
export default function BookingPage() {
    const bookings = useSelector(selectBookings);

    const router = useRouter()

    return <div className={'m-4'}>
        <h1 className={'font-semibold'}>Bookings</h1>
        <Card>
            <Table dataSource={bookings} pagination={{
            }} onRow={(record, rowIndex) => {
                return {
                    onClick: event => {},
                };
            }} >
                <Column className={'text-nowrap'} title={'First Name'} dataIndex={['user', 'firstName']}/>
                <Column className={'text-nowrap'} title={'Last Name'} dataIndex={['user', 'lastName']}/>
                <Column className={'text-nowrap'} title={'Email'} dataIndex={['user', 'email']}/>
                <Column className={'text-nowrap'} title={'Check-In'} dataIndex={'checkInDate'}
                        render={value => dateReader({date: value})}/>
                <Column className={'text-nowrap'} title={'Check-Out'} dataIndex={'checkOutDate'}
                        render={value => dateReader({date: value})}/>
                <Column className={'text-nowrap'} title={'Status'} dataIndex={'status'} render={value => getTag(value)}/>
                <Column className={'text-nowrap'} title={'Rooms'} dataIndex={'rooms'} render={value => getRooms(value)}/>
                <Column className={'text-nowrap'} title={'Guests'} dataIndex={'numGuests'}/>
                <Column className={'text-nowrap font-semibold'} title={'Total'} dataIndex={'totalPrice'} render={(value) => '$' + toMoneyFormat(value,{})}/>
                <Column title={''} dataIndex={'id'} render={(value) => <Link href={`/reservations/${value}`}><Button type={"primary"}>View</Button></Link> }/>
            </Table>
        </Card>
    </div>;
}