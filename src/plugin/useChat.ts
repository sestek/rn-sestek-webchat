import { useState, useEffect } from 'react';
import type { PropsUseChat } from '../types';
import { AppState } from 'react-native';

const useChat = ({
  defaultConfiguration,
  sessionId,
  client,
  rnfs,
  url,
}: PropsUseChat) => {
  const { enableNdUi, getResponseData } = defaultConfiguration;

  const [messageList, setMessageList] = useState<any>([]);
  const [historyCount, sethistoryCount] = useState(0);

  const [background, setbackground] = useState(false);

  useEffect(() => {
    const _handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'background') {
        setbackground(true);
      } else {
        setbackground(false);
      }
    };
    AppState.addEventListener('change', _handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', _handleAppStateChange);
    };
  }, []);

  const addMessageList = (message: any) => {
    setMessageList((messages: any) => {
      if (background) {
        getHistoryBackground();
      }
      if (messages?.length > 0) {
        const messagesLength = messages.length;
        const lastElement = messages[messagesLength - 1];
        if (lastElement?.type === 'typing') {
          messages.pop();
          return [...messages, message];
        }
        return [...messages, message];
      }
      return [message];
    });
  };
  const setResponseFunc = (customAction: any, customActionData: any) => {
    if (getResponseData) {
      getResponseData({ customAction, customActionData });
    }
  };

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
    funcTyping();
  };

  const funcTyping = () => {
    client.ontyping((details: any, message: any) => {
      if (message === 'typing') {
        setMessageList((messages: any) => [
          ...messages,
          { type: 'typing', message: 'xxxxx' },
        ]);
      } else {
        setMessageList((messages: any) =>
          messages.filter((x: any) => x?.type !== 'typing')
        );
      }
    });
  };

  const attachClientOnMessage = () => {
    client.onmessage((details: any, message: any) => {
      const messageBody =
        typeof message === 'string' ? JSON.parse(message) : message;
      if (messageBody?.channelData) {
        if (enableNdUi) {
          if (messageBody?.channelData?.CustomActionData) {
            setResponseFunc(
              messageBody?.channelData?.CustomAction,
              messageBody?.channelData?.CustomActionData
            );
          }
        } else {
          if (messageBody?.channelData?.CustomProperties) {
            setResponseFunc(
              messageBody?.channelData?.CustomAction,
              messageBody?.channelData?.CustomProperties
            );
          }
        }
      }

      if (messageBody && !messageBody.timestamp) {
        messageBody.timestamp = Date.now();
      }
      if (messageBody?.type === 'SpeechRecognized') {
        var textMessage =
          messageBody?.channelData?.CustomProperties?.textFromSr;
        messageBody.type = 'message';
        if (!textMessage) {
          messageBody.text = '🤷‍♀️';
          addMessageList(messageBody);
        } else {
          setMessageList((prevMessageList: any) => {
            const lastMessage = prevMessageList[prevMessageList.length - 1];
            const update = {
              text: textMessage,
              channel: 'SpeechRecognized',
            };
            const updatedLastMessage = { ...lastMessage, ...update };
            const updatedList = [
              ...prevMessageList.slice(0, -1),
              updatedLastMessage,
            ];
            return updatedList;
          });
        }
      } else {
        addMessageList(messageBody);
      }
    });
  };

  const sendMessage = async ({
    message,
    displayMessage,
    bot = false,
  }: {
    message?: string;
    displayMessage?: string;
    bot: boolean;
  }) => {
    if (message) {
      const displayMessageText = displayMessage ? displayMessage : message;
      addMessageList({
        timestamp: new Date().getTime(),
        message: displayMessageText,
        customAction: '',
        customActionData: '',
        clientId: defaultConfiguration.clientId,
        tenant: defaultConfiguration.tenant,
        channel: bot ? null : defaultConfiguration.channel,
        project: defaultConfiguration.projectName,
        conversationId: sessionId,
        fullName: defaultConfiguration.fullName,
      });
      client.sendAsync(
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
  };

  const sendAudioSocket = (props: { replaceLink: string; formData: any }) => {
    const { replaceLink, formData } = props;
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
        const message = JSON.parse(resp?.data)?.message?.replace(
          /<\/?[^>]+(>|$)/g,
          ''
        );
        sendMessage({ message: message, bot: true });
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
      fullName: defaultConfiguration.fullName,
    });
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
    formData.push({ name: 'user', data: sessionId });
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
    sendAudioSocket({ replaceLink, formData });
  };

  const sendAttachmentSocket = (props: {
    replaceLink: string;
    formData: any;
  }) => {
    const { replaceLink, formData } = props;
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
        console.log('resp', resp);
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
  const sendAttachment = async (filename: string, data: string) => {
    const splitPath = filename?.split('/');
    const onlyFileName = splitPath && splitPath[splitPath.length - 1];

    addMessageList({
      timestamp: new Date().getTime(),
      type: 'text',
      message: onlyFileName ?? '',
      customAction: '',
      customActionData: '',
      clientId: defaultConfiguration.clientId,
      tenant: defaultConfiguration.tenant,
      channel: defaultConfiguration.channel,
      project: defaultConfiguration.projectName,
      conversationId: sessionId,
      fullName: defaultConfiguration.fullName,
    });
    setMessageList((messages: any) => [
      ...messages,
      { type: 'typing', message: 'xxxxx' },
    ]);

    const formData = new Array();
    formData.push({
      name: 'attachment',
      data: data,
      filename: onlyFileName ?? '',
      type: 'attachment/' + filename.split('.')[1],
    });
    formData.push({ name: 'user', data: sessionId });
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
      name: 'channel',
      data: defaultConfiguration.channel || '',
    });
    const replaceLink = url.replace('chathub', 'Home/SendAttachment');
    sendAttachmentSocket({ replaceLink, formData });
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
      conversationId: sessionId,
      fullName: defaultConfiguration.fullName,
      userAgent: 'USERAGENT EKLENECEK',
      browserLanguage: 'tr', // BURASI DİNAMİK İSTENECEK
    };
    addMessageList(startObj);
    await client.startConversation(JSON.stringify(startObj));
    defaultConfiguration.customAction = '';
  };
  const sendEnd = async () => {
    const dataToSend = {
      message: 'Chat ended by client!',
      customAction: 'endOfConversation',
      customActionData: defaultConfiguration.customActionData,
      clientId: defaultConfiguration.clientId,
      tenant: defaultConfiguration.tenant,
      channel: defaultConfiguration.channel,
      project: defaultConfiguration.projectName,
      conversationId: sessionId,
      fullName: defaultConfiguration.fullName,
    };
    client.endConversation(JSON.stringify(dataToSend));
  };

  const getHistory = (propsMessage: any) => {
    {
     
    }
    fetch('https://va.tr.knovvu.com/webchat/history/' + sessionId, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((data: any) => {
        if (data && data.length > 0) {
          
          if (data.length > historyCount) {
            for (let i = historyCount; i < data.length; i++) {
              addMessageList({
                timestamp: new Date(data[i].dialogTime),
                message: data[i]?.text,
                channel: null,
                conversationId: sessionId,
                type: 'message',
              });
            }
          } else if (historyCount > data.length) {
            for (let i = 0; i < data.length; i++) {
              addMessageList({
                timestamp: new Date(data[i].dialogTime),
                message: data[i]?.text,
                channel: null,
                conversationId: sessionId,
                type: 'message',
              });
            }
          }
        }
      });
  };

  const getHistoryBackground = () => {
    fetch('https://va.tr.knovvu.com/webchat/history/' + sessionId, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((data: any) => {
        if (data && data.length > 0) {
          sethistoryCount(data.length);
        }
      });
  };

  const conversationContinue = async () => {
    console.log('continune chat !');
    defaultConfiguration.customAction = 'ContinueConversation';
    const startObj = {
      timestamp: new Date().getTime(),
      message: '',
      customAction: 'ContinueConversation',
      customActionData: defaultConfiguration.customActionData,
      clientId: defaultConfiguration.clientId,
      tenant: defaultConfiguration.tenant,
      channel: defaultConfiguration.channel,
      project: defaultConfiguration.projectName,
      conversationId: sessionId,
      fullName: defaultConfiguration.fullName,
      userAgent: 'USERAGENT EKLENECEK',
      browserLanguage: 'tr', // BURASI DİNAMİK İSTENECEK
    };
    addMessageList(startObj);
    await client.continueConversation(JSON.stringify(startObj));
    defaultConfiguration.customAction = '';
  };

  return [
    messageList,
    sendMessage,
    sendAudio,
    sendAttachment,
    sendEnd,
    getHistory,
    conversationContinue,
    getHistoryBackground,
  ];
};

export { useChat };
