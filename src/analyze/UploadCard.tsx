import { FC, useState } from 'react';
import '../App.less';

import { Card, Upload, message } from 'antd';
import { UploadChangeParam, UploadProps } from 'antd/lib/upload';

import Paragraph from 'antd/lib/typography/Paragraph';
import { UploadOutlined } from '@ant-design/icons';

import { useAnalysisContext } from './Contexts';


const { Dragger } = Upload;


const EXTRACT_UPLOAD_ENDPOINT_URL = "http://localhost:5000/extract/upload"



const cardStyle = {
    height: '100%'

};


const UploadCard: FC = () => {

    const ctx = useAnalysisContext()


    const onUploadProgress = (info: UploadChangeParam) => {
        const { status } = info.file;

        if (status !== 'uploading') {
            ctx.setExtracting(true)


            //console.log("Uploading", info.file, info.fileList);
        }
        if (status === 'done') {
            ctx.setExtracting(false)
            ctx.setExtractionResult({
                text: info.file.response.text,
                meta: info.file.response.meta
            })

            //message.success(`${info.file.name} file uploaded successfully.`);



        } else if (status === 'error') {
            ctx.setExtracting(false)
            ctx.setHasError(true)

            message.error(`${info.file.name} file upload failed.`);
        }
    }



    /**
     * see https://ant.design/components/upload/#API
     */
    const uploadProps = {
        name: 'file',
        multiple: false,
        maxCount: 1,
        action: EXTRACT_UPLOAD_ENDPOINT_URL,
        onChange: onUploadProgress
    };

    return (
        <>
            <Card hoverable={true} style={cardStyle}>
                <Paragraph>
                    Upload a scan or photo of a medical report or other text.
                 </Paragraph>

                <Dragger {...uploadProps}>
                    <p className="ant-upload-drag-icon">
                        <UploadOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag a file to this area to upload</p>
                    <p className="ant-upload-hint">
                        max. 1 MB. e.g. pdf, jpeg, png, doc/docx, ppt, ...</p>


                </Dragger>

            </Card>

        </>
    )
}

export default UploadCard