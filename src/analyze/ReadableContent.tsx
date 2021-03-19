import { BaseSyntheticEvent, CSSProperties, SyntheticEvent, useEffect, useState } from 'react';

import { Card, Input, Button, Typography, Switch, Affix, Space, Popover } from 'antd';

import { useAnalysisContext } from './Contexts';
import '../App.less';

import { TranslationOutlined } from '@ant-design/icons';

// ES module
//import Editor from 'react-medium-editor';

import ReactMarkdown from 'react-markdown'
import { renderToStaticMarkup } from 'react-dom/server'
import gfm from 'remark-gfm'
import Text from 'antd/lib/typography/Text';
import DefinitionPopover from './DefinitionPopover';




const { Paragraph, Link } = Typography;
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

    const [selectedText, setSelectedText] = useState<string>("")



    // Reference to div wrapping the markdown component. Used for Affix positioning etc,
    const [summaryContainer, setSummaryContainer] = useState<HTMLDivElement | null>(null)



    var translateToLanguage = ctx.options.autoTranslateLanguage
    var originalLanguage = ctx.analysisResult.meta['language'] || "en-US"

    var contentParagraphs = props.paragraphs || ["Unfortunatly, this text is unavailable"]

    // FIXME maybe use multiple "chunks" ?
    var markdownSource = "* " + contentParagraphs.join("\n* ")
    if (props.mark_chunks) {
        console.log("Mark chunks: ", props.mark_chunks)
        for (var c in props.mark_chunks) {
            var text = props.mark_chunks[c][0]
            markdownSource = markdownSource.replace(text, "[" + text + "](#)")
            //console.log(markdownSource)
        }
    }
    const renderers = {
        link: (link: any) => {
            //console.log(link)
            return <Text mark>{link.node.children[0].value}</Text>
        }
    }

    // Render markdown to html (for immersive reader)
    var htmlContent = renderToStaticMarkup(<ReactMarkdown renderers={renderers} plugins={[gfm]} children={markdownSource} />)
    //console.log("htmlContent", htmlContent)

    var chunks = [{
        content: htmlContent,
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
        // update with new options object, with autoTranslate toggled
        ctx.setOptions(Object.assign({}, ctx.options, { autoTranslate: !ctx.options.autoTranslate }))

    }

    let btnOpenIR = (<Button key={1} size="small" onClick={launchReader} type="primary" ghost>
        Immersive Reader <TranslationOutlined />
    </Button>)

    let switchAutoTranslate = (<Switch size="small" title="Translate"
        onClick={toggleAutotranslate}
        checked={ctx.options.autoTranslate}
        unCheckedChildren={originalLanguage.substr(0, 2)}
        checkedChildren={String(translateToLanguage).substr(0, 2)} />)





    /**
     * After a touch / mouse up event, check if we have some selected text.
     * If so, display the "Dictionary lookup" popover
     * @param evt 
     */
    const handleDictionaryLookup = (evt: any) => {
        try {
            var selectedText = String(evt.view.getSelection().getRangeAt(0).cloneContents().textContent).trim();
            if (selectedText != "") {
                console.log("Selected text:", selectedText)

                setSelectedText(selectedText)
            }
            else {
                console.log("No text selected", selectedText)
                setSelectedText("")

            }
        }
        catch (e) {
            setSelectedText("")
            console.log(e)
        }

    }

    return (
        <>
            <DefinitionPopover lookupText={selectedText} visible={selectedText != ""}>
                <Card bordered={false} headStyle={{ padding: 0 }} onTouchEnd={handleDictionaryLookup} onMouseUp={handleDictionaryLookup}>
                    <Affix style={{ position: 'absolute', bottom: 15, right: 40 }} target={() => summaryContainer} >
                        <Space>{btnOpenIR}
                            {switchAutoTranslate}</Space>
                    </Affix>
                    <div ref={setSummaryContainer} style={{ padding: 0, margin: 0 }}>
                        <ReactMarkdown plugins={[gfm]} allowDangerousHtml children={htmlContent} />
                    </div>


                </Card>
            </DefinitionPopover>
        </>
    )
}
export default ReadableContent;

