import { Card, Col, Image, Row, Tag } from "antd";
import React from "react";
import { toMoneyFormat } from "@/lib/utils";
import { IoBedOutline } from "react-icons/io5";
import { LuBedSingle } from "react-icons/lu";

export default function RoomDescription({ room }: any) {
    return (
        <Card className="rounded-2xl p-4">
            <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                    <h3 className="font-bold mb-2">Main Image</h3>
                    <Image
                        src={room.poster}
                        alt="Main Image"
                        className="rounded-xl aspect-video object-cover w-full"
                    />
                </Col>
                <Col xs={24} md={12}>
                    <h3 className="font-bold mb-2">Detailed Room Images</h3>
                    <div className="grid grid-cols-2  gap-4">
                        {room.images?.slice(0, Math.min(room.images.length, 4)).map((image: string, index: number) => (
                            <Image
                                className="rounded-xl aspect-video object-cover"
                                key={index}
                                src={image}
                                alt={`Other Images ${index}`}
                            />
                        ))}

                    </div>
                </Col>
            </Row>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 my-4">
                <div>
                    <h3 className="font-bold mb-2">Amenities</h3>
                    <div className="flex flex-wrap gap-2 my-4">
                        {room.amenities.map((amenity: string, index: number) => (
                            <Tag
                                className="border border-gray-500 shadow-md rounded py-1 px-3 text-balance text-sm"
                                key={index}
                            >
                                {amenity}
                            </Tag>
                        ))}
                    </div>
                </div>
                <div>
                    <h3 className="font-bold mb-2">Description</h3>
                    <p>{room.description}</p>
                    <h3 className="font-bold mt-4 mb-2">Details</h3>
                    <div className="grid grid-cols-2 gap-y-2">
                        <div>
                            <h4 className="mb-0 font-medium text-gray-500">Rate</h4>
                            <h4 className="mb-0 text-primary">${toMoneyFormat(room.price)} / night</h4>
                        </div>
                        <div>
                            <h4 className="mb-0 font-medium text-gray-500">Available</h4>
                            <h4 className="mb-0">{room.available}</h4>
                        </div>
                        <div>
                            <h4 className="mb-0 font-medium text-gray-500">Guests</h4>
                            <h4 className="mb-0">{room.maxGuests}</h4>
                        </div>
                    </div>
                </div>
                <div>
                    <h3 className="font-bold mb-2">Beds</h3>
                    <div className="flex flex-wrap gap-2">
                        {room.beds.map((bed: any, index: number) => (
                            <div
                                key={index}
                                className="p-3 text-center border border-gray-500 shadow-md rounded flex flex-col items-center"
                            >
                                <span className="mb-2">
                                    {bed.type.toLowerCase() === 'king' || bed.type.toLowerCase() === 'double' ? (
                                        <IoBedOutline size={28} />
                                    ) : (
                                        <LuBedSingle size={28} />
                                    )}
                                </span>
                                <span>
                                    {bed.number} {bed.type} {bed.number === 1 ? 'Bed' : 'Beds'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Card>
    );
}
