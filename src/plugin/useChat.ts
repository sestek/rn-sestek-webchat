import { useState, useEffect } from 'react';
import type { PropsUseChat } from '../types';

const useChat = ({ defaultConfiguration, messages, sessionId, client, rnfs, url }: PropsUseChat) => {


    const [messageList, setMessageList] = useState<any>(messages || []);
    const addMessageList = (message: any) => {
        setMessageList((messages: any) => [...messages, message]);
    }

    useEffect(() => {
        if (!client.connected) {
            initSocket();
        }
    }, []);

    const initSocket = async () => {
        await client
            .connectAsync()
            .then(() => {
                if (defaultConfiguration.sendConversationStart === true) {
                    sendConversationStart();
                }
            })
            .catch((e) => {
                console.error('connection error', JSON.stringify(e));
            });
        attachClientOnMessage();
    }

    const attachClientOnMessage = () => {
        client.onmessage((d: any, m: any) => {
            //console.log(d, m);
            if (typeof m !== "object") {
                m = JSON.parse(m);
                if (m && !m.timestamp) {
                    m.timestamp = Date.now();
                }
            }
            addMessageList(m);
        });
    }

    const sendMessage = async (message: string, bot: boolean = false) => {
        if (message) {
            addMessageList({
                timestamp: new Date().getTime(),
                message,
                customAction: '',
                customActionData: '',
                clientId: defaultConfiguration.clientId,
                tenant: defaultConfiguration.tenant,
                channel: bot ? null : defaultConfiguration.channel,
                project: defaultConfiguration.projectName,
                conversationId: sessionId,
                fullName: defaultConfiguration.fullName
            });
            await client.sendAsync(
                sessionId,
                message,
                defaultConfiguration.customAction,
                defaultConfiguration.customActionData,
                defaultConfiguration.projectName,
                defaultConfiguration.clientId,
                defaultConfiguration.channel,
                defaultConfiguration.tenant,
                defaultConfiguration.fullName
            );
        }
    }

    const sendAudio = async (urlSet: string, filename: string, data: string) => {

        addMessageList({
            timestamp: new Date().getTime(),
            type: 'audio',
            message: urlSet,
            customAction: '',
            customActionData: '',
            clientId: defaultConfiguration.clientId,
            tenant: defaultConfiguration.tenant,
            channel: defaultConfiguration.channel,
            project: defaultConfiguration.projectName,
            conversationId: sessionId,
            fullName: defaultConfiguration.fullName
        });
        console.log(filename)
        const formData = new Array();
        formData.push({ name: 'audio', data: data, filename: filename, type: 'audio/' + filename.split(".")[1] });
        formData.push({ name: "user", data: sessionId });
        formData.push({ name: "project", data: defaultConfiguration.projectName || "" });
        formData.push({ name: "clientId", data: defaultConfiguration.clientId || "" });
        formData.push({ name: "tenant", data: defaultConfiguration.tenant || "" });
        formData.push({ name: "fullName", data: defaultConfiguration.fullName || "" });
        formData.push({ name: "customAction", data: defaultConfiguration.customAction || "" });
        formData.push({ name: "customActionData", data: defaultConfiguration.customActionData || "" });

        const replaceLink = url.replace('chathub', 'Home/SendAudio');

        rnfs.fetch('POST', replaceLink, {
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json'
        }, formData).then(async (resp: any) => {
            //console.log(await resp.base64())
            const message = JSON.parse(resp?.data)?.message?.replace(/<\/?[^>]+(>|$)/g, "");
            sendMessage(message, true);
        }).catch((err: any) => {
            //console.log(err)
        })
    }

    const sendConversationStart = async () => {
        defaultConfiguration.customAction = 'startOfConversation';
        const startObj = {
            timestamp: new Date().getTime(),
            message: '',
            customAction: 'startOfConversation',
            customActionData: defaultConfiguration.customActionData,
            clientId: defaultConfiguration.clientId,
            tenant: defaultConfiguration.tenant,
            channel: defaultConfiguration.channel,
            project: defaultConfiguration.projectName,
            conversationId: sessionId,
            fullName: defaultConfiguration.fullName,
            userAgent: "USERAGENT EKLENECEK",
            browserLanguage: "tr" // BURASI DİNAMİK İSTENECEK
        };
        addMessageList(startObj);
        await client.startConversation(JSON.stringify(startObj));
        defaultConfiguration.customAction = '';
    }



    return [
        messageList,
        sendMessage,
        sendAudio
    ]
}

export { useChat };
