import { ChangeEvent, CSSProperties, FC, useContext, useState } from 'react';
import '../App.less';

import ReadableContent from './ReadableContent';

import { Card, Input, message, Row, Col, Button } from 'antd';
import Paragraph from 'antd/lib/typography/Paragraph';
import Search from 'antd/lib/input/Search';
import { ExtractionResultContext, IExtractionResult, useExtractionResult } from './Contexts';
import TextArea from 'antd/lib/input/TextArea';



const IR_TOKEN_URL = "http://localhost:5000/getIRToken"

function ResultPage(props: IExtractionResult) {

    const d = props.meta
    //var summaryText = d.summaryText
    var summaryHTML = d.summary_sentences.join("<li>")
    var doc_language = d.language || "unknown"
    var doc_title = d.title || "unknown"
    var doc_authors = d.authors || "unknown"
    var doc_classification = d.source || "unknown"

    var doc_metadata = {
        num_pages: d.num_pages || "unknown",
        publication_year: d.publication_year || "unknown",

    }

    const cardStyle: CSSProperties = {
        height: "100%",
        border: "none"
    }






    return (
        <Row gutter={[24, 16]} style={{ height: '90%' }}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Card style={cardStyle}>
                    <ReadableContent title="Summary" paragraphs={d.summary_sentences} />
                </Card>
            </Col>

            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Card style={cardStyle}>
                    <p>Title: {doc_title}</p>
                    <p>Classification: {doc_classification}</p>
                    <p>Language: {doc_language}</p>
                    <p>Authors: {doc_authors}</p>
                </Card>
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <Card style={cardStyle}>
                    Trustscore..
                </Card>
            </Col>


        </Row>
    )


}

export default ResultPage