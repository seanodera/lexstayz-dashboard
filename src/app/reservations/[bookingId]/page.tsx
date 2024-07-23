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
import {Button, Col, Row} from "antd";
import ContactCard from "@/components/booking/contactCard";
import {CheckOutlined, CloseOutlined} from "@ant-design/icons";
import BookedRooms from "@/components/booking/bookedRooms";
import PriceSummary from "@/components/booking/priceSummary";

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
    }, [booking.accommodationId, dispatch, stay.id]);
    const guest = booking.user;
    return <div className={'px-4 py-4'}>
        <div className={'flex justify-between items-center'}>
            <div className={''}>
                <h3 className={'text-gray-500 font-bold mb-0'}>Reservation</h3>
                <h1 className={'font-bold'}>{booking.bookingCode}</h1>
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