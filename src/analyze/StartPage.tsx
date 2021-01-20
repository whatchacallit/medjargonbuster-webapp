import React, { FC } from 'react';
import '../App.less';

import { Card, Image, Avatar, Space, Upload, Row, Col, PageHeader, Spin, message, Steps } from 'antd';


import { ExtractionResultContext, IExtractionContextType, IExtractionResult } from './Contexts';
import UploadCard from './UploadCard';
import UrlCard from './UrlCard';
import ResultPage from './ResultPage';


const avatarGreeting = "Welcome"
const avatarMessage = "how can I help you?"


const StartPage: FC = (props: any) => {
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
                    <UploadCard {...props} />
                </Col>
                <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                    <UrlCard {...props} />
                </Col>

            </Row>
        </>

    )
}


export default StartPage;