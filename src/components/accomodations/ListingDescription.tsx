import {Card, Col, Grid, Image, Row} from "antd";
import React from "react";


export default function ListingDescription({stay}: {stay: any}) {

    return <Card className={'rounded-2xl'}>
        <Row gutter={[16, 16]}>
            <Col span={5}>
                <h3 className={'font-bold'}>Main Image</h3>
                <Image src={stay.poster} alt={'Main Image'} className={'rounded-xl aspect-video object-cover'}/>
            </Col>
            <Col span={19}>
                <h3 className={'font-bold'}>Detail Room Images</h3>
                <div className={'grid grid-cols-4 gap-4'}>
                    {stay.images?.slice(0,4).map((image: string, index: number) => <Image className={'rounded-xl aspect-video object-cover'} key={index} src={image} alt={'Other Images ' + index}/>)}
                    {/*<div className={'flex items-center justify-center border border-dashed border-primary rounded-xl'}>*/}
                    {/*</div>*/}
                </div>
            </Col>
        </Row>
        <div className={'mt-3'}>
            <h3 className={'font-bold'}>Description</h3>
            <p>{stay.description}</p>
        </div>
        <div>
            <h3 className={'font-bold'}>Facilities</h3>
            <div className={'grid grid-cols-5 grid-rows-7'}>
                {stay.facilities.map((facility:string, index:number) =>  <div key={index} className={'row-span-1'}>{facility}</div>)}
            </div>
        </div>
    </Card>
}