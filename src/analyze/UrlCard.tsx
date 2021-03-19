import '../App.less';

import { Card, message } from 'antd';
import Paragraph from 'antd/lib/typography/Paragraph';
import Search from 'antd/lib/input/Search';
import { useAnalysisContext } from './Contexts';
import AnchorLink from 'antd/lib/anchor/AnchorLink';

const cardStyle = {
    height: '100%'
};


const EXTRACT_URL_ENDPOINT_URL = "http://localhost:5000/extract"



function UrlCard() {

    const ctx = useAnalysisContext()


    const extractFromUrl = (value: string) => {
        ctx.setExtracting(true);


        const options = {
            method: "GET",
            headers: {
                "accept": "application/json"
            }
        }

        fetch(EXTRACT_URL_ENDPOINT_URL + "?url=" + value, options)
            .then(response => response.json())
            .then(json => {
                ctx.setExtracting(false);

                //message.success(`Url loaded successfully`);

                ctx.setExtractionResult({
                    meta: json['meta'],
                    text: json['text']
                })
                console.log(json)
            })


    }




    return (<>
        <Card hoverable={true} style={cardStyle}>
            <Paragraph>
                Analyze some public health information from the internet.
                For example, a news article,blog, research document
                </Paragraph>
            <Search
                loading={ctx.isExtracting}
                placeholder="URL"
                enterButton="Analyze"
                onSearch={extractFromUrl}
                size="large"
            />
            e.g.
            <Paragraph type="secondary" copyable={true} >https://www.newswise.com/articles/breast-cancer-screening-by-age-40-or-younger-for-black-women-advise-beaumont-researchers</Paragraph>
        </Card>
    </>
    )
}

export default UrlCard