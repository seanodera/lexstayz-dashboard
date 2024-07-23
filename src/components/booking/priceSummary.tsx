'use client'
import {Card} from "antd";
import {toMoneyFormat} from "@/lib/utils";
import {useEffect, useState} from "react";


export default function PriceSummary({booking, stay}: { booking: any, stay: any }) {
    const [pricePerNight, setPricePerNight] = useState(0)
    useEffect(() => {
        let _pricePerNight = 0;
        booking.rooms.forEach((room: any) => {
            _pricePerNight+=(room.numRooms * room.price);
        })
        setPricePerNight(_pricePerNight);
    }, [booking]);
    return <Card title={'Price Summary'} className={'rounded-xl'}>
        <div className={''}>
            <table className={'table-auto text-nowrap'}>
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
                                className={'text-gray-500 font-medium'}>${toMoneyFormat(room.price, {})}</span>
                                <span
                                    className={'text-primary font-medium'}>${toMoneyFormat(room.numRooms * room.price, {})}</span>
                            </td>
                        </tr>
                    }
                )}
                </tbody>
            </table>
        </div>
        <hr/>
        <div className={'grid grid-cols-2'}>
            <h4 className={'w-full text-gray-500'}>Per Night</h4>
            <h4 className={'font-medium'}>$  {toMoneyFormat(pricePerNight,{})}</h4>
            <h4 className={'text-gray-500'}>Lexstayz Fees</h4>
            <h4 className={'font-medium'}>$ {toMoneyFormat(0.035 * booking.totalPrice, {})}</h4>
            <h4 className={'text-gray-500'}>Total</h4>
            <h4 className={'font-medium'}>$ {toMoneyFormat(booking.totalPrice, {})}</h4>
        </div>
    </Card>
}