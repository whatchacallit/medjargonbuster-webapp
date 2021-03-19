import React, { FC, useEffect, useState } from 'react';
import '../App.less';

import { Button, Divider, message, PageHeader, Steps } from 'antd';
import {
    HomeOutlined,
    FileTextTwoTone,
    HourglassTwoTone,
    HeartTwoTone,
    SettingTwoTone,
    ProfileTwoTone,
    QuestionCircleTwoTone,
    CompassTwoTone,

} from '@ant-design/icons';

import Paragraph from 'antd/lib/typography/Paragraph';


import { BrowserRouter as Router, Route, Switch, useHistory, useLocation } from 'react-router-dom';

import { AnalysisContext, IAnalysisOptions, IPipelineResult } from './Contexts';

import StartPage from './StartPage';
import AnalyzingSpinnerPage from './AnalyzingSpinnerPage';
import ResultPage from './ResultPage';


const { Step } = Steps




/**
 * routes corresponding to steps in the process
 */
const ROUTES = {
    start: "/analyze",
    analyzing: "/analyze/loading",
    done: "/analyze/results",
    error: "/analyze/error"
}

const API_BASE_URL = "http://localhost:5000"

const EXTRACT_TEXT_ENDPOINT_URL = `${API_BASE_URL}/extract`
const RUN_PIPELINE_ENDPOINT_URL = `${API_BASE_URL}/pipeline/default`



const AnalyzePage: FC = () => {
    const [extractionResult, setExtractionResult] = React.useState<IPipelineResult>({})
    const [analysisResult, setAnalysisResult] = React.useState<IPipelineResult>({})
    const [isExtracting, setExtracting] = useState(false)
    const [isAnalyzing, setAnalyzing] = useState(false)
    const [hasResult, setHasResult] = useState(false)
    const [hasError, setHasError] = useState(false)

    const defaultOptions: IAnalysisOptions = {
        autoTranslate: true,
        autoTranslateLanguage: "de-CH",

    }
    const [options, setOptions] = useState(defaultOptions) // TODO localstorage / Cookie ?

    const [currentStep, setCurrentStep] = useState(0)


    let location = useLocation()


    /** 
     * This hook is triggered whenever the "location" changes (e.g. by history.push) via the router.
     * (extraction results are set by the child components that call the "extract" API endpoint)
     */
    useEffect(() => {
        //console.log("location changed", location)
        //console.log("Current step is ", currentStep)
    }, [location])


    /**
     * If we have an extraction result ready, start the Analysis
     */
    useEffect(() => {
        console.log("Some result changed...")
        if (extractionResult.text && !analysisResult.text && !hasError) {
            console.log("Received extraction result, starting Analysis...")
            setCurrentStep(1)
            startAnalysis(extractionResult);
        }
        else if (analysisResult.text && !hasError) {
            console.log("Received analysis result, showing results...")
            setCurrentStep(2)
        }


    }, [extractionResult, analysisResult]);





    /**
     * Clears the context and starts over
     */
    const back_to_start = () => {


        setAnalysisResult({})
        setExtractionResult({})
        setExtracting(false)
        setAnalyzing(false)
        setHasResult(false)
        setHasError(false)

        setCurrentStep(0)

    }




    /**
     * Starts the analysis by calling the backend.
     * 
     * 
     * @param extractionResult 
     */
    const startAnalysis = async (extractionResult: IPipelineResult) => {
        setAnalyzing(true)
        setCurrentStep(1)

        const pipelineExecutionRequest = {
            "text": extractionResult.text,
            "meta": extractionResult.meta,
            "settings": { "disable": ["ner"] }
        }

        //console.log("Starting analysis of extracted text", extractionResult.text, extractionResult.meta)
        const options = {
            method: "POST",
            body: JSON.stringify(pipelineExecutionRequest),
            headers: {
                "accept": "application/json"
            }
        }

        const response = await fetch(RUN_PIPELINE_ENDPOINT_URL, options);
        if (response.status >= 200 && response.status <= 299) {
            const jsonResponse = await response.json();
            //message.success(`Text Analysis was successfully...`);
            setAnalysisResult({
                meta: jsonResponse['meta'],
                text: jsonResponse['text']
            })
            setAnalyzing(false)
            setHasResult(true)
            setCurrentStep(2)


        } else {
            message.success(`There was an Error...`);
            console.log("Error while analyzing: ", response.status, response.statusText)
            setAnalyzing(false)
            setHasResult(false)
            setHasError(true)
            setCurrentStep(0)

        }
    }



    // body depends on the step
    let body = null;

    // TODO I tried with react router, but had more issues than benefit. 
    // Is there a better way? 
    switch (currentStep) {
        case 0: body = <StartPage />; break;
        case 1: body = <AnalyzingSpinnerPage />; break;
        case 2: body = <ResultPage />; break;
        default: body = <StartPage />
    }

    const getStepStatus = (step: number) => {
        // error, finish, process, wait
        if (step < currentStep) {
            return "finish"
        }
        if (step == currentStep) {
            return "process"
        }
        if (step > currentStep) {
            return "wait"
        }

    }

    const avatarTitle = [
        "Hi Florian",
        "Ok, let's see...",
        "Here's what I got "
    ]

    const avatarSubTitle = [
        "can I help you understand some medical jargon?",
        "I'm analyzing the document for you, please wait",
        "Let me know if you have more questions"
    ]

    const stepTitles = [
        "Original",
        "MedJargonBuster",
        "Summary"
    ]


    return (
        <AnalysisContext.Provider value={{
            extractionResult, setExtractionResult, analysisResult, setAnalysisResult,
            isExtracting, setExtracting, isAnalyzing, setAnalyzing,
            hasError, setHasError, hasResult, setHasResult, options, setOptions
        }}>

            <div style={{ height: '100%', alignContent: "center", padding: "5px" }}>

                <Steps style={{ paddingBottom: 30 }} direction="horizontal" size="default" current={currentStep}>
                    <Step status={getStepStatus(0)} title={stepTitles[0]} icon={<FileTextTwoTone twoToneColor="#2ab88f" />} />
                    <Step status={getStepStatus(1)} title={stepTitles[1]} icon={<CompassTwoTone twoToneColor="#2ab88f" spin={isAnalyzing} />} />
                    <Step status={getStepStatus(2)} title={stepTitles[2]} icon={<ProfileTwoTone twoToneColor="#2ab88f" />} />
                </Steps>


                <PageHeader
                    style={{ textAlign: 'center' }}
                    className="site-page-header"

                    avatar={{ src: '/img/avatar.png', shape: "circle" }}
                    title={avatarTitle[currentStep]}
                    subTitle={avatarSubTitle[currentStep]}
                    extra={[
                        <Button onClick={back_to_start}><HomeOutlined /></Button>,
                    ]}
                />

                <Divider type="horizontal" style={{ paddingBottom: 30 }}></Divider>







                {body}


            </div >
        </AnalysisContext.Provider>

    )
}


export default AnalyzePage