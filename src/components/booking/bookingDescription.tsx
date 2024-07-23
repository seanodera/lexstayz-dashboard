import {Card} from "antd";
import {dateReader} from "@/lib/utils";


export default function BookingDescription({ booking, stay }: { booking: any, stay: any }) {

    return <Card className={'rounded-xl'}>
        <div className={'grid grid-cols-2 mb-4'}>
            <div className={''}>
                <h3 className={'font-semibold'}>Check In</h3>
                <div className={' rounded-xl text-lg font-bold w-max'}>
                    {dateReader({date: booking.checkInDate, weekDay: true})}</div>
            </div>
            <div className={''}>
                <h3 className={'font-semibold'}>Check Out</h3>
                <div className={' rounded-xl text-lg font-bold w-max'}>{dateReader({date: booking.checkOutDate, weekDay: true})}</div>
            </div>
        </div>

        <h2 className={'font-semibold'}>Special Request</h2>
        <p>{booking.specialRequest}</p>
        <h2 className={'font-semibold'}>Price Summary</h2>
    </Card>
}
