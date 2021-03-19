import React, { FC } from 'react';
import '../App.less';

import { Row, Col, PageHeader, Spin, message } from 'antd';





const AnalyzingSpinnerPage: FC = () => {
    return (
        <>

            <Row gutter={[24, 16]} style={{ height: '100%' }}>
                <Col style={{ 'textAlign': 'center', paddingTop: 100 }} xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Spin size="large" style={{ margin: 'auto' }} />
                </Col>
            </Row>
        </>

    )
}

export default AnalyzingSpinnerPage;