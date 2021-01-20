import { ChangeEvent, FC, useContext, useState } from 'react';
import '../App.less';

import { Card, Input, message } from 'antd';
import Paragraph from 'antd/lib/typography/Paragraph';
import Search from 'antd/lib/input/Search';
import { ExtractionResultContext, useExtractionResult } from './Contexts';

const cardStyle = {
    height: '100%'
};


const EXTRACT_URL_ENDPOINT_URL = "http://localhost:5000/extract"



function UrlCard() {
    const extractFromUrl = (value: string) => {
        setLoading(true)

        const options = {
            method: "GET",
            headers: {
                "accept": "application/json"
            }
        }

        fetch(EXTRACT_URL_ENDPOINT_URL + "?url=" + value, options)
            .then(response => response.json())
            .then(json => {
                setLoading(false)
                message.success(`Url loaded successfully`);

                setExtractionResult({ meta: json['meta'], text: json['text'] })
                console.log(json)
            })


    }

    const [is_loading, setLoading] = useState(false);
    const { extractionResult, setExtractionResult } = useExtractionResult()



    return (<>
        <Card hoverable={true} style={cardStyle}>
            <Paragraph>
                Analyze some public health information from the internet.
                For example, a news article,blog, research document
                </Paragraph>
            <Search
                loading={is_loading}
                placeholder="URL"
                enterButton="Analyze"
                onSearch={extractFromUrl}
                size="large"
            />
        </Card>
    </>
    )
}

export default UrlCard