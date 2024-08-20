'use client'
import {Card, Col, Flex, Row, Typography} from "antd";
import {BookFilled, BookOutlined, WalletFilled, WalletOutlined} from "@ant-design/icons";
import {toMoneyFormat} from "@/lib/utils";
import CountUp from "react-countup";
import NotificationsPanel from "@/components/home/NotificationsPanel";
import BookingsPanel from "@/components/home/bookingsPanel";
import CheckInPanel from "@/components/home/checkInPanel";
import ReviewsPanel from "@/components/home/ReviewsPanel";
import {useAppSelector} from "@/hooks/hooks";

import {selectAvailableBalance, selectPendingBalance} from "@/slices/transactionsSlice";

export default function Home() {
    const pendingBalance = useAppSelector(selectPendingBalance)
    const availableBalance = useAppSelector(selectAvailableBalance)
    const items = [
        {
            Icon: BookFilled,
            name: "Confirmed Bookings",
            value: 24
        },
        {
            Icon: BookOutlined,
            name: "Pending Bookings",
            value: 3
        },
        {
            Icon: WalletOutlined,
            name: "Pending Balance",
            value: pendingBalance,
            prefix: '$',
        },
        {
            Icon: WalletFilled,
            name: "Available Balance",
            value: availableBalance,
            prefix: '$',
        }

    ]
    return <div className={'overflow-y-scroll overflow-x-hidden pt-4 pb-10 px-10'}>
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
                                <CountUp className={'font-semibold h1'} end={item.value} prefix={item.prefix}
                                         formattingFn={(value: number) => (item.prefix ? '$ ' + toMoneyFormat(value, {fractionDigits: (item.prefix) ? 2 : 0}) :value.toString())}/>
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
            <Col span={6}>
                <ReviewsPanel/>
            </Col>
        </Row>
    </div>;
}
