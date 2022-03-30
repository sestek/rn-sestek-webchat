import { useState, useEffect } from 'react';
import type { PropsUseChat } from 'src/types';
import SignalRClient from '../services/signalr';

const client = new SignalRClient("http://localhost:55020/chathub");
const sessionId = "";

const useChat = ({ defaultConfiguration, messages }: PropsUseChat) => {

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
            console.log(d, m);
            addMessageList(m);
        });
    }

    const sendMessage = async (message: any) => {
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
        addMessageList({
            message,
            customAction: '',
            customActionData: '',
            clientId: defaultConfiguration.clientId,
            tenant: defaultConfiguration.tenant,
            channel: defaultConfiguration.channel,
            project: defaultConfiguration.projectName,
            conversationId: sessionId,
            fullName: defaultConfiguration.fullName
        });
    }

    const sendConversationStart = async () => {
        defaultConfiguration.customAction = 'startOfConversation';
        const startObj = {
            message: 'start_message_1234',
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
        await client.startConversation(JSON.stringify(startObj));
        defaultConfiguration.customAction = '';
        addMessageList(startObj);
    }



    return [
        messageList,
        sendMessage
    ]
}

export { useChat };