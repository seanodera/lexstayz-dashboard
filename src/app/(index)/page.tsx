'use client'
import Image from "next/image";
import {Card, Col, Flex, Row, Typography} from "antd";
import {BookFilled, BookOutlined, WalletFilled, WalletOutlined} from "@ant-design/icons";
import {toMoneyFormat} from "@/lib/utils";
import CountUp from "react-countup";
import NotificationsPanel from "@/components/home/NotificationsPanel";
import BookingsPanel from "@/components/home/bookingsPanel";
import CheckInPanel from "@/components/home/checkInPanel";

export default function Home() {
    const items = [
        {
            Icon: BookFilled,
            name: "Confirmed Bookings",
            value: 8
        },
        {
            Icon: BookOutlined,
            name: "Pending Bookings",
            value: 8
        },
        {
            Icon: WalletOutlined,
            name: "Pending Balance",
            value: 4500,
            prefix: '$',
        },
        {
            Icon: WalletFilled,
            name: "Available Balance",
            value: 10000,
            prefix: '$',
        }

    ]
    return <div className={'overflow-y-scroll overflow-x-hidden px-4 py-4'}>
        <Row gutter={[16, 16]} className={''}>
            <Col span={24}>
                <div className={'grid grid-cols-4 gap-4 w-full'}>
                    {items.map((item, index) => <Card className={'col-span-1'} key={index}>
                        <Flex align="center" gap={16}>
                            <div
                                className="text-2xl flex items-center justify-center rounded-md h-12 w-12 bg-primary-200">
                                <item.Icon/>
                            </div>
                            <div>
                                <CountUp className={'font-semibold h2'} end={item.value} prefix={item.prefix}
                                         formattingFn={(value: number) => toMoneyFormat(value, {fractionDigits: (item.prefix) ? 2 : 0})}/>
                                <Typography className={'text-gray-500'}>{item.name}</Typography>
                            </div>
                        </Flex>
                    </Card>)}
                </div>
            </Col>
            <Col span={18}>
                <BookingsPanel/>

            </Col>
            <Col span={6}>
                <NotificationsPanel/>
            </Col>
            <Col span={18}>
                <CheckInPanel/>
            </Col>
        </Row>
    </div>;
}
