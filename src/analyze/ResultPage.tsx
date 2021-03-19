import { CSSProperties } from 'react';
import '../App.less';


import { Card, Row, Col, Typography, Space, Statistic, Rate, Divider, Tabs, Radio } from 'antd';
import { useAnalysisContext } from './Contexts';
import moment from 'moment'

import ReadableContent from './ReadableContent';
import Paragraph from 'antd/lib/typography/Paragraph';


import {
    FilePdfOutlined, GlobalOutlined,
    SolutionOutlined, FileUnknownOutlined, TranslationOutlined, HighlightOutlined,
    MedicineBoxOutlined, LineChartOutlined, PartitionOutlined
} from '@ant-design/icons';

const { Text, Title, Link } = Typography;

const { TabPane } = Tabs


const IR_TOKEN_URL = "http://localhost:5000/getIRToken"

function ResultPage() {

    const ctx = useAnalysisContext()

    // shorten this a bit...
    const d = ctx.analysisResult.meta
    console.log("Result meta:", d)

    //var summaryText = d.summaryText
    var summaryHTML = d.summary_sentences.join("<li>")
    var doc_language = d.document_language || "en"
    var doc_title = d.title || "(No Title)"
    var doc_authors = Array(d.Author).join(", ") || "(Unknown Author)"
    var doc_classification = d.source || "unknown"
    var doc_extractor = d.extractor;
    var doc_type = d.document_type;


    //FIXME get this from backend
    var creation_date = moment(d["Creation-Date"]) || moment("2020-08-01 12:36", "YYYY-MM-DD hh:mm")
    var doc_create_date = creation_date.format('MMMM Do YYYY, hh:mm');
    var doc_create_age = creation_date.fromNow();

    var doc_num_pages = d.document_num_pages || "0";
    var doc_num_words = d.num_words;
    var doc_reading_time = (d['num_words'] / 180.0).toFixed(0)

    var doc_source_reference = d["description"] || "(unknown)";

    var doc_trust_score = 2.5
    var doc_readability = 1.7




    const cardStyle: CSSProperties = {
        height: "100%",
        border: "none"
    }
    const iconStyle: CSSProperties = {
        fontSize: '32px',
        textAlign: 'center',
        height: '100%',

    }

    const getIconForDocumentClassification = (d: any) => {
        if (d.source == 'document')
            return < FilePdfOutlined style={iconStyle} alt={"Document"} />

        if (d.source == 'web_article')
            return < GlobalOutlined style={iconStyle} alt={"web article"} />

        if (d.source == 'wikipedia')
            return < SolutionOutlined style={iconStyle} alt={"Wikipedia"} />

        return < FileUnknownOutlined style={iconStyle} alt={"Unknown"} />

    }






    return (
        <Row gutter={[24, 16]} style={{ height: '100%' }}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <Row gutter={[24, 16]}>
                    <Col span={24} style={{ textAlign: "center" }}>
                        <Title level={4} ellipsis>{doc_title}</Title>
                        <Paragraph ellipsis>
                            <Text type="secondary">by:</Text> <Text style={{ wordWrap: "break-word" }} >{doc_authors}</Text><p />
                            <Text type="secondary">published:</Text> <Text>{doc_create_date} ({doc_create_age})</Text><p />
                            <Text type="secondary">source:</Text> {doc_source_reference}<p />
                        </Paragraph>

                    </Col>
                </Row>
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <Tabs tabPosition="left">
                    <TabPane tab="Summary" key="summary">
                        <Row gutter={[24, 16]}>
                            <Col>
                                <ReadableContent title="Summary" paragraphs={d.summary_sentences} mark_chunks={d.common_noun_chunks} />
                            </Col>

                        </Row>
                    </TabPane>
                    <TabPane tab="Info" key="info">
                        <Card style={cardStyle}>
                            <Row gutter={[24, 16]}>
                                <Col span="12">
                                    <Statistic title="Trust score" prefix={<Rate disabled allowHalf defaultValue={doc_trust_score} />} value=" " />
                                </Col>
                                <Col span="12">
                                    <Statistic title="Text readability" prefix={<Rate disabled allowHalf defaultValue={doc_readability} />} value=" " />
                                </Col>

                                <Col span="12">
                                    <Statistic title="Document type" prefix={getIconForDocumentClassification(d)} value={d.source} />
                                </Col>
                                <Col span="12">
                                    <Statistic title="Original Language" prefix={<TranslationOutlined />} value={doc_language} />
                                </Col>
                            </Row>
                            <Row gutter={[24, 16]}>
                                <Col span="12">
                                    <Statistic title="Document length" prefix={<FileUnknownOutlined />} suffix="pages" value={doc_num_pages} />
                                </Col>
                                <Col span="12">
                                    <Statistic title="Estimated reading time" suffix={"minutes"} value={doc_reading_time} />
                                </Col>
                            </Row>
                            <Row gutter={[24, 16]}>
                                <Col span="12">
                                    <Statistic title="Text length" prefix={<HighlightOutlined />} suffix="words" value={doc_num_words} />
                                </Col>
                                <Col span="12">
                                    <Statistic title="More info" prefix={<Link href="#">Click here...</Link>} value=" " />
                                </Col>
                            </Row>

                        </Card>
                    </TabPane>

                    <TabPane tab="Topics and Concepts" key="topics">
                        <Card style={cardStyle} title="Key Topics and concepts">
                            <Row gutter={[24, 16]}>
                                <Col span="8">
                                    <Space direction="vertical">
                                        <MedicineBoxOutlined style={iconStyle} /> Medication
                                <Divider />
                                        { }
                                    </Space>
                                </Col>
                                <Col span="8">
                                    <Space direction="vertical">
                                        <LineChartOutlined style={iconStyle} /> Threatments
                                <Divider />
                                        { }
                                    </Space>

                                </Col>
                                <Col span="8">
                                    <Space direction="vertical">
                                        <PartitionOutlined style={iconStyle} /> Body Parts
                                    </Space>

                                </Col>
                            </Row>

                        </Card>
                    </TabPane>
                    <TabPane tab="Further reading" key="resources">
                        <Card style={cardStyle} title="Further reading">
                            <Row gutter={[24, 16]}>
                                <Col span="24">
                                    TBD
                        </Col>
                            </Row>
                        </Card>

                    </TabPane>

                </Tabs>
            </Col>



            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            </Col>


        </Row>
    )


}

export default ResultPage