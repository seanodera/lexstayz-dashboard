import {Card} from "antd";
import RoomWidget from "@/components/booking/roomWidget";


export default function BookedRooms({booking, stay}: { booking: any, stay: any }) {

    return <Card className={'rounded-xl'}>
        <h2 className={'font-semibold'}>Reserved Rooms</h2>
        <div className={'grid grid-cols-4 gap-8'}>
            {booking.rooms?.map((bookingRoom: any, index: number) => <RoomWidget key={index}
                                                                                room={stay.rooms.find((value: any) => value.id === bookingRoom.roomId)}
                                                                                bookingRoom={bookingRoom}/>)}
        </div>
    </Card>
}

