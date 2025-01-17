'use client'
import {Card, Skeleton} from "antd";
import React from "react";


export default function ContactCard({guest, booking}: {guest: any, booking: any}) {

    return <Card className={'rounded-xl'} title={'Guest'}>
        <div className={'grid grid-cols-2'}>
            <div>
                <h3 className={'text-gray-500 font-medium mb-0'}>First Name</h3>
                <p className={''}>{guest.firstName}</p>
            </div>
            <div>
                <h3 className={'text-gray-500 font-medium mb-0'}>Last Name</h3>
                <p className={''}>{guest.lastName}</p>
            </div>
        </div>
        <h3 className={'text-gray-500 font-medium mb-0'}>Email</h3>
        {booking.status === 'Pending'? <Skeleton.Input /> : <p className={''}>{guest.email}</p>}
        <h3 className={'text-gray-500 font-medium mb-0'}>Phone Number</h3>
        {booking.status === 'Pending'? <Skeleton.Input /> : <p className={''}>{guest.phone}</p>}
        <h3 className={'text-gray-500 font-medium mb-0'}>Country</h3>
        <p className={''}>{guest.country}</p>
    </Card>
}