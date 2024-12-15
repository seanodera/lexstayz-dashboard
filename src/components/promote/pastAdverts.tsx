'use client'
import {useAppSelector} from "@/hooks/hooks";
import {Image, Typography} from "antd";
import {formatDate} from "date-fns";

const {Title,Text} = Typography;
export default function PastAdverts() {
    const data = useAppSelector(state => state.promotion.pastAdverts);
    return (
        <div className={'grid grid-cols-4'}>
            {data.map((item,index) => (<div key={index}>
                <img className={'rounded-lg aspect-square'} src={item.poster} alt={'Poster'}/>
                <Title className={'mt-1'} level={5}>{item.name}</Title>
                <Text className={'font-semibold block'}>{formatDate(item.startDate, 'dd mmm')} - {formatDate(item.endDate, 'dd mmm')}</Text>
            </div>))}
        </div>
    );
}
