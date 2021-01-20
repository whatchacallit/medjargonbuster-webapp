import { FC, useState } from 'react';
import '../App.less';

import { Card, Input, Upload, message } from 'antd';

import { UploadOutlined } from '@ant-design/icons';
import Paragraph from 'antd/lib/typography/Paragraph';
import { UploadChangeParam, UploadProps } from 'antd/lib/upload';
import { useExtractionResult } from './Contexts';

const { Dragger } = Upload;


const EXTRACT_UPLOAD_ENDPOINT_URL = "http://localhost:5000/extract/upload"



const cardStyle = {
    height: '100%'

};

const UploadCard: FC = () => {
    const { extractionResult, setExtractionResult } = useExtractionResult()
    const [is_loading, setLoading] = useState(false)


    const uploadProps = {
        name: 'file',
        multiple: false,

        action: EXTRACT_UPLOAD_ENDPOINT_URL,
        onChange(info: UploadChangeParam) {
            const { status } = info.file;

            if (status !== 'uploading') {
                setLoading(true)

                //console.log("Uploading", info.file, info.fileList);
            }
            if (status === 'done') {
                setLoading(false)
                message.success(`${info.file.name} file uploaded successfully.`);
                //console.log("Done: ", info)
                setExtractionResult({
                    text: info.file.response.text,
                    meta: info.file.response.meta
                })


            } else if (status === 'error') {
                setLoading(false)
                message.error(`${info.file.name} file upload failed.`);
            }
        },
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
                        max. 1 MB, e.g. pdf, jpeg, png, doc/docx, ppt, ...</p>


                </Dragger>

            </Card>

        </>
    )
}

export default UploadCard