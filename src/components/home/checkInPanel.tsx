import {Card, Table} from "antd";
import {useEffect, useState} from "react";
import dayjs from "dayjs";
import {useSelector} from "react-redux";
import {selectBookings} from "@/slices/bookingSlice";
import {dateReader, toMoneyFormat} from "@/lib/utils";
import {getRooms, getTag} from "@/components/common";

const {Column} = Table;
export default function CheckInPanel() {
    const [displayBookings,setDisplayBookings] = useState([]);
    const bookings = useSelector(selectBookings);

    useEffect(() => {
        let localDocuments = bookings;
        let filtered =  localDocuments.filter((value:any) => {
            let checkIn = dayjs(value.checkInDate).toISOString().split("T")[0];
            let today = dayjs().toISOString().split("T")[0];
            console.log('Check In: ' ,checkIn,' Today: ', today , checkIn === today)
            return checkIn === today;
        })
        console.log(filtered)
        setDisplayBookings(filtered);
    }, [bookings]);

    return <Card classNames={{body: 'px-0 pt-0'}} title={<h2 className={'mb-0 font-semibold'}>Today&apos;s Check Ins</h2>}>
        <Table scroll={{x: true}} dataSource={displayBookings} pagination={false}>
            <Column title={'Guest'} dataIndex={['user']} render={(value, record:any, index) => {
                return <div key={index}>
                    <div className={'font-medium'}>{value.firstName} {value.lastName}</div>
                    <div className={'text-gray-500'}>{value.email}</div>
                </div>;
            }
            }/>
            <Column className={'text-nowrap'} title={'Check-In'} dataIndex={'checkInDate'}
                    render={value => dateReader({date: value})}/>
            <Column className={'text-nowrap'} title={'Check-Out'} dataIndex={'checkOutDate'}
                    render={value => dateReader({date: value})}/>
            <Column className={'text-nowrap'} title={'Status'} dataIndex={'status'} render={value => getTag(value)}/>
            <Column className={'text-nowrap'} title={'Rooms'} dataIndex={'rooms'} render={value => value? getRooms(value) : 1}/>
            <Column className={'text-nowrap'} title={'Guests'} dataIndex={'numGuests'}/>
            <Column className={'text-nowrap'} title={'Total'} dataIndex={'totalPrice'} render={(value) => '$' + toMoneyFormat(value,{})}/>
        </Table>

    </Card>
}