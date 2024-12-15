'use client'
import {Badge, Button, Card, Image, Tabs, Typography} from "antd";

import PastAdverts from "@/components/promote/pastAdverts";
import {faker} from "@faker-js/faker";
import {useAppSelector} from "@/hooks/hooks";
import RoomComponent from "@/components/accomodations/roomComponent";
import {formatDate} from "date-fns";
import {PlusCircleOutlined} from "@ant-design/icons";
import {useState} from "react";
import {MdCampaign} from "react-icons/md";
import Link from "next/link";
import UpcomingAdverts from "@/components/promote/upcomingAdverts";

const {Title, Text} = Typography;
export default function PromotionPage() {
    const promotion = {
        id: 'promotion',
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        description: 'Amazing promotion deal',
        stays: [
            ''
        ],
        currency: 'KES',
        amount: 26000,
        status: 'Confirmed'
    }
    const ongoing = useAppSelector(state => state.promotion.ongoingFeatures)

    return <div className={'px-8 py-4 space-y-4'}>
        <div
             className='flex flex-col md:flex-row justify-between items-center'>
            <h1 className='text-2xl font-bold'>Your Promotions</h1>
            <Link href={'/promotions/new'}>
                <Button
                    className='mt-4 md:mt-0'

                    type='primary'
                    icon={<MdCampaign/>}

                >
                    {'Create new'}
                </Button>
            </Link>
        </div>
        <Card className={'shadow-md rounded-xl'}>
            <div className={'grid grid-cols-3 gap-6'}>
                <Image src={faker.image.url()} className={'object-cover rounded-lg aspect-video'}/>
                <div className={'col-span-2'}>
                    <div className={'flex justify-between'}><Title level={3}>Promotion Name</Title>
                        <div>
                            <Button type={'primary'}>View Stays</Button>
                        </div>
                    </div>
                    <div className={'grid grid-cols-2 gap-x-6 gap-y-1'}>
                        <div>
                            <Title level={5}>Start Date</Title>
                            <Text>26 nov</Text>
                        </div>
                        <div>
                            <Title level={5}>End Date</Title>
                            <Text>26 nov</Text>
                        </div>
                        <div>
                            <Title level={5}>status</Title>
                            <Badge status={'success'}>Running</Badge>
                        </div>
                        <div>
                            <Title level={5}>Amount Paid</Title>
                            <Text className={'font-semibold'}>KES 26000</Text>
                        </div>
                        <div>
                            <Title level={5}>Created At</Title>
                            <Text>26 nov</Text>
                        </div>
                        <div>
                            <Title level={5}>Total Stays</Title>
                            <Text>2</Text>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
        {ongoing.map((item, index: number) => <Card key={index} className={'shadow-md rounded-xl'}>
            <div>
                <img className={'rounded-lg aspect-square'} src={item.poster} alt={'Poster'}/>
                <Title className={'mt-1'} level={5}>{item.name}</Title>
                <Text
                    className={'font-semibold block'}>{formatDate(item.startDate, 'dd mmm')} - {formatDate(item.endDate, 'dd mmm')}</Text>
            </div>
        </Card>)}
        {/*<UpcomingAdverts/>*/}
        <Tabs items={[
            {
                key: 'upcoming',
                label: 'Upcoming Adverts',
                children: <UpcomingAdverts/>
            }, {
                key: 'pastAdverts',
                label: 'Past Adverts',
                children: <PastAdverts/>
            }
        ]}/>
    </div>
}
