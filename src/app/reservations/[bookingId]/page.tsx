'use client'
import {
    selectCurrentBooking, selectCurrentStay,
    setCurrentBookingById,
    setCurrentStayFromId
} from "@/slices/bookingSlice";
import {useParams} from "next/navigation";
import React, {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "@/hooks/hooks";
import BookingDescription from "@/components/booking/bookingDescription";
import {Button, Col, Row, Skeleton} from "antd";
import ContactCard from "@/components/booking/contactCard";
import {CheckOutlined, CloseOutlined} from "@ant-design/icons";
import BookedRooms from "@/components/booking/bookedRooms";
import PriceSummary from "@/components/booking/priceSummary";
import {getTag} from "@/components/common";

export default function Page() {
    const params = useParams();
    const dispatch = useAppDispatch();
    const {bookingId} = params;
    const booking = useAppSelector(selectCurrentBooking);
    const stay = useAppSelector(selectCurrentStay);
    useEffect(() => {
        dispatch(setCurrentBookingById(bookingId));
    }, [bookingId, dispatch]);
    useEffect(() => {
        if (stay.id !== booking.accommodationId) {

            dispatch(setCurrentStayFromId(booking.accommodationId));
        }
    }, [booking, dispatch, stay]);
    const guest = booking.user;

    if (!booking || booking.bookingId === undefined || !stay || stay.id === undefined) {
        return <div className={'p-4'}><Skeleton active/></div>;
    } else {
    return <div className={'px-4 py-4'}>
        <div className={'flex justify-between items-center'}>
            <div className={'flex items-center gap-4'}>
                <div>
                    <h3 className={'text-gray-500 font-bold mb-0'}>Reservation</h3>
                    <h1 className={'font-bold items-center'}>{booking.bookingCode}</h1>
                </div>
                {getTag(booking.status)}
            </div>
            <div className={'flex gap-2'}>
                <Button ghost danger icon={<CloseOutlined/>} onClick={() => {
                }}>Reject</Button>
                <Button type={'primary'} ghost icon={<CheckOutlined/>}>Confirm</Button>
            </div>
        </div>
        <Row gutter={[16, 16]}>
            <Col span={16} className={'space-y-4'}>
                <BookingDescription booking={booking} stay={stay}/>
                <BookedRooms
                    booking={booking}
                    stay={stay}/></Col>
            <Col span={8} className={'space-y-4'}>
                <ContactCard guest={guest}/>
                <PriceSummary booking={booking} stay={stay}/>
            </Col>
        </Row>
    </div>;
    }
}