import React, { FC } from 'react';
import '../App.less';

import { Card, Image, Avatar, Space, Upload, Row, Col, PageHeader, Spin, message, Steps } from 'antd';

import { BrowserRouter as Router, Route, Switch, Link, useHistory } from 'react-router-dom';

import { ExtractionResultContext, IExtractionContextType, IExtractionResult } from './Contexts';

import StartPage from './StartPage';
import AnalyzingSpinnerPage from './AnalyzingSpinnerPage';
import ResultPage from './ResultPage';

const { Step } = Steps




/**
 * routes corresponding to steps in the process
 */
const ROUTES = {
    start: "/analyze",
    analysing: "/analyze/loading",
    done: "/analyze/results",
    error: "/analyze/error"
}


const RUN_PIPELINE_ENDPOINT_URL = "http://localhost:5000/pipeline/default"



const AnalyzePage: FC = () => {
    const [extractionResult, setExtractionResult] = React.useState<IExtractionResult>({})
    const [analysisResult, setAnalysisResult] = React.useState<IExtractionResult>({})
    const history = useHistory() // used for navigation using react router


    /**
     * Clears the context and starts over
     */
    const back_to_start = () => {
        setAnalysisResult({})
        setExtractionResult({})
        history.push(ROUTES.start)
    }

    /**
     * Returns index of the current "step":
     * 0 = Start
     * 1 = Analyzing (spinner)
     * 2 = Result
     */
    const getCurrentStep = () => {
        console.log("history", history)
        return 0
    }


    /**
     * Starts the analysis by calling the backend. 
     * 
     * @param extractionResult 
     */
    const startAnalysis = (extractionResult: IExtractionResult) => {
        const pipelineExecutionRequest = {
            "text": extractionResult.text,
            "meta": extractionResult.meta,
            //"settings": { "disable": [] }
        }

        console.log("Starting analysis of extracted text", extractionResult.text, extractionResult.meta)
        const options = {
            method: "POST",
            body: JSON.stringify(pipelineExecutionRequest),
            headers: {
                "accept": "application/json"
            }
        }
        history.push(ROUTES.analysing)

        fetch(RUN_PIPELINE_ENDPOINT_URL, options)
            .then(response => response.json())
            .then(json => {
                message.success(`Text Analysis was successfully...`);

                setAnalysisResult({ meta: json['meta'], text: json['text'] })
                history.push(ROUTES.done)


                console.log("Analysis successful: ", json)
            })


    }





    return (
        <ExtractionResultContext.Provider value={{ extractionResult, setExtractionResult }}>

            <div style={{ height: '100%', alignContent: "center" }}>
                <Steps style={{ padding: 12 }} progressDot direction="horizontal" size="default" current={getCurrentStep()}>
                    <Step title="Provide a document" description="" />
                    <Step title="Run Text Analysis" description="" />
                    <Step title="Review Results" description="" />
                </Steps>



                <Router>
                    <Switch>
                        <Route exact path="/analyze">
                            <StartPage />
                        </Route>

                        <Route exact path="/analyze/loading">
                            <AnalyzingSpinnerPage />
                        </Route>

                        <Route exact path="/analyze/result">
                            <ResultPage {...analysisResult} />
                        </Route>



                    </Switch>
                </Router>


            </div >
        </ExtractionResultContext.Provider>

    )
}


export default AnalyzePage