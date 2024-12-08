'use client'
import {Modal} from "antd";
import {useAppDispatch, useAppSelector} from "@/hooks/hooks";
import {resetAuthError, selectAuthErrorMessage, selectAuthHasError} from "@/slices/authenticationSlice";
import {ExclamationCircleFilled} from "@ant-design/icons";


export default function AuthErrorDialog() {

    const hasError = useAppSelector(selectAuthHasError)
    const message = useAppSelector(selectAuthErrorMessage)
    const dispatch = useAppDispatch()

    const handleOk = () => {
        dispatch(resetAuthError())
    };


    return <Modal title="An Error has occured" className={'text-center'}  open={hasError} onOk={handleOk} >
        <div className={'text-danger text-7xl'}><ExclamationCircleFilled/></div>
        <div>{message}</div>
    </Modal>
}
