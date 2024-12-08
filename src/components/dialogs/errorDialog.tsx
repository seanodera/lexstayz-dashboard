'use client'
import React, {useEffect, useState} from 'react';
import { Modal, Button } from 'antd';
import {useAppDispatch, useAppSelector} from "@/hooks/hooks";
import {resetAuthError} from "@/slices/authenticationSlice";
import {resetBookingError} from "@/slices/bookingSlice";
import {resetCreateStayError} from "@/slices/createStaySlice";
import {resetMessagingError} from "@/slices/messagingSlice";
import {resetStayError} from "@/slices/staySlice";
import {resetTransactionsError} from "@/slices/transactionsSlice";



const ErrorDialog: React.FC = () => {
    const dispatch = useAppDispatch();
    const [show,setShow] = useState(false);
    const [message,setMessage] = useState<string>('');
    const { hasError: authHasError, errorMessage: authError } = useAppSelector(state => state.authentication);
    const { hasError: bookingHasError, errorMessage: bookingError } = useAppSelector(state => state.booking);
    const { hasError: createStayHasError, errorMessage: createStayError } = useAppSelector(state => state.createStay);
    const { hasError: messagingHasError, errorMessage: messagingError } = useAppSelector(state => state.messaging);
    const { hasError: stayHasError, errorMessage: stayError } = useAppSelector(state => state.stay);
    const { hasError: transactionsHasError, errorMessage: transactionsError } = useAppSelector(state => state.transactions);

    const errorMapping = [
        { hasError: authHasError, errorMessage: authError, resetError: () => dispatch(resetAuthError()) },
        { hasError: bookingHasError, errorMessage: bookingError, resetError: () => dispatch(resetBookingError()) },
        { hasError: createStayHasError, errorMessage: createStayError, resetError: () => dispatch(resetCreateStayError() ) },
        { hasError: messagingHasError, errorMessage: messagingError, resetError: () => dispatch(resetMessagingError() ) },
        { hasError: stayHasError, errorMessage: stayError, resetError: () => dispatch(resetStayError() ) },
        { hasError: transactionsHasError, errorMessage: transactionsError, resetError: () => dispatch(resetTransactionsError() ) },
    ];

    useEffect(() => {
        if (authHasError){
            setShow(true);
            setMessage(authError)
        } else if (bookingHasError){
            setMessage(bookingError)
            setShow(true);
        } else if (createStayHasError){
            setMessage(createStayError)
            setShow(true);
        } else if (messagingHasError){
            setMessage(messagingError)
            setShow(true);
        } else if (stayHasError){
            setMessage(stayError)
            setShow(true);
        } else if (transactionsHasError){
            setMessage(transactionsError)
            setShow(true);
        }
    }, [authError, authHasError, bookingError, bookingHasError, createStayError, createStayHasError, messagingError, messagingHasError, stayError, stayHasError, transactionsError, transactionsHasError]);

function handleClose(){
    errorMapping.forEach((value) => {
        value.resetError();
    })
}

    return (
        <Modal
            title="Error"
            open={show}
            onCancel={handleClose}
            onClose={handleClose}
            closable={true}
            footer={null}
        >
            <p>{message}</p>
        </Modal>
    );
};

export default ErrorDialog;
