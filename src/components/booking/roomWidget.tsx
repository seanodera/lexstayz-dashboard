'use client'
import {Image} from "antd";
import {toMoneyFormat} from "@/lib/utils";


export default function RoomWidget({room, bookingRoom}: { room: any, bookingRoom: any }) {
    return <div>
        <Image src={room.poster} alt="" className={'rounded-xl object-cover mb-2'} />
        <h3 className={'font-semibold mb-0'}>{room.name}</h3>
        <h3 className={'font-medium text-primary mb-0'}>$ {toMoneyFormat(room.price)}/ night</h3>
        <h4 className={'font-medium text-gray-500 mb-0'}>Number Of Rooms</h4>
        <h3 className={'font-medium'}>{bookingRoom.numRooms}</h3>
    </div>
}