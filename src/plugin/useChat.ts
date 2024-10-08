import { useState, useEffect } from 'react';
import type { PropsUseChat } from '../types';
import useCheckBackground from '../hook/useCheckBackground';
import { useCustomizeConfiguration } from '../context/CustomizeContext';
import { specialMessageTypes } from '../constant/ChatModalConstant';
import { Recorder } from '../services';
import { useModules } from '../context/ModulesContext';

const useChat = ({
  defaultConfiguration,
  sessionId,
  client,
  rnfs,
  url,
}: PropsUseChat) => {
  const { modules } = useModules();

  const { enableNdUi, getResponseData } = defaultConfiguration;

  const [messageList, setMessageList] = useState<any>([]);
  const [historyCount, sethistoryCount] = useState(0);

  const { changeLanguage } = useCustomizeConfiguration();

  const { background } = useCheckBackground();

  const parseUrl = url ? url.split('/chathub')[0] : '';
  const sessionInfo = defaultConfiguration?.clientId
    ? defaultConfiguration?.clientId
    : sessionId;
  const histortURL = enableNdUi
    ? parseUrl + '/history/' + sessionId
    : parseUrl +
      '/history?projectName=' +
      defaultConfiguration?.projectName +
      '&tenantName=' +
      defaultConfiguration?.tenant +
      '&clientId=' +
      sessionInfo;
  const addMessageList = (message: any) => {
    setMessageList((messages: any) => {
      if (background) {
        getHistoryBackground();
      }
      if (messages?.length > 0) {
        const messagesLength = messages.length;
        const lastElement = messages[messagesLength - 1];

        const messageExists = messages.some(
          (msg: any) => msg.id === message.id
        );
        if (messageExists && message.id !== undefined) {
          return messages;
        }

        if (lastElement?.type === 'typing') {
          messages.pop();
          return [...messages, message];
        }

        if (
          specialMessageTypes.includes(lastElement?.type) &&
          lastElement?.type === message.type
        ) {
          return messages;
        }

        return [...messages, message];
      }
      return [message];
    });
  };

  const setResponseFunc = (customAction: any, customActionData: any) => {
    if (typeof customActionData === 'object' && customActionData?.Language) {
      changeLanguage(customActionData?.Language.toLowerCase());
    }
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
    try {
      await client.connectAsync();
      if (defaultConfiguration.sendConversationStart === true) {
        sendConversationStart();
      }

      conversationContinue();
    } catch (e) {
      console.error('connection error', JSON.stringify(e));
    }
    attachClientOnMessage();
    funcTyping();
  };

  const funcTyping = () => {
    client.ontyping((_: any, message: any) => {
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
    client.onmessage(async (_: any, message: any) => {
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
              messageBody?.channelData?.CustomActionData,
              messageBody?.channelData?.CustomProperties
            );
          }
        }
      }

      if (messageBody && !messageBody.timestamp) {
        messageBody.timestamp = Date.now();
      }

      if (
        messageBody?.type === 'audio' ||
        messageBody?.attachments?.[0]?.contentType === 'audio/base64'
      ) {
        try {
          const base64Data = messageBody?.attachments?.[0]?.content;
          const filePath =
            'file://' +
            (await new Recorder(
              modules?.AudioRecorderPlayer,
              modules?.RNFS,
              modules?.Record
            ).saveLocalFileAudio(base64Data, messageBody?.id));
          messageBody.message = filePath;

          addMessageList(messageBody);
        } catch (error) {
          console.error('Error saving audio file:', error);
        }
      } else if (messageBody?.type === 'SpeechRecognized') {
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
        endUser: defaultConfiguration.endUser,
        locale: defaultConfiguration.locale,
      });

      const sendMesObj = {
        message: message,
        customAction: '',
        customActionData: defaultConfiguration.customActionData,
        clientId: defaultConfiguration.clientId,
        tenant: defaultConfiguration.tenant,
        channel: defaultConfiguration.channel,
        project: defaultConfiguration.projectName,
        conversationId: sessionId,
        fullName: defaultConfiguration.fullName,
        endUser: defaultConfiguration.endUser,
        locale: defaultConfiguration.locale,
      };
      client.sendAsync(JSON.stringify(sendMesObj));
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
      locale: defaultConfiguration.locale,
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
      data:
      JSON.stringify({
        ...JSON.parse(defaultConfiguration.customActionData) ,
        ResponseType: 'AudioBase64',
      }),
    });
    formData.push({
      name: 'endUser',
      data: JSON.stringify({
        ...defaultConfiguration.endUser,
      }),
    });
    formData.push({
      name: 'locale',
      data: defaultConfiguration.locale,
    });
    formData.push({
      name: 'channel',
      data: defaultConfiguration.channel || '',
    });
    const replaceLink = url.replace('chathub', 'Home/SendAudio');
    sendAudioSocket({ replaceLink, formData });
  };



  const sendAttachment = async () => {
    try {
  
      const res = await modules.RNFileSelector.pick({
        type: [modules.RNFileSelector.types.allFiles], 
      });
  
      const fileUri = res[0].uri; 
      const fileName = res[0].name; 
      const fileType = res[0].type; 
  
      const formData = new FormData();
  
    
      formData.append('attachment', {
        uri: fileUri,
        name: fileName,
        type: fileType, 
      });
  
      formData.append('user', sessionId);
      formData.append('project', defaultConfiguration.projectName);
      formData.append('tenant', defaultConfiguration.tenant);
      formData.append('customAction', defaultConfiguration.customAction);
      formData.append('customActionData', defaultConfiguration.customActionData);
      formData.append('channel', 'webchatmobile-sestek');
      formData.append('locale', defaultConfiguration.locale);
      formData.append('clientId', defaultConfiguration.clientId);
      formData.append('endUser', JSON.stringify(defaultConfiguration.endUser));

      const replaceLink = url.replace('chathub', 'Home/SendAttachment');
      const response = await fetch(
        replaceLink,
        {
          method: 'POST',
          headers: {
            Accept: '*/*',
            'Content-Type': 'multipart/form-data', 
          },
          body: formData,
        }
      );
  
      const responseData = await response.json();
  
      if (responseData.message === 'Hata') {
        console.log('Başarılı:', responseData);

        addMessageList({
          timestamp: new Date().getTime(),
          type: 'text',
          message: fileName ?? '',
          customAction: '',
          customActionData: '',
          clientId: defaultConfiguration.clientId,
          tenant: defaultConfiguration.tenant,
          channel: defaultConfiguration.channel,
          project: defaultConfiguration.projectName,
          conversationId: sessionId,
          fullName: defaultConfiguration.fullName,
          endUser: defaultConfiguration.endUser,
          locale: defaultConfiguration.locale,
        });
        setMessageList((messages: any) => [
          ...messages,
          { type: 'typing', message: 'xxxxx' },
        ]);
      } else {
        console.error('Başarısız:', responseData);
      }
    } catch (err) {
      if (modules.RNFileSelector.isCancel(err)) {
        console.log('Kullanıcı dosya seçimini iptal etti');
      } else {
        console.error('Dosya yükleme hatası:', err);
      }
    }
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
      endUser: defaultConfiguration.endUser,
      locale: defaultConfiguration.locale,
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
      endUser: defaultConfiguration.endUser,
    };
    setMessageList([]);
    client.endConversation(JSON.stringify(dataToSend));
  };

  const parseAttachment = async (data: any, i: number) => {
    const parsedJsonContent = JSON.parse(data[i].jsonContent);

    if (parsedJsonContent?.attachments) {
      const updatedAttachments = await Promise.all(
        parsedJsonContent.attachments.map(async (attachment: any) => {
          let parsedContent;
          try {
            parsedContent = JSON.parse(attachment.content);
          } catch (e) {
            parsedContent = attachment.content;
          }
          return {
            ...attachment,
            content: parsedContent,
          };
        })
      );
      const updatedJsonContent = {
        ...parsedJsonContent,
        attachments: updatedAttachments,
        timestamp: new Date(data[i].dialogTime),
        channel:
          data[i].messageType === 'VirtualAgent'
            ? null
            : defaultConfiguration.channel,
        conversationId: sessionId,
      };
      return updatedJsonContent;
    } else {
      const updatedParsedJson = {
        ...parsedJsonContent,
        timestamp: new Date(data[i].dialogTime),
        channel:
          data[i].messageType === 'VirtualAgent'
            ? null
            : defaultConfiguration.channel,
        conversationId: sessionId,
      };
      return updatedParsedJson;
    }
  };

  const getHistory = async () => {
    if (sessionInfo) {
      const res = await fetch(histortURL, {
        method: 'GET',
      });
      const data: any = await res.json();
      if (data && data.length > 0) {
        if (data.length > historyCount) {
          for (let i = historyCount; i < data.length; i++) {
            const message = await parseAttachment(data, i);
            addMessageList(message);
          }
        } else if (historyCount > data.length) {
          for (let i = 0; i < data.length; i++) {
            const message = await parseAttachment(data, i);
            addMessageList(message);
          }
        }
      }
    }
  };

  const getHistoryBackground = () => {
    if (sessionInfo) {
      fetch(histortURL, {
        method: 'GET',
      })
        .then((res) => res.json())
        .then((data: any) => {
          if (data && data.length > 0) {
            sethistoryCount(data.length);
          }
        });
    }
  };

  const conversationContinue = async () => {
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
      endUser: defaultConfiguration.endUser,
      locale: defaultConfiguration.locale,
    };
    await client.continueConversation(JSON.stringify(startObj));
    defaultConfiguration.customAction = '';
  };

  return {
    messageList,
    sendMessage,
    sendAudio,
    sendAttachment,
    sendEnd,
    getHistory,
    conversationContinue,
    getHistoryBackground,
  };
};

export { useChat };
