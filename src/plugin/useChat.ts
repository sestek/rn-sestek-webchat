import { useState, useEffect } from 'react';
import type { PropsUseChat } from '../types';

const useChat = ({
  defaultConfiguration,
  messages,
  sessionId,
  client,
  rnfs,
  url,
}: PropsUseChat) => {
  const [messageList, setMessageList] = useState<any>(messages || []);
  const sessionIdNew = defaultConfiguration.enableNdUi ? 'Mobil' + sessionId : sessionId
  const addMessageList = (message: any) => {
    setMessageList((messages: any) => [...messages, message]);
  };

  const { enableNdUi, getResponseData } = defaultConfiguration;
  const setResponseFunc = (customAction: any, customActionData: any) => {
    getResponseData({ customAction, customActionData });
  };

  useEffect(() => {
    if (!client.connected) {
      initSocket();
    }
    setInterval(() => {
      setMessageList((messages: any) =>
        messages.filter((x: any) => x?.type !== 'typing')
      );
    }, 15000);
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
    funcTyping();
  };

  const funcTyping = () => {
    client.ontyping((d: any, m: any) => {
      // console.log(d, m);

      if (m === 'typing') {
        setMessageList((messages: any) => [
          ...messages,
          { type: 'typing', message: 'xxxxx' },
        ]);
      } else {
        setMessageList((messages: any) =>
          messages.filter((x: any) => x?.type !== 'typing')
        ); //setMessageList(newList);
      }
    });
  };

  const attachClientOnMessage = () => {
    client.onmessage((d: any, m: any) => {
      console.log(d, '-', m);
      if (typeof m !== 'object') {
        m = JSON.parse(m);
        if (m?.channelData) {
          if (enableNdUi) {
            if (m?.channelData?.CustomActionData) {
              setResponseFunc(
                m?.channelData?.CustomAction,
                m?.channelData?.CustomActionData
              );
            }
          } else {
            if (m?.channelData?.CustomProperties) {
              setResponseFunc(
                m?.channelData?.CustomAction,
                m?.channelData?.CustomProperties
              );
            }
          }
        }

        if (m && !m.timestamp) {
          m.timestamp = Date.now();
        }
        if (m.type === 'SpeechRecognized') {
          var textMessage = m.channelData?.CustomProperties?.textFromSr;
          m.type = 'message';
          if (textMessage === null || textMessage === '') {
            m.text = '🤷‍♀️';
            addMessageList(m);
          } else {
            setMessageList((prevMessageList: any) => {
              const lastMessage = prevMessageList[prevMessageList.length - 1];
              const update = {
                text: textMessage,
                channel: 'SpeechRecognized',
              };
              const updatedLastMessage = { ...lastMessage, ...update };
              const updatedList = prevMessageList
                .slice(0, -1)
                .concat(updatedLastMessage);
              return updatedList;
            });
          }
        } else {
          console.log(m);
          addMessageList(m);
        }
      }
    });
  };

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
        conversationId: sessionIdNew,
        fullName: defaultConfiguration.fullName,
      });
      await client.sendAsync(
        sessionIdNew,
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
  };

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
      conversationId: sessionIdNew,
      fullName: defaultConfiguration.fullName,
    });
    console.log(filename);
    setMessageList((messages: any) => [
      ...messages,
      { type: 'typing', message: 'xxxxx' },
    ]);

    const formData = new Array();
    formData.push({
      name: 'audio',
      data: data,
      filename: filename,
      type: 'audio/' + filename.split('.')[1],
    });
    formData.push({ name: 'user', data: sessionIdNew });
    formData.push({
      name: 'project',
      data: defaultConfiguration.projectName || '',
    });
    formData.push({
      name: 'clientId',
      data: defaultConfiguration.clientId || '',
    });
    formData.push({ name: 'tenant', data: defaultConfiguration.tenant || '' });
    formData.push({
      name: 'fullName',
      data: defaultConfiguration.fullName || '',
    });
    formData.push({
      name: 'customAction',
      data: defaultConfiguration.customAction || '',
    });
    formData.push({
      name: 'customActionData',
      data: defaultConfiguration.customActionData || '{}',
    });
    formData.push({
      name: 'channel',
      data: defaultConfiguration.channel || '',
    });

    const replaceLink = url.replace('chathub', 'Home/SendAudio');
    rnfs
      .fetch(
        'POST',
        replaceLink,
        {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
        },
        formData
      )
      .then(async (resp: any) => {
        //console.log(await resp.base64())
        const message = JSON.parse(resp?.data)?.message?.replace(
          /<\/?[^>]+(>|$)/g,
          ''
        );
        console.log("mmm : ",resp.json())
        sendMessage(message, true);
      })
      .catch((err: any) => {
        console.log(err);
      })
      .finally(() => {
        setMessageList((messages: any) =>
          messages.filter((x: any) => x?.type !== 'typing')
        );
      });
  };

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
      conversationId: sessionIdNew,
      fullName: defaultConfiguration.fullName,
      userAgent: 'USERAGENT EKLENECEK',
      browserLanguage: 'tr', // BURASI DİNAMİK İSTENECEK
    };
    addMessageList(startObj);
    await client.startConversation(JSON.stringify(startObj));
    defaultConfiguration.customAction = '';
  };

  return [messageList, sendMessage, sendAudio];
};

export { useChat };
