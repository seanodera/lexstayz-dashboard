'use client'
import {Button, Card} from "antd";
import {getCountry, getServerTime, toMoneyFormat} from "@/lib/utils";
import {useEffect, useState} from "react";


export default function PriceSummary({booking, stay}: { booking: any, stay: any }) {
    const [pricePerNight, setPricePerNight] = useState(0)
    useEffect(() => {
        let _pricePerNight = 0;
        stay.type === 'Hotel' && booking.rooms.forEach((room: any) => {
            _pricePerNight+=(room.numRooms * room.price);
        })
        setPricePerNight(_pricePerNight);
    }, [booking]);
    return <Card title={'Price Summary'} className={'rounded-xl'}>
        <div className={''}>
            {stay.type === 'Hotel'? <table className={'table-auto text-nowrap'}>
                <thead>
                <tr className={'border-0 border-b border-solid'}>
                    <th className={'w-full text-start'}>Room Name</th>
                    <th className={'px-2'}>Number Of Rooms</th>
                    <th className={''}>Room Price</th>
                </tr>
                </thead>
                <tbody>
                {booking.rooms.map((room: any, index: number) => {

                        return <tr className={'table-row'} key={index}>
                            <td className={'capitalize'}><h4>{room.name}</h4></td>
                            <td className={'font-bold'}>{room.numRooms}</td>
                            <td className={'flex flex-col'}><span
                                className={'text-gray-500 font-medium'}>{stay.currency}{toMoneyFormat(room.price, {})}</span>
                                <span
                                    className={'text-primary font-medium'}>{stay.currency}{toMoneyFormat(room.numRooms * room.price, {})}</span>
                            </td>
                        </tr>
                    }
                )}
                </tbody>
            </table> : <div>Hy</div>}
        </div>
        <hr/>
        <div className={'grid grid-cols-2'}>
            <h4 className={'w-full text-gray-500'}>Per Night</h4>
            <h4 className={'font-medium'}>{stay.currency}  {toMoneyFormat(pricePerNight,{})}</h4>
            <h4 className={'text-gray-500'}>Lexstayz Fees</h4>
            <h4 className={'font-medium'}>{stay.currency} {toMoneyFormat(booking.fees / booking.usedRate, {})}</h4>
            <h4 className={'text-gray-500'}>Total</h4>
            <h4 className={'font-medium'}>{stay.currency} {toMoneyFormat(booking.grandTotal / booking.usedRate, {})}</h4>
            <h4 className={'font-gray-500'}>Converted Amount</h4>
            <h4 className={'font-medium'}>{booking.currency} {toMoneyFormat(booking.grandTotal, {})}</h4>
        </div>
    </Card>
}