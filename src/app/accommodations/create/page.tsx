'use client'
import ListingEditComponent from "@/components/accomodations/ListingEditComponent";
import Link from "next/link";
import {Button} from "antd";
import {PlusCircleOutlined} from "@ant-design/icons";
import React from "react";
import {useAppSelector} from "@/hooks/hooks";
import {selectPartialStay} from "@/slices/createStaySlice";


export default function Page() {
    const stay = useAppSelector(selectPartialStay)

    return <div className={'pt-4 pb-10 px-10'}>

        <ListingEditComponent partial={stay}/>
    </div>
}