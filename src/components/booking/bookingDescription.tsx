'use client'
import {Card} from "antd";
import {dateReader} from "@/lib/utils";


export default function BookingDescription({ booking, stay }: { booking: any, stay: any }) {


    return  <Card className={'rounded-xl'}>
        <div className={' rounded-xl text-lg font-bold w-max'}>{stay.name}</div>
        <div className={' rounded-xl font-bold w-max text-gray-500'}>{stay.location.district}</div>
        <div className={'grid grid-cols-2 my-4'}>
            <div className={''}>
                <h3 className={'font-semibold mb-0'}>Check In</h3>
                <div className={' rounded-xl text-lg font-bold w-max'}>
                    {dateReader({date: booking.checkInDate, weekDay: true})}</div>
            </div>
            <div className={''}>
                <h3 className={'font-semibold mb-0'}>Check Out</h3>
                <div className={' rounded-xl text-lg font-bold w-max'}>{dateReader({
                    date: booking.checkOutDate,
                    weekDay: true
                })}</div>
            </div>
        </div>

        <h2 className={'font-semibold mt-6 mb-1'}>Special Request</h2>
        <p>{booking.specialRequest}</p>
    </Card>
}
