import { useEffect, useState, createRef } from 'react';
import { useRequest } from 'ahooks';

import { Card, Input, Button, Typography, Switch, Affix, Space, Popover, Skeleton, Comment, Avatar } from 'antd';

import { useAnalysisContext } from './Contexts';
import '../App.less';

import { TranslationOutlined } from '@ant-design/icons';


const { Paragraph, Text } = Typography


function DefinitionPopover(props: any) {
    const ctx = useAnalysisContext()

    const [data, setData] = useState<object | null>(null)


    const lookupText = props.lookupText;


    const getDefinitionFromAPI = (): Promise<object> => {
        return new Promise(async (resolve) => {

            const term = lookupText
            console.log("Looking up definition of ", term)
            if (term != "") {

                var response = await fetch("http://localhost:5000/definition?term=" + term)
                console.log(response)
                var json = await response.json()
                console.log(json)

                resolve(json)
            }


        })
    }

    const { loading, run } = useRequest(getDefinitionFromAPI,
        {
            manual: true,

            onSuccess: (result, params) => {
                console.log("onSuccess", result, params)
                setData(result)
            }
        });


    const getDefinitionContent = (definitionData: any) => {
        console.log(definitionData)
        if (definitionData && definitionData.definitions && typeof definitionData.definitions[0] === 'object') {
            var first = definitionData.definitions[0]
            var shortdef = first.shortdef.join("")
            var phoneticString = "/" + first.hwi.hw + "/"
            var termSource = first.meta.src;
            var stems = first.meta.stems.join (", ")
    
    
    
            return (
                <Paragraph ellipsis>
                    <Space direction="vertical" size="small"  style={{maxWidth: '400px', wordWrap: 'break-word'}}>
                       <Text mark>{phoneticString}</Text>
                        <Text type="secondary">{stems} ({termSource})</Text>
                        <Text strong style={{wordWrap: 'break-word'}}>{shortdef}</Text>

                    </Space>
                </Paragraph>
    
            )
    
        }
        else {
            return (<Paragraph>Sorry, I couldn't find a definition for '{props.lookupText}'</Paragraph>)
        }

    }

    const getPopoverContent = () => {


        // if we render "invisible", clear the data
        if (!props.visible) {
            setData(null)
            return (<></>);
        }

        // return loading skeleton, if we're already loading
        if (loading) {
            return (
                <Skeleton active >
                </Skeleton>
            )

        }

        // visible, but not already loading? Trigger the request
        if (!data) {
            run()
        }

        // visible, not loading
        if (data) {
            return (
                <Comment
                    style={{maxWidth: '350px'}}
                    author={<a>{props.lookupText}</a>}
                    avatar={<Avatar src="/img/avatar.png" alt="MedJargonBuster" />}
                    content={getDefinitionContent(data)}>
                </Comment>
            );
        }
        /*         if (error) {
                    <Comment
                        author={<a>{props.lookupText}</a>}
                        avatar={<Avatar src="/img/avatar" alt="MedJargonBuster" />}
                        content={<div>Sorry, I couldn't look it up.</div>}>
                    </Comment>
                    console.log(error);
        
                } */

    }

    const onVisibleChange = (visible: boolean) => {
        console.log(`onVisibleChange: ${visible}`)

    }

    return (
        <Popover arrowPointAtCenter onVisibleChange={onVisibleChange} placement="top" content={getPopoverContent} title="Definition" visible={props.visible}>
            {props.children}
        </Popover>
    )
}

export default DefinitionPopover;