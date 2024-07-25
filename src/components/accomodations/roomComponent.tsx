import {Image, Tag} from "antd";
import {toMoneyFormat} from "@/lib/utils";
import {LuBedSingle} from "react-icons/lu";
import {IoBedOutline} from "react-icons/io5";
import Link from "next/link";


export default function RoomComponent({room, stayId}:{room: any, stayId:string}) {

    return <Link href={`/accommodations/${stayId}/rooms/${room.id}`} className={'rounded-xl text-dark block'}>
        <Image className={'rounded-xl aspect-video object-cover'} src={room.poster} alt="poster"/>
        <h3 className={'font-semibold text-lg capitalize'}>{room.name}</h3>
        <p className={'line-clamp-2'}>{room.description}</p>
        <div className={'flex flex-wrap gap-2 my-4'}>{room.amenities.slice(0,4).map((amenity: string, index: number) =>
            <Tag
                className={'border border-gray-500 shadow-md rounded py-1 px-3 text-balance text-sm'}
                key={index}>{amenity}</Tag>)}</div>

        <div className={'flex items-center gap-2 mb-4 overflow-x-scroll'}>
            {
                room.beds.map((bed: any, index: number) => <div key={index}
                                                                className={' p-3 text-center border-solid border border-gray-500 shadow-md rounded text-nowrap'}>
                    <span
                        className={'mx-auto block'}>{(bed.type.toLowerCase() === 'king' || bed.type.toLowerCase() === 'double') ?
                        <IoBedOutline size={28}/> : <LuBedSingle size={28}/>}</span>
                    {bed.type} Bed x {bed.number}
                </div>)
            }
        </div>
        <hr/>
        <div className={'flex items-center justify-between'}>
            <div>
                <h3 className={'font-medium'}>Room Capacity</h3>
                <p className={'text-gray-500 font-semibold'}>{room.maxGuests} Guests</p>
            </div>
            <div>
                <h3 className={'font-medium'}>Price</h3>
                <p className={'text-primary font-semibold'}>$ {toMoneyFormat(room.price, {})}/night</p>
            </div>
        </div>
    </Link>
}