'use client'
import {useAppSelector} from "@/hooks/hooks";
import {Card, Image, Typography} from "antd";
import {formatDate} from "date-fns";

const {Title,Text} = Typography;
export default function UpcomingAdverts() {
    const data = useAppSelector(state => state.promotion.upcomingAdverts)
console.log(data)
    return (
        <div className={'grid grid-cols-4'}>
            {data.map((item,index) => (<Card key={index}>
                <img className={'rounded-lg aspect-square'} src={item.poster} alt={'Poster'}/>
                <Title className={'mt-1'} level={5}>{item.name}</Title>
                <Text className={'font-semibold block'}>{formatDate(item.startDate, 'dd MMM')} - {formatDate(item.endDate, 'dd MMM')}</Text>
            </Card>))}
        </div>
    );
}
