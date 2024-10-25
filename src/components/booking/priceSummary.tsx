'use client'
import {Button, Card} from "antd";
import {calculateStayLength, getCountry, getServerTime, toMoneyFormat} from "@/lib/utils";
import {useEffect, useState} from "react";


export default function PriceSummary({booking, stay}: { booking: any, stay: any }) {
    const [pricePerNight, setPricePerNight] = useState(0)
    useEffect(() => {
        let _pricePerNight = 0;
        if (stay.type === 'Hotel') {
            booking.rooms.forEach((room: any) => {
                _pricePerNight += (room.numRooms * room.price);
            })
        } else {
            _pricePerNight = stay.price
        }
        setPricePerNight(_pricePerNight);
    }, []);
    return <Card id={'tour-reservation-summary'} title={'Booking Summary'} className={'rounded-xl'}>
        <div className={''}>
            {stay.type === 'Hotel' ? <table className={'table-auto text-nowrap'}>
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
                                className={'text-gray-500 font-medium'}>{stay.currency}{toMoneyFormat(room.price)}</span>
                                <span
                                    className={'text-primary font-medium'}>{stay.currency}{toMoneyFormat(room.numRooms * room.price)}</span>
                            </td>
                        </tr>
                    }
                )}
                </tbody>
            </table> : <div className={'flex justify-between '}></div>}
        </div>
        <hr className={`${stay.type !== 'Hotel' && 'hidden'}`}/>
        <div className={'grid grid-cols-2 gap-4'}>
            <h4 className={'w-full text-gray-500'}>Per Night</h4>
            <h4 className={'font-medium'}>{stay.currency} {toMoneyFormat(booking.totalPrice / calculateStayLength(booking.checkOutDate, booking.checkInDate))}</h4>
            <h4 className={'text-gray-500'}>Subtotal({calculateStayLength(booking.checkOutDate, booking.checkInDate)} Night)</h4>
            <h4 className={'font-medium'}>{stay.currency} {toMoneyFormat(booking.totalPrice)}</h4>
            <h4 className={'text-gray-500'}>Lexstayz Fees</h4>
            <h4 id={'tour-reservation-fees'} className={'font-medium'}>{stay.currency} {toMoneyFormat(booking.fees / booking.usedRate)}</h4>
            <h4 className={'text-gray-500'}>Total</h4>
            <h4 id={'tour-reservation-total'} className={'font-medium'}>{stay.currency} {toMoneyFormat(booking.grandTotal / booking.usedRate)}</h4>
            <h4 className={'font-gray-500'}>Converted Amount</h4>
            <h4 id={'tour-reservation-converted'} className={'font-medium'}>{booking.currency} {toMoneyFormat(booking.grandTotal)}</h4>
        </div>
    </Card>
}
