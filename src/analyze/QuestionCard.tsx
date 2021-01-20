import { FC } from 'react';
import '../App.less';

import { Card, Input } from 'antd';
import Paragraph from 'antd/lib/typography/Paragraph';
import Search from 'antd/lib/input/Search';


import { AudioOutlined } from '@ant-design/icons';

const cardStyle = {
    height: '100%'
};

const QuestionCard: FC = () => (
    <>
        <Card hoverable={true} style={cardStyle}>
            <Paragraph>
                I have some other questions about the MedJargonBuster program.
                </Paragraph>
            <Search
                placeholder="(Please type or speak your question...)"
                enterButton="Ask"
                size="large"
                suffix={<AudioOutlined style={{ fontSize: 16 }} />}
            />
        </Card>
    </>
)

export default QuestionCard