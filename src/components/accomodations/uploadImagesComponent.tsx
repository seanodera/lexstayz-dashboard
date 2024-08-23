'use client'
import React, { useState, useEffect } from 'react';
import {DeleteOutlined, PlusOutlined} from '@ant-design/icons';
import {Button, Image, Switch, Upload} from 'antd';
import type { UploadFile } from 'antd';

const getBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

const UploadImagesComponent = ({ onImageListChange, images = [] }: { images?: string[], onImageListChange: (images: string[]) => void }) => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [directory, setDirectory] = useState(true);

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as File);
        }
        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleChange = ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
        setFileList(newFileList);
        const imageUrls = newFileList.map(file => file.url || URL.createObjectURL(file.originFileObj as File));
        onImageListChange(imageUrls);
    };

    useEffect(() => {
        const initialFiles:any[] = images.map((url) => ({
            uid: url,
            name: url,
            status: 'done',
            url,
        }));
        setFileList(initialFiles);
    }, [images]);

    const uploadButton = (
        <div style={{ border: 0, background: 'none', textAlign: 'center', width: '100%' }}>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    return (
        <div className="py-4">
            <div className="flex justify-between items-center">
                <h3 className="font-bold">Other Images</h3>
                <span className="flex gap-2 items-center">
                    <h3 className="text-gray-500 font-medium mb-0">Folder Mode</h3>
                    <Switch defaultChecked onChange={setDirectory} checked={directory} />
                </span>
            </div>
            <Upload
                listType="picture-card"
                maxCount={20}
                multiple
                onPreview={handlePreview}
                onChange={handleChange}
                fileList={fileList}
                directory={directory}
                itemRender={(originNode, file, fileList,actions) => {

                    // return <img src={file.url} alt={file.name} className={'aspect-video max-w-sm w-full object-cover col-span-2'}/>
                   return <div className={'aspect-video max-w-sm w-full bg-cover col-span-2 group'} style={{
                       backgroundImage: 'url("'+file.url+'")',
                   }}><div className={'hidden group-hover:flex bg-dark bg-opacity-45 justify-evenly items-center w-full h-full'}>
                       <Button type={'primary'} danger icon={<DeleteOutlined />} onClick={() => actions.remove()}/>
                   </div></div>;
                }}
            >
                {fileList.length >= 20 ? null : uploadButton}
            </Upload>
            {previewImage && (
                <Image
                    className="object-cover"
                    wrapperStyle={{ display: 'none' }}
                    preview={{
                        visible: previewOpen,
                        onVisibleChange: (visible) => setPreviewOpen(visible),
                        afterOpenChange: (visible) => !visible && setPreviewImage(''),
                    }}
                    src={previewImage}
                    style={{ aspectRatio: '16/9' }}
                />
            )}
        </div>
    );
};

export default UploadImagesComponent;
