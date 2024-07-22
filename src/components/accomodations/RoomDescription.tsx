import {Card, Col, Image, Row} from "antd";
import React from "react";


export default function RoomDescription({room}: any){

    return <Card className={'rounded-xl'}>
        <Row gutter={[16, 16]}>
            <Col span={5}>
                <h3 className={'font-bold'}>Main Image</h3>
                <Image src={''} alt={'Main Image'} className={'rounded-xl'}/>
            </Col>
            <Col span={19}>
                <h3 className={'font-bold'}>Detail Room Images</h3>
                <div className={'grid grid-cols-4 gap-4'}>

                    <div className={'flex items-center justify-center border border-dashed border-primary rounded-xl'}>

                    </div>
                </div>
            </Col>
        </Row>
    </Card>
}