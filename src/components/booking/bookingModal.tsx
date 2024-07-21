import {Modal} from "antd";
import {useAppSelector} from "@/hooks/hooks";
import {selectAllStays} from "@/slices/bookingSlice";
import {useState} from "react";


export default function BookingModal({booking, setOpen, open}: {booking: any,setOpen: any, open: any}) {
    const stay = useAppSelector(selectAllStays).find((value:any) => value.id === booking.accommodationId);



    const showModal = () => {
        setOpen(true);
    };

    const handleOk = () => {
        setOpen(false);
    };

    const handleCancel = () => {
        setOpen(false);
    };


    return <Modal title={booking.title}>

    </Modal>
}
