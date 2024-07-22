import {Card, Col, Image, Row, Tag} from "antd";
import React from "react";
import {toMoneyFormat} from "@/lib/utils";
import {IoBedOutline} from "react-icons/io5";
import {LuBedSingle} from "react-icons/lu";


export default function RoomDescription({room}: any){

    return <Card className={'rounded-2xl'}>
        <Row gutter={[16, 16]}>
            <Col span={5}>
                <h3 className={'font-bold'}>Main Image</h3>
                <Image src={room.poster} alt={'Main Image'} className={'rounded-xl'}/>
            </Col>
            <Col span={19}>
                <h3 className={'font-bold'}>Detailed Room Images</h3>
                <div className={'grid grid-cols-4 gap-4'}>
                    {room.images?.slice(0, 3).map((image: string, index: number) => <Image className={'rounded-xl'}
                                                                                           key={index} src={image}
                                                                                           alt={'Other Images ' + index}/>)}
                    <div className={'flex items-center justify-center border border-dashed border-primary rounded-xl'}>
                    </div>
                </div>
            </Col>
        </Row>
        <div className={'grid grid-cols-3 gap-8 my-4'}>
            <div>
                <h3 className={'font-bold'}>Amenities</h3>
                <div
                    className={'flex flex-wrap gap-2 my-4'}>{room.amenities.map((amenity: string, index: number) =>
                    <Tag
                        className={'border border-gray-500 shadow-md rounded py-1 px-3 text-balance text-sm'}
                        key={index}>{amenity}</Tag>)}</div>
            </div>
            <div>
                <div>
                    <h3 className={'font-bold'}>Description</h3>
                    <p>{room.description}</p>
                </div>
                <h3 className={'font-bold'}>Details</h3>
                <div className={'grid grid-cols-2 gap-y-1'}>
                    <h3 className={'mb-0 font-medium text-gray-500'}>Rate</h3>
                    <h3 className={'mb-0 text-primary'}>$ {toMoneyFormat(room.price, {})} / night</h3>
                    <h3 className={'mb-0 font-medium text-gray-500'}>Discounted</h3>
                    <h3 className={'mb-0 capitalize'}>{room.discounted.toString()}</h3>
                    <h3 className={'mb-0 font-medium text-gray-500'}>Available</h3>
                    <h3 className={'mb-0 capitalize'}>{room.available}</h3>
                    <h3 className={'mb-0 font-medium text-gray-500'}>Guests</h3>
                    <h3 className={'mb-0 capitalize'}>{room.maxGuests}</h3>
                </div>
            </div>
            <div>
                <h3 className={'font-bold'}>Beds</h3>
                <div className={'flex items-center gap-2 mb-4'}>
                    {
                        room.beds.map((bed: any, index: number) => <div key={index}
                                                                        className={' p-3 text-center border-solid border border-gray-500 shadow-md rounded text-nowrap'}>
                    <span
                        className={'mx-auto block'}>{(bed.type.toLowerCase() === 'king' || bed.type.toLowerCase() === 'double') ?
                        <IoBedOutline size={28}/> : <LuBedSingle size={28}/>}</span>
                            {bed.number} {bed.type} {bed.number === 1? 'Bed' : 'Beds'}
                        </div>)
                    }
                </div>
            </div>
        </div>
    </Card>
}