import React, { FC } from 'react';
import '../App.less';

import { Row, Col, PageHeader, Spin, message } from 'antd';




const avatarGreeting = "Ok, let's see..."
const avatarMessage = "I'm reading your text, please wait..."


const AnalyzingSpinnerPage: FC = () => {
    return (
        <>
            <PageHeader
                style={{ 'textAlign': 'center' }}
                className="site-page-header"
                backIcon={false}
                avatar={{ src: '/img/avatar.png' }}
                title={avatarGreeting}
                subTitle={avatarMessage}
            />
            <Row gutter={[24, 16]} style={{ height: '100%' }}>
                <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                    <Spin size="large" style={{ margin: 'auto' }} />
                </Col>
            </Row>
        </>

    )
}

export default AnalyzingSpinnerPage;