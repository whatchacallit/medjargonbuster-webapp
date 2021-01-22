import { CSSProperties } from 'react';

import { Card, Input, Button, Typography, Switch } from 'antd';

import { useAnalysisContext } from './Contexts';
import '../App.less';

import { TranslationOutlined } from '@ant-design/icons';

// ES module
//import Editor from 'react-medium-editor';

import ReactMarkdown from 'react-markdown'
//import { render } from 'react-dom'
import gfm from 'remark-gfm'



//const { Paragraph } = Typography;
//const { Search, TextArea } = Input;



const IR_TOKEN_URL = "http://localhost:5000/getIRToken"


/**
 * 
 * @param props.paragraphs: [str]
 * @param props.title : str
 * 
 */
function ReadableContent(props: any) {
    const ctx = useAnalysisContext()

    const immersiveReaderButtonStyle: CSSProperties = {
        //float: "right",
        marginRight: 20
    }
    const cardStyle: CSSProperties = {
        height: "100%"
    }

    var translateToLanguage = ctx.options.autoTranslateLanguage
    var originalLanguage = ctx.analysisResult.meta['language'] || "en-US"

    var contentParagraphs = props.paragraphs || ["Unfortunatly, this text is unavailable"]

    // FIXME maybe use multiple "chunks" ?
    var markdownSource = "* " + contentParagraphs.join("\n* ")
    var chunks = [{
        content: contentParagraphs.join("\n\n"),
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
    const irOptions = {
        "onExit": exitCallback,
        "uiZIndex": 2000,
        "uiLang": translateToLanguage || "en-US",
        "readAloudOptions": {
            voice: "Female",
            speed: 1.0,
            autoPlay: true,

        },
        "translationOptions": {
            language: translateToLanguage || "en-US",
            autoEnableDocumentTranslation: ctx.options.autoTranslate
        },
        "displayOptions": {
            textSize: 20
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

                // FIXME clean way to get object from, this just grabs from global scope (script loaded inside index.html)
                const ImmersiveReader: any = Object(window)['ImmersiveReader']

                ImmersiveReader.launchAsync(token, subdomain, data, irOptions)
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

    const toggleAutotranslate = () => {
        ctx.setOptions(Object.assign({}, ctx.options, { autoTranslate: !ctx.options.autoTranslate }))

    }

    let btnOpenIR = (<Button key={1} size="small" onClick={launchReader} style={immersiveReaderButtonStyle}>
        Immersive Reader <TranslationOutlined />
    </Button>)

    let switchAutoTranslate = (<Switch size="small" title="Translate"
        onClick={toggleAutotranslate}
        checked={ctx.options.autoTranslate}
        unCheckedChildren={originalLanguage.substr(0, 2)}
        checkedChildren={String(translateToLanguage).substr(0, 2)} />)

    return (
        <>
            <Card title={props.title} extra={[btnOpenIR, switchAutoTranslate]}>

                <ReactMarkdown plugins={[gfm]} children={markdownSource} />


            </Card>
        </>
    )
}
export default ReadableContent;

