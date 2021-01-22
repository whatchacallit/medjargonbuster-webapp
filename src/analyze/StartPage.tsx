import React, { FC } from 'react';
import '../App.less';

import { Row, Col, PageHeader, } from 'antd';


import UploadCard from './UploadCard';
import UrlCard from './UrlCard';

import { useAnalysisContext } from './Contexts'


const avatarGreeting = "Welcome"
const avatarMessage = "Please show the the document you want to understand better"


const StartPage: FC = () => {
    const ctx = useAnalysisContext()

    console.log("StartPage context", ctx)

    return (
        <>

            <Row gutter={[24, 16]} style={{ height: '100%' }}>
                <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                    <UploadCard />
                </Col>
                <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                    <UrlCard />
                </Col>

            </Row>
        </>

    )
}


export default StartPage;