'use client'
import {useEffect, useState} from "react";
import {Card, Descriptions} from "antd";
import {useAppSelector} from "@/hooks/hooks";
import {selectPartialStay} from "@/slices/createStaySlice";


export default function CreateStep6() {
    const [currency, setCurrency] = useState<string>('USD')
    const [descriptionItems, setDescriptionItems] = useState<any[]>([])
    const stay = useAppSelector(selectPartialStay)
    useEffect(() => {
        const ignore = ['poster', 'images', 'id', 'location',]
        if (stay) {
            if (stay.cancellation.cancellation === 'Other') {
                ignore.push('cancellation')
            }
            let list = Object.keys(stay).filter((name) => !ignore.includes(name)).map(key => {
                let value = stay[ key ];

                // Special handling for arrays and object values
                if (Array.isArray(value)) {
                    value = value.join(', ');
                } else if (key === 'cancellation') {
                    value = stay[ key ].cancellation;
                } else if (typeof value === 'object' && value !== null) {
                    value = JSON.stringify(value);
                }

                return {
                    label: key.charAt(0).toUpperCase() + key.slice(1),
                    children: value,
                };
            });
            setDescriptionItems(list);
        }
    }, [stay]);
    return <Card className={'space-y-4'}>
        <h2>Complete Accommodation</h2>

        <div className={'py-4'}>
            <h3>Details</h3>
            <Descriptions layout={'vertical'} className={''} items={descriptionItems}/>
        </div>
        <div className={'py-4'}>
            <h3>Location Details</h3>
            <Descriptions layout={'vertical'} items={[
                {
                    label: 'Street Address',
                    children: stay.location.street,
                },
                {
                    label: 'Street Address 2',
                    children: stay.location.street2,
                },
                {
                    label: 'District',
                    children: stay.location.district,
                },
                {
                    label: 'City',
                    children: stay.location.city,
                },
                {
                    label: 'Country',
                    children: stay.location.country,
                },
                {
                    label: 'Zip Code',
                    children: stay.location.zipCode,
                }
            ]}/>
        </div>
        {stay.cancellation.cancellation === 'Other' && <div className={'py-4'}>
            <h3>Cancellation Policy</h3>
            <Descriptions layout={'vertical'} items={[
                {
                    label: 'Cancellation Rate',
                    children: stay.cancellation.rate,
                },
                {
                    label: 'Cancellation Policy',
                    children: `Free cancellation until ${stay.cancellation.time} ${stay.cancellation.timeSpace} ${stay.cancellation.preDate ? 'Before Check In' : 'After Booking Date'}`
                }
            ]}/>
        </div>}
    </Card>
}