'use client'
import {Button, Card, Image, Upload} from "antd";
import React, {useEffect, useState} from "react";
import {UploadOutlined} from "@ant-design/icons";
import {UploadChangeParam} from "antd/es/upload";
import {UploadFile} from "antd/lib";
import UploadImagesComponent from "@/components/accomodations/uploadImagesComponent";
import {useAppDispatch, useAppSelector} from "@/hooks/hooks";
import {selectPartialStay, updateImages} from "@/slices/createStaySlice";

export default function CreateStep2() {
    const stay = useAppSelector(selectPartialStay);
    const [poster, setPoster] = useState<string>(stay.poster);
    const [images, setImages] = useState<string[]>(stay.images);
    const handleChange = (info: UploadChangeParam<UploadFile<any>>) => {
        setPoster(URL.createObjectURL(info.file.originFileObj as File))
    };
    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(updateImages({
            poster:poster,
            images:images,
        }))
    }, [poster,images]);

    return <Card className={'md:max-w-screen-md xl:max-w-screen-lg w-full'}>
        <h2>Pick your poster</h2>
        <div className={'grid grid-cols-1 md:grid-cols-5 gap-4 w-full'}>
            <div className={'md:col-span-2'} >
                <div className={'flex justify-between items-center py-0 mb-2'}>
                    <h3 className={'font-bold mb-0 text-nowrap'}>Main Image</h3>
                    <Upload className={''} multiple={false} onChange={handleChange} maxCount={1}
                            showUploadList={false}>
                        <Button icon={<UploadOutlined/>}>
                            Select Poster
                        </Button>
                    </Upload>
                </div>
                {(stay.poster === '') ? <div
                    className={'flex items-center justify-center border border-dashed border-primary rounded-xl w-full aspect-video object-cover'}>
                </div> : <Image className={'aspect-video rounded-xl object-cover'} src={stay.poster} alt=""/>}
            </div>
            <div className={'md:col-span-3'}>
                <UploadImagesComponent images={images} onImageListChange={(images) => {
                    setImages(images)
                    console.log(images)
                }}/>
            </div>
        </div>
    </Card>
}