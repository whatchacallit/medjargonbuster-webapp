import { FC } from 'react';
import '../App.less';

import { Image, Row, Col } from 'antd';

import {
    Link
} from "react-router-dom";

const HomePage: FC = () => (
    <Row>
        <Col offset={6}>
            <Link to="/analyze">
                <Image preview={false} className="splashImage" src="splash.png" />
            </Link>


        </Col>
    </Row>
)

export default HomePage