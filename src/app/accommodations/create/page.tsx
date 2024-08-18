'use client'
import {Button, Card, message} from "antd";
import {
    BookOutlined, CheckCircleOutlined, EditOutlined,
    EnvironmentOutlined, HomeOutlined,
    InfoCircleOutlined,
    PictureOutlined
} from "@ant-design/icons";
import React, {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "@/hooks/hooks";
import {
    selectPartialErrorMessage,
    selectPartialHasError,
    selectPartialLoading,
    selectPartialStay,
    uploadStayAsync
} from "@/slices/createStaySlice";
import CreateStep1 from "@/components/accomodations/create/step1";
import CreateStep2 from "@/components/accomodations/create/step2";
import CreateStep3 from "@/components/accomodations/create/step3";
import CreateStep4 from "@/components/accomodations/create/step4";
import CreateStep5 from "@/components/accomodations/create/step5";
import CreateStep0 from "@/components/accomodations/create/step0";
import {BsActivity} from "react-icons/bs";
import CreateStep6 from "@/components/accomodations/create/step6";
import {useRouter} from "next/navigation";
import CreateStep25 from "@/components/accomodations/create/step25";


export default function Page() {
    const stay = useAppSelector(selectPartialStay)
    const [current, setCurrent] = useState(1);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const isLoading = useAppSelector(selectPartialLoading)
    const hasError = useAppSelector(selectPartialHasError)
    const errorMessage = useAppSelector(selectPartialErrorMessage)

    const [items, setItems] = useState([
        {
            title: 'Create',
            icon: <EditOutlined/>,
            content: <CreateStep0/>
        },

        {
            title: "Location",
            icon: <EnvironmentOutlined/>,
            content: <CreateStep1/>
        },
        {
            title: 'Images',
            icon: <PictureOutlined/>,
            content: <CreateStep2/>
        },
        {
            title: 'Rules',
            icon: <BookOutlined/>,
            content: <CreateStep3/>
        }, {
            title: 'Cancellations',
            icon: <InfoCircleOutlined/>,
            content: <CreateStep4/>,
        },
        {
            title: 'Facilities',
            icon: <BsActivity/>,
            content: <CreateStep5/>
        },
        {
            title: 'Complete',
            icon: <CheckCircleOutlined/>,
            content: <CreateStep6/>
        }
    ])


    useEffect(() => {

    }, []);
    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };

    function handleDone() {



        dispatch(uploadStayAsync()).then((action: any) => {
            if (action.meta.requestStatus === 'fulfilled') {

            }
            message.success('Processing complete!')
            router.push('/accommodations');
        })
    }

    useEffect(() => {
        if (stay.type === 'Home') {
            setItems([{
            title: 'Create',
            icon: <EditOutlined/>,
            content: <CreateStep0/>
        },
            {
                title: "Location",
                icon: <EnvironmentOutlined/>,
                content: <CreateStep1/>
            },
            {
                title: 'Home Details',
                icon: <HomeOutlined/>,
                content: <CreateStep25/>
            },
            {
                title: 'Images',
                icon: <PictureOutlined/>,
                content: <CreateStep2/>
            },
            {
                title: 'Rules',
                icon: <BookOutlined/>,
                content: <CreateStep3/>
            }, {
                title: 'Cancellations',
                icon: <InfoCircleOutlined/>,
                content: <CreateStep4/>,
            },
            {
                title: 'Facilities',
                icon: <BsActivity/>,
                content: <CreateStep5/>
            },
            {
                title: 'Complete',
                icon: <CheckCircleOutlined/>,
                content: <CreateStep6/>
            }] )} else {
            setItems( [
                {
                    title: 'Create',
                    icon: <EditOutlined/>,
                    content: <CreateStep0/>
                },

                {
                    title: "Location",
                    icon: <EnvironmentOutlined/>,
                    content: <CreateStep1/>
                },
                {
                    title: 'Images',
                    icon: <PictureOutlined/>,
                    content: <CreateStep2/>
                },
                {
                    title: 'Rules',
                    icon: <BookOutlined/>,
                    content: <CreateStep3/>
                }, {
                    title: 'Cancellations',
                    icon: <InfoCircleOutlined/>,
                    content: <CreateStep4/>,
                },
                {
                    title: 'Facilities',
                    icon: <BsActivity/>,
                    content: <CreateStep5/>
                },
                {
                    title: 'Complete',
                    icon: <CheckCircleOutlined/>,
                    content: <CreateStep6/>
                }
            ])
        }
    }, [stay.type]);
    return <div className={'pt-4 pb-10 px-4 md:px-10'}>
        <div className={'flex flex-col justify-center items-center w-full h-full'}>
            {isLoading ? <Card className={'md:max-w-screen-md xl:max-w-screen-lg w-full aspect-20/7 p-0'}>
                    <div className={'h-full w-full flex flex-col justify-center items-center'}>
                        <div className={'loader-circle h-20 w-20'}/>
                    </div>
                </Card> :
                <Card className={'max-w-xl w-full'}>
                    <div className={'mb-4'}>
                        {items[current].content}
                    </div>
                    <div className={'flex justify-between'}>
                        {current > 0 && (
                            <Button type="primary" onClick={prev}>
                                Previous
                            </Button>
                        )}
                        {current < items.length - 1 && (
                            <Button type="primary" onClick={next}>
                                Next
                            </Button>
                        )}
                        {current === items.length - 1 && (
                            <Button type="primary" onClick={handleDone}>
                                Done
                            </Button>
                        )}
                    </div>
                </Card>}
        </div>
    </div>
}