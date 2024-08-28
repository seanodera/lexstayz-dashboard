'use client';

import {
    selectCurrentBooking,
    setCurrentBookingById,
    updateBookingStatusAsync
} from "@/slices/bookingSlice";
import {useParams, useRouter} from "next/navigation";
import React, {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "@/hooks/hooks";
import BookingDescription from "@/components/booking/bookingDescription";
import {Button, Col, message, Row, Skeleton} from "antd";
import {CheckOutlined, CloseOutlined} from "@ant-design/icons";
import BookedRooms from "@/components/booking/bookedRooms";
import PriceSummary from "@/components/booking/priceSummary";
import {getTag} from "@/components/common";
import {selectCurrentStay, setCurrentStayFromId} from "@/slices/staySlice";
import {startChatAsync} from "@/slices/messagingSlice";

export default function Page() {
    const params = useParams();
    const dispatch = useAppDispatch();
    const {bookingId} = params;
    const booking = useAppSelector(selectCurrentBooking);
    const stay = useAppSelector(selectCurrentStay);
    const [messageApi, contextHolder] = message.useMessage();
    const router = useRouter();

    useEffect(() => {
        if (!booking || bookingId && booking.id !== bookingId) {
            dispatch(setCurrentBookingById(bookingId.toString()));
        }
    }, [booking, bookingId, dispatch]);

    useEffect(() => {
        if (booking && booking.accommodationId && (!stay || booking.accommodationId !== stay.id)) {
            dispatch(setCurrentStayFromId(booking.accommodationId));
        }
    }, [booking, dispatch, stay]);

    async function handleUpdate(e: any, status: 'Pending' | 'Confirmed' | 'Canceled' | 'Rejected') {
        e.preventDefault();
        try {
            dispatch(updateBookingStatusAsync({status: status, booking: booking})).then((value: any) => {
                messageApi.success('Status updated successfully');
                console.log(value);
            });
        } catch (err) {
            console.log(err);
        }
    }

    function handleContactGuest() {
        dispatch(startChatAsync({
            bookingUser: {
                id: booking.accountId,
                firstName: booking.user.firstName,
                lastName: booking.user.lastName,
            }
        })).then((value) => {
            console.log(value);
            router.push('/messages');
        });
    }

    if (!booking || booking.id === undefined || !stay || stay.id === undefined || booking.accommodationId !== stay.id) {
        return <div className={'p-4'}><Skeleton active/></div>;
    } else {
        return (
            <div className="px-4 py-4 md:px-6 lg:px-8">
                {contextHolder}
                <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                    <div className="flex max-md:w-full max-md:justify-between items-center gap-4">
                        <div>
                            <h3 className="text-gray-500 font-bold mb-0">Reservation</h3>
                            <h1 className="font-bold">{booking.id.slice(0, 6).toUpperCase()}</h1>
                        </div>
                        {getTag(booking.status)}
                    </div>
                    <div className="flex gap-2 mt-4 md:mt-0">
                        {booking.status === 'Pending' && (
                            <>
                                <Button ghost danger icon={<CloseOutlined/>}
                                        onClick={(e) => handleUpdate(e, 'Rejected')}>Reject</Button>
                                <Button type="primary" ghost icon={<CheckOutlined/>}
                                        onClick={(e) => handleUpdate(e, 'Confirmed')}>Confirm</Button>
                            </>
                        )}
                        {booking.status === 'Confirmed' && (
                            <>
                                <Button type="primary" onClick={() => handleContactGuest()}>Contact Guest</Button>
                                <Button danger type="primary"
                                        onClick={(e) => handleUpdate(e, 'Canceled')}>Cancel</Button>
                            </>
                        )}
                    </div>
                </div>
                <Row gutter={[16, 16]}>
                    <Col xs={24} md={16} className="space-y-4">
                        <BookingDescription booking={booking} stay={stay}/>
                        {stay.type === 'Hotel' && <BookedRooms booking={booking} stay={stay}/>}
                    </Col>
                    <Col xs={24} md={8} className="space-y-4">
                        {/* <ContactCard guest={booking.user} booking={booking} /> */}
                        <PriceSummary booking={booking} stay={stay}/>
                    </Col>
                </Row>
            </div>
        );
    }
}
