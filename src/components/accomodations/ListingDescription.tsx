import { Card, Col, Image, Row } from "antd";
import React from "react";
import { PlusOutlined } from "@ant-design/icons";

export default function ListingDescription({ stay }: { stay: any }) {
    console.log(stay);

    return (
        <Card id={'tour-accommodation-details'} className="rounded-2xl gap-y-8 space-y-16">
            <div>
                <Row gutter={[16, 16]}>
                    <Col xs={24} md={8}>
                        <h3 className="font-bold text-lg">Main Image</h3>
                        <Image
                            src={stay.poster}
                            alt="Main Image"
                            className="rounded-xl aspect-video object-cover"
                            preview={false}
                        />
                    </Col>
                    <Col xs={24} md={16}>
                        <h3 className="font-bold text-lg">Detail Room Images</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {stay.images?.slice(0, stay.images.length >= 3 ? 3 : stay.images.length).map((image: string, index: number) => (
                                <Image
                                    className="rounded-xl aspect-video object-cover"
                                    key={index}
                                    src={image}
                                    alt={`Other Images ${index}`}
                                    preview={false}
                                />
                            ))}
                            {stay.images.length > 3 && (
                                <div
                                    style={{ backgroundImage: `url(${stay.images[3]})` }}
                                    className="bg-cover aspect-video rounded-xl w-full flex items-center justify-center"
                                >
                                    <div className="flex flex-col items-center justify-center bg-black bg-opacity-30 rounded-xl w-full h-full text-lg text-white hover:bg-opacity-60">
                                        <PlusOutlined className="font-bold text-2xl" />
                                        <span>See All</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Col>
                </Row>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                    <h3 className="font-bold text-lg mb-2">Location</h3>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                        <div>
                            <h4 className="text-gray-500 font-bold mb-1">Street Address</h4>
                            <span>{stay.location.street}</span>
                        </div>
                        <div>
                            <h4 className="text-gray-500 font-bold mb-1">Street Address 2</h4>
                            <span>{stay.location.street2}</span>
                        </div>
                        <div>
                            <h4 className="text-gray-500 font-bold mb-1">District</h4>
                            <span>{stay.location.district}</span>
                        </div>
                        <div>
                            <h4 className="text-gray-500 font-bold mb-1">City</h4>
                            <span>{stay.location.city}</span>
                        </div>
                        <div>
                            <h4 className="text-gray-500 font-bold mb-1">Zip Code</h4>
                            <span>{stay.location.zipCode}</span>
                        </div>
                        <div>
                            <h4 className="text-gray-500 font-bold mb-1">Country</h4>
                            <span>{stay.location.country}</span>
                        </div>
                    </div>
                </div>
                <div>
                    <h3 className="font-bold text-lg mb-2">Rules</h3>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                        <div>
                            <h4 className="text-gray-500 font-bold mb-1">Age Restriction</h4>
                            <span>{stay.minAge}</span>
                        </div>
                        <div>
                            <h4 className="text-gray-500 font-bold mb-1">Smoking</h4>
                            <span className="text-nowrap">{stay.smoking}</span>
                        </div>
                        <div>
                            <h4 className="text-gray-500 font-bold mb-1">Pets Allowed</h4>
                            <span>{stay.pets}</span>
                        </div>
                        <div>
                            <h4 className="text-gray-500 font-bold mb-1">Parties Allowed</h4>
                            <span>{stay.parties}</span>
                        </div>
                        <div>
                            <h4 className="text-gray-500 font-bold mb-1">Cancellation</h4>
                            <span>{stay.cancellation.cancellation}</span>
                        </div>
                    </div>
                </div>
            </div>
            <h3 className="font-bold text-lg mt-4">Description</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <p>{stay.description}</p>
                </div>
                {stay.type==='Home' && <div>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <h4 className="text-gray-500 font-bold mb-1">Price Per Night</h4>
                            <span>{stay.currency} {stay.price}</span>
                        </div>
                        <div>
                            <h4 className="text-gray-500 font-bold mb-1">Bathrooms</h4>
                            <span className="text-nowrap">{stay.bathrooms}</span>
                        </div>
                        <div>
                            <h4 className="text-gray-500 font-bold mb-1">Beds</h4>
                            <span>{stay.beds}</span>
                        </div>
                        <div>
                            <h4 className="text-gray-500 font-bold mb-1">Bedrooms</h4>
                            <span>{stay.bedrooms}</span>
                        </div>
                    </div>
                </div>}
            </div>
            <div className="mt-4">
                <h3 className="font-bold text-lg">Facilities</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {stay.facilities.map((facility: string, index: number) => (
                        <div key={index} className="bg-gray-200 rounded-md p-2">
                            {facility}
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
}
