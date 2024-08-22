import {Card, Col, Image, Row} from "antd";
import React from "react";
import {PlusOutlined} from "@ant-design/icons";


export default function ListingDescription({stay}: { stay: any }) {
    console.log(stay)
    return <Card className={'rounded-2xl gap-y-8 space-y-16'}>
        <div>
            <Row gutter={[16, 16]}>
                <Col span={5}>
                    <h3 className={'font-bold'}>Main Image</h3>
                    <Image src={stay.poster} alt={'Main Image'} className={'rounded-xl aspect-video object-cover'}/>
                </Col>
                <Col span={19}>
                    <h3 className={'font-bold'}>Detail Room Images</h3>
                    <div className={'grid grid-cols-4 gap-4'}>
                        {stay.images?.slice(0, stay.images.length >= 3 ? 3 : stay.images.length).map((image: string, index: number) =>
                            <Image className={'rounded-xl aspect-video object-cover'} key={index} src={image}
                                   alt={'Other Images ' + index}/>)}
                        {(stay.images.length > 4 ? <div style={{
                            backgroundImage: 'url(' + stay.images[ 3 ] + ')'
                        }} className={'bg-cover rounded-xl'}>
                            <div
                                className={'flex flex-col items-center justify-center bg-cover rounded-xl gap-2 hover:bg-black bg-opacity-30 hover:bg-opacity-60 h-full w-full text-lg text-white '}>
                                <PlusOutlined className={'font-bold text-2xl'}/>
                                <span>See All</span>
                            </div>
                        </div> : (stay.images.length === 4 ?
                            <Image className={'rounded-xl aspect-video object-cover'} src={stay.images[ 3 ]}
                                   alt={'Other Images 4'}/> : ''))}
                    </div>
                </Col>
            </Row>
        </div>
        <div className={'grid grid-cols-2 gap-4 mt-4'}>
            <div>
                <h3 className={'font-bold mb-0'}>Location</h3>
                <div className={'grid grid-cols-3 gap-2'}>
                    <div>
                        <h4 className={'text-gray-500 font-bold mb-0'}>Street Address</h4>
                        <span>{stay.location.street}</span>
                    </div>
                    <div>
                        <h4 className={'text-gray-500 font-bold mb-0'}>Street Address 2</h4>
                        <span>{stay.location.street2}</span>
                    </div>
                    <div>
                        <h4 className={'text-gray-500 font-bold mb-0'}>District</h4>
                        <span>{stay.location.district}</span>
                    </div>
                    <div>
                        <h4 className={'text-gray-500 font-bold mb-0'}>City</h4>
                        <span>{stay.location.city}</span>
                    </div>
                    <div>
                        <h4 className={'text-gray-500 font-bold mb-0'}>Zip Code</h4>
                        <span>{stay.location.zipCode}</span>
                    </div>
                    <div>
                        <h4 className={'text-gray-500 font-bold mb-0'}>Country</h4>
                        <span>{stay.location.country}</span>
                    </div>
                </div>
            </div>
            <div>
                <h3 className={'font-bold mb-0'}>Rules</h3>
                <div className={'grid grid-cols-3 gap-2'}>
                    <div>
                        <h4 className={'text-gray-500 font-bold mb-0'}>Age Restriction</h4>
                        <span>{stay.minAge}</span>
                    </div>
                    <div>
                        <h4 className={'text-gray-500 font-bold mb-0'}>Smoking</h4>
                        <span className={'text-nowrap'}>{stay.smoking}</span>
                    </div>
                    <div>
                        <h4 className={'text-gray-500 font-bold mb-0'}>Pets Allowed</h4>
                        <span>{stay.pets}</span>
                    </div>
                    <div>
                        <h4 className={'text-gray-500 font-bold mb-0'}>Parties Allowed</h4>
                        <span>{stay.parties}</span>
                    </div>
                    <div>
                        <h4 className={'text-gray-500 font-bold mb-0'}>Cancellation</h4>
                        <span>{stay.cancellation.cancellation}</span>
                    </div>
                </div>
            </div>
        </div>
        <h3 className={'font-bold mt-4'}>Description</h3>
        <div className={'grid grid-cols-2 gap-4'}>
            <div className={''}>
                <p>{stay.description}</p>
            </div>
            <div className={''}>
                <div className={'grid grid-cols-2 gap-2'}>
                    <div>
                        <h4 className={'text-gray-500 font-bold mb-0'}>Price Per Night</h4>
                        <span>{stay.currency} {stay.price}</span>
                    </div>
                    <div>
                        <h4 className={'text-gray-500 font-bold mb-0'}>Bathrooms</h4>
                        <span className={'text-nowrap'}>{stay.bathrooms}</span>
                    </div>
                    <div>
                        <h4 className={'text-gray-500 font-bold mb-0'}>Beds</h4>
                        <span>{stay.beds}</span>
                    </div>
                    <div>
                        <h4 className={'text-gray-500 font-bold mb-0'}>Bedrooms</h4>
                        <span>{stay.bedrooms}</span>
                    </div>
                </div>
            </div>
        </div>
        <div className={'mt-4'}>
            <h3 className={'font-bold'}>Facilities</h3>
            <div className={'grid grid-cols-5'}>
                {stay.facilities.map((facility: string, index: number) => <div key={index}
                                                                               className={'row-span-1'}>{facility}</div>)}
            </div>
        </div>
    </Card>
}