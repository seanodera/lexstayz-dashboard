'use client'
import React, {useEffect, useState} from 'react';
import {PlusOutlined} from '@ant-design/icons';
import {Image, Switch, Upload} from 'antd';
import type {GetProp, UploadFile, UploadProps} from 'antd';
import {createFile} from "@/lib/utils";

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

const UploadImagesComponent = ({onImageListChange, images}: {images?: string[], onImageListChange: (images: string[]) => void }) => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState<Array<File>>([]);
    const [imageList, setImageList] = useState<string[]>([]);
    const [directory, setDirectory] = useState<boolean>(true);

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleChange = (newFileList: any) => {
       setFileList(newFileList)
    }
    useEffect(() => {
        if (images){
            images.forEach((image) => {
                createFile({url: image}).then((file) => {
                    fileList.push(file);
                })
            })
        }
    })
    useEffect(() => {
        let data: string[] = [];
        fileList.forEach((file) => {
            data.push(URL.createObjectURL(file));
        })
        setImageList(data);
        onImageListChange(data);
    }, [fileList])

    const uploadButton = (
        <button style={{border: 0, background: 'none'}} type="button">
            <PlusOutlined/>
            <div style={{marginTop: 8}}>Upload</div>
        </button>
    );
    return (
        <div className={'py-4'}>
            <div className={'flex justify-between items-center'}>
                <h3 className={'font-bold'}>Other Images</h3>
                <span className={'flex gap-2 items-center'}>
                    <h3 className={'text-gray-500 font-medium mb-0'}>Folder Mode</h3>
                    <Switch defaultChecked onChange={(value) => setDirectory(value)} checked={directory}/>
                </span>
            </div>
            <Upload
                listType="picture-card"
                maxCount={20}
                multiple={true}
                onPreview={handlePreview}
                beforeUpload={(value, files) => setFileList(files)}
                directory={directory}
            >
                {fileList.length >= 20 ? null : uploadButton}
            </Upload>
            {previewImage && (
                <Image
                    className={'object-cover'}
                    wrapperStyle={{display: 'none'}}
                    preview={{
                        visible: previewOpen,
                        onVisibleChange: (visible) => setPreviewOpen(visible),
                        afterOpenChange: (visible) => !visible && setPreviewImage(''),
                    }}
                    src={previewImage}
                />
            )}
        </div>
    );
};

export default UploadImagesComponent;