import { ChangeEvent, CSSProperties, FC, useContext, useState } from 'react';

import { Card, Input, message, Row, Col, Button, Typography } from 'antd';

import { ExtractionResultContext, IExtractionResult, useExtractionResult } from './Contexts';
import '../App.less';

// ES module
//import Editor from 'react-medium-editor';

import ReactMarkdown from 'react-markdown'
import { render } from 'react-dom'
import gfm from 'remark-gfm'



const { Paragraph } = Typography;
const { Search, TextArea } = Input;



const IR_TOKEN_URL = "http://localhost:5000/getIRToken"


/**
 * 
 * @param props.paragraphs: [str]
 * @param props.title : str
 * 
 */
function ReadableContent(props: any) {

    const immersiveReaderButtonStyle = {
        backgroundColor: "white",
        marginTop: "5px",
        border: "1px solid black",
        float: "right"
    }
    const cardStyle: CSSProperties = {
        height: "100%"
    }

    var translateToLanguage = "de-CH"
    var contentParagraphs = props.paragraphs || ["Unfortunatly, this text is unavailable"]

    // FIXME maybe use multiple "chunks" ?
    var markdownSource = "* " + contentParagraphs.join("\n* ")
    var chunks = [{
        content: markdownSource,
        mimeType: "text/html"
    }]
    //console.log("chunks", chunks);

    /** Data sent to the Immersive reader */
    // MIME types https://docs.microsoft.com/azure/cognitive-services/immersive-reader/reference#chunk
    const data = {
        title: props.title || "Summary",
        chunks: chunks
    };
    /** Options sent to the Immersive reader */
    // https://docs.microsoft.com/azure/cognitive-services/immersive-reader/reference#options
    const options = {
        "onExit": exitCallback,
        "uiZIndex": 2000,
        "uiLang": "en",
        "readAloudOptions": {
            autoplay: true

        },
        "translationOptions": {
            language: translateToLanguage,
            autoEnableDocumentTranslation: true
        },
        "displayOptions": {
            textSize: 36
        }
    };



    /**
     * Request token / subdomain for Immersive Reader
     */
    function getTokenAndSubdomainAsync() {
        const options = {
            method: "GET",
            headers: {
                "accept": "application/json"
            }
        }
        return new Promise((resolve, reject) => {
            fetch(IR_TOKEN_URL, options)
                .then(response => response.json())
                .then(json => {
                    console.log("IR token", json)
                    resolve(json)

                })
                .catch(e => {
                    console.log(e)
                    reject(e)
                })

        });
    }

    /**
     * This launches the Immersive Reader in an iframe ("fullscreen" overlay).
     * 'ImmersiveReader' is a global (window.xxx) object loaded in index.hhtml.  
     */
    function launchReader() {
        getTokenAndSubdomainAsync()
            .then(function (response: any) {
                const token = response["token"];
                const subdomain = response["subdomain"];

                // FIXME clean way to get object from, this just grabs from global scope (script inside index.html)
                const ImmersiveReader: any = Object(window)['ImmersiveReader']

                ImmersiveReader.launchAsync(token, subdomain, data, options)
                    .catch(function (error: any) {
                        alert("We're sorry, something went wrong starting the Immersive Reader.");
                        console.log(error);
                    });

            })
            .catch(function (error) {
                alert("An error occured while requesting the Immersive Reader credentials from our API.");
                console.log(error);
            });
    }

    function exitCallback() {
        console.log("Immersive reader closed");
        /**
         * TODO cleanup
         */
    }



    return (
        <>
            <Card title={props.title}>

                <ReactMarkdown plugins={[gfm]} children={markdownSource} />

                <Button onClick={launchReader} className="immersive-reader-button">
                    Read &amp; Translate
                </Button>
            </Card>
        </>
    )
}
export default ReadableContent;

