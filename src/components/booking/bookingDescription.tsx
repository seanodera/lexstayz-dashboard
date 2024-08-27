'use client'
import {Button, Card, Image, Skeleton} from "antd";
import {dateReader} from "@/lib/utils";
import React from "react";


export default function BookingDescription({ booking, stay }: { booking: any, stay: any }) {


    return  <Card className={'rounded-xl'}>
        <div className={'grid grid-cols-5 gap-4'}>
            <div className={' col-span-2'}>
                <Image className={'rounded-xl aspect-video'} src={stay.poster}/>
                <h3 className={' font-bold mb-0'}>{stay.name}</h3>
                <h4 className={'font-bold text-gray-500 mb-3'}>{stay.location.district}</h4>
                <Button block type={'default'} size={'middle'}>View Stay</Button>
            </div>
            <div className={'col-span-3'}>
                <h3 className={'font-semibold mb-0'}>Id</h3>
                <h4 className={' font-bold text-gray-500'}>{booking.id.toUpperCase()}</h4>
                <div className={'grid grid-cols-2 my-4'}>
                    <div className={''}>
                        <h3 className={'font-semibold mb-0'}>Check In</h3>
                        <h4 className={'  font-bold text-gray-500'}>
                            {dateReader({date: booking.checkInDate, weekDay: true})}</h4>
                    </div>
                    <div className={''}>
                        <h3 className={'font-semibold mb-0'}>Check Out</h3>
                        <h4 className={' font-bold text-gray-500'}>{dateReader({
                            date: booking.checkOutDate,
                            weekDay: true
                        })}</h4>
                    </div>
                    <div>
                        <h3 className={'font-semibold mb-0'}>Guests</h3>
                        <h4 className={' font-bold text-gray-500'}>{booking.numGuests} Adults</h4>
                    </div>
                </div>

                <h3 className={'font-bold'}>Guest Details</h3>
                <div className={'grid grid-cols-2'}>
                    <div>
                        <h3 className={'font-medium mb-0'}>First Name</h3>
                        <p className={''}>{booking.user.firstName}</p>
                    </div>
                    <div>
                        <h3 className={'font-medium mb-0'}>Last Name</h3>
                        <p className={''}>{booking.user.lastName}</p>
                    </div>
                </div>
                <h3 className={'font-medium mb-0'}>Email</h3>
                {booking.status === 'Pending' ? <Skeleton.Input/> : <p className={''}>{booking.user.email}</p>}
                <h3 className={'font-medium mb-0'}>Phone Number</h3>
                {booking.status === 'Pending' ? <Skeleton.Input/> : <p className={''}>{booking.user.phone}</p>}
                <h3 className={'font-medium mb-0'}>Country</h3>
                <p className={''}>{booking.user.country}</p>

                <div className={'mt-4'}>
                    <h3 className={'font-semibold'}>Special Request</h3>
                    <p>{booking.specialRequest ? booking.specialRequest : 'No request'}</p>
                    {/*<h3 className={'font-semibold'}>Extras</h3>*/}
                    {/*<span></span>*/}
                </div>
            </div>
        </div>

    </Card>
}
