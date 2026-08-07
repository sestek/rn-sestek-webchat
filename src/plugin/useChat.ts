import { useState, useEffect, useRef } from 'react';
import type { PropsUseChat } from '../types';
import { useCustomizeConfiguration } from '../context/CustomizeContext';
import { specialMessageTypes } from '../constant/ChatModalConstant';
import { GeneralManager, Recorder } from '../services';
import { useModules } from '../context/ModulesContext';
import { useLoading } from '../context/LoadingContext';
import { useCustomAction } from '../context/CustomActionContext';
import { Alert } from 'react-native';

const useChat = ({
  defaultConfiguration,
  sessionId,
  client,
  rnfs,
  url,
}: PropsUseChat) => {
  const { modules } = useModules();
  const { setLoading } = useLoading();
  const { setGlobalCustomAction } = useCustomAction();

  const { enableNdUi, getResponseData } = defaultConfiguration;

  const [messageList, setMessageList] = useState<any>([]);
  const [historyCount, sethistoryCount] = useState(0);
  const [exceededFileSize, setExceededFileSize] = useState<boolean>(false);

  const { changeLanguage } = useCustomizeConfiguration();

  // NOT: arka plan takibi burada DEGIL, ModalComponent'te yapiliyor
  // ([visible, background] effect'i). Iki yerde birden dinlenince uygulama
  // one her donusunde history iki kez cekiliyordu.

  const startSentRef = useRef(false);
  const sessionReadyRef = useRef<Promise<void> | null>(null);
  // Son senkronda history'nin EN SON kaydinin sunucu zamani (dialogTime).
  // Iki isi var: (1) history'de gercekten yeni kayit var mi anlamak,
  // (2) hangi kayitlarin bekleyen iyimser bir mesaji sahiplenebilecegini
  // belirlemek. Sunucu zamani sunucu zamaniyla karsilastirildigi icin
  // cihaz-sunucu saat farkindan etkilenmiyor.
  const lastHistoryStampRef = useRef<string | null>(null);

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

  const getNormalizedLocale = (locale?: string) => {
    if (!locale) {
      return 'en-US';
    }

    return locale.trim().toUpperCase() === 'EN' ? 'en-US' : locale;
  };

  // Sunucudan benimsenen conversationId + sessionToken'ı kalıcı sakla.
  // Reconnect/continuity'de (startStorageSession) geri yüklenip
  // ContinueConversation ile gönderiliyor.
  const persistSession = async () => {
    if (!modules?.asyncStorage) {
      return;
    }
    const entries: Record<string, string> = {};
    if (client.conversationId) {
      entries.conversationId = client.conversationId;
    }
    if (client.sessionToken) {
      entries.sessionToken = client.sessionToken;
    }
    if (Object.keys(entries).length > 0) {
      // Kalicilastirma en iyi caba. Firlatmasina izin verirsek hata
      // sendConversationStart -> initSocket'e kadar yukselir ve calisan bir
      // baglantiyi "connection error" gibi gosterir; ayrica sendAudio'nun
      // bekledigi sessionReady promise'ini kalici olarak reject birakir.
      try {
        await modules.asyncStorage.multiSet(Object.entries(entries));
      } catch (e) {
        console.warn('session could not be persisted', e);
      }
    }
  };

  // --- Iyimser (yerel) mesaj eslestirmesi ---------------------------------
  // Kullanici bir sey gonderdiginde mesaj listeye HEMEN ekleniyor. Ayni mesaj
  // daha sonra sunucudan geri geliyor (socket echo'su veya history senkronu).
  // Butonlarda gonderilen deger (value) ile ekranda gosterilen metin (title)
  // FARKLI oldugu icin ne id ne de metin karsilastirmasi tutuyordu; mesaj iki
  // kez gorunuyordu (ekranda "Test" + "4"). Cozum: iyimser kayda ne
  // gonderdigimizi de yaziyoruz (sentMessage) ve sunucu kaydi geldiginde ayni
  // kaydin UZERINE yaziyoruz -- gosterilen metin title olarak kaliyor.
  const isUserSide = (m: any) => !!m?.channel;
  const isPendingLocal = (m: any) => m?.local === true && m?.id === undefined;
  const displayTextOf = (m: any) => m?.text ?? m?.message;
  const normalizeText = (value: any) =>
    typeof value === 'string'
      ? value
          .replace(/<[^>]*>/g, '')
          .replace(/\s+/g, ' ')
          .trim()
          .toLowerCase()
      : '';

  // Sunucu kaydi, bekleyen iyimser kaydin karsiligi mi? Buton mesajlarinda
  // sunucu value'yu ('4') tutuyor, biz title'i ('Test') gosteriyoruz; bu
  // yuzden ikisini de deniyoruz.
  const matchesPendingLocal = (local: any, remote: any) => {
    const remoteText = normalizeText(displayTextOf(remote));
    if (!remoteText) {
      return false;
    }
    return (
      remoteText === normalizeText(local?.sentMessage) ||
      remoteText === normalizeText(displayTextOf(local))
    );
  };

  // Sunucu kaydini benimse ama kullaniciya gosterilen metni (buton basligini)
  // koru. Boylece listede tek mesaj kaliyor ve o mesaj artik sunucudaki
  // kaydin id'sini tasidigi icin sonraki senkronlarda tekrar eklenmiyor.
  // displayOverride: sunucu ayni kaydi (value ile) tekrar gonderdiginde
  // basligin geri value'ya donmemesi icin saklaniyor.
  const adoptRemoteIntoLocal = (local: any, remote: any) => {
    const display = displayTextOf(local);
    if (!display) {
      return { ...remote, local: false };
    }
    return {
      ...remote,
      text: display,
      displayOverride: display,
      local: false,
    };
  };

  const findPendingLocalIndex = (messages: any[], remote: any) => {
    for (let i = messages.length - 1; i >= 0; i--) {
      const candidate = messages[i];
      if (
        isPendingLocal(candidate) &&
        isUserSide(candidate) &&
        matchesPendingLocal(candidate, remote)
      ) {
        return i;
      }
    }
    return -1;
  };

  const addMessageList = (rawMessage: any) => {
    // receivedAt: bu kaydin listeye HANGI CIHAZ ZAMANINDA girdigi. getHistory
    // birlestirmesi, history yanitindan once gelmis canli artiklari bununla
    // ayikliyor (bkz. getHistory -> kept). timestamp'e dokunmuyoruz: o alan
    // ekranda gosterilen saat ve sunucudan gelebiliyor.
    const message = { ...rawMessage, receivedAt: Date.now() };

    // Updater saf tutuluyor (yan etki yok): React onu birden fazla kez
    // calistirabiliyor. History yenilemesi ModalComponent'in
    // [visible, background] effect'inde.
    setMessageList((messages: any) => {
      if (messages?.length > 0) {
        const messagesLength = messages.length;
        const lastElement = messages[messagesLength - 1];

        const messageExists = messages.some(
          (msg: any) => msg.id === message.id
        );
        if (messageExists && message.id !== undefined) {
          return messages;
        }

        // Sunucu kullanicinin kendi mesajini geri yollarsa YENI KAYIT ACMA:
        // bekleyen iyimser kaydin uzerine yaz (bkz. adoptRemoteIntoLocal).
        // !isPendingLocal SART: aksi halde kullanici ayni metni ust uste iki
        // kez gonderdiginde ikinci iyimser kayit birincinin uzerine yazilir
        // ve mesaj kaybolur.
        if (isUserSide(message) && !isPendingLocal(message)) {
          const pendingIndex = findPendingLocalIndex(messages, message);
          if (pendingIndex > -1) {
            const next = [...messages];
            next[pendingIndex] = adoptRemoteIntoLocal(
              next[pendingIndex],
              message
            );
            return next;
          }
        }

        if (lastElement?.type === 'typing') {
          // slice: pop() state dizisini YERINDE degistiriyordu. React updater'i
          // iki kez calistirdiginda (StrictMode) ikinci calisma gercek bir
          // mesaji siliyor, yani mesaj kayboluyordu.
          return [...messages.slice(0, -1), message];
        }

        // id'siz mesajlar (orn. endOfConversation Event'leri) yukaridaki
        // id tekilleştirmesine takilmiyordu; ayni tipten pes pese gelenleri
        // burada eliyoruz ki mukerrer "session terminated" birikmesin.
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

  const setResponseFunc = async (customAction: any, customActionData: any) => {
    if (typeof customActionData === 'object' && customActionData?.Language) {
      changeLanguage(customActionData?.Language.toLowerCase());
      defaultConfiguration.locale = getNormalizedLocale(
        customActionData?.Language
      );
    }
    if (getResponseData) {
      getResponseData({ customAction, customActionData });
    }

    if (customActionData?.Language?.toUpperCase?.() === 'EN') {
      await sendMessage({
        message: '',
        bot: false,
        allowEmptyMessage: true,
        localeOverride: customActionData?.Language,
      });
    }
  };

  useEffect(() => {
    if (!client.connected) {
      initSocket();
    } else {
      // Zaten bagli bir client ile mount olduk. Dinleyicileri baglamak yeterli
      // DEGIL: bu client'la henuz bir konusma acilmadiysa (orn. sohbet
      // kapatilip yeniden aciliyorsa) startOfConversation da gonderilmeli.
      // Aksi halde ekranda sadece history goruluyor, bot yeni konusmaya
      // karsilik veremiyor.
      attachClientOnMessage();
      funcTyping();
      maybeSendConversationStart();
    }
  }, [client.connected]);

  const initSocket = async () => {
    try {
      await client.connectAsync();

      attachClientOnMessage();
      funcTyping();

      await maybeSendConversationStart();
    } catch (e) {
      console.error('connection error', e);
    }
  };

  // startOfConversation'i gondermeye karar veren tek yer. Hem initSocket
  // (yeni baglanti) hem de zaten bagli bir client ile mount olma durumu
  // buradan geciyor; aksi halde kapatilip yeniden acilan bir sohbette
  // konusma hic baslamiyor ve ekranda yalnizca history kaliyor.
  const maybeSendConversationStart = async () => {
    try {
      const willSend =
        defaultConfiguration.sendConversationStart === true &&
        !startSentRef.current &&
        !client.conversationId;
      if (willSend) {
        startSentRef.current = true;
        sessionReadyRef.current = sendConversationStart();
        await sessionReadyRef.current;
      }
    } catch (e) {
      console.error('connection error', e);
    }
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

      // Soketten gelen kayitlarda `channel` alani YOK (`channelId` var). Ekranda
      // taraf/renk karari `channel` uzerinden verildigi icin, sunucu
      // kullanicinin KENDI mesajini geri yollarsa (echo veya reconnect sonrasi
      // ContinueConversation replay'i) o mesaj bot tarafina dusuyordu: gri
      // baloncuk + chatBotMessageBoxTextColor, yani beyaz yerine SIYAH yazi.
      // Ayrica "kullanici tarafi" sayilmadigi icin iyimser kayit eslestirmesi
      // hic calismiyor, mesaj mukerrer gorunuyordu.
      //
      // Gonderenin kimligi bunu kesin ayirt ediyor: kullanici mesajlarinda
      // from.id = clientId, bot mesajlarinda from.id = conversationId.
      const senderId = messageBody?.from?.id;
      const isFromClient =
        senderId !== undefined &&
        (senderId === defaultConfiguration.clientId ||
          senderId === sessionInfo ||
          senderId === sessionId);
      if (isFromClient && !messageBody?.channel) {
        messageBody.channel = defaultConfiguration.channel;
      }

      if (messageBody?.channelData) {
        if (enableNdUi) {
          if (messageBody?.channelData?.CustomActionData) {
            await setResponseFunc(
              messageBody?.channelData?.CustomAction,
              messageBody?.channelData?.CustomActionData
            );
          }
        } else {
          if (messageBody?.channelData?.CustomProperties) {
            await setResponseFunc(
              messageBody?.channelData?.CustomActionData,
              messageBody?.channelData?.CustomProperties
            );

            if (messageBody?.channelData?.CustomProperties?.EnableAttachment) {
              setGlobalCustomAction(
                messageBody?.channelData?.CustomProperties?.EnableAttachment
              );
            }
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
          return;
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
    allowEmptyMessage = false,
    localeOverride,
  }: {
    message?: string;
    displayMessage?: string;
    bot: boolean;
    allowEmptyMessage?: boolean;
    localeOverride?: string;
  }) => {
    const canSendMessage =
      message !== undefined && (allowEmptyMessage || !!message);
    if (canSendMessage) {
      const displayMessageText = displayMessage ? displayMessage : message;
      const normalizedLocale = getNormalizedLocale(
        localeOverride || defaultConfiguration.locale
      );

      if (displayMessageText) {
        addMessageList({
          timestamp: new Date().getTime(),
          message: displayMessageText,
          // Iyimser kayit: sunucudan geri geldiginde (echo/history) yeni mesaj
          // olarak degil, BU kaydin uzerine yazilir. sentMessage sunucunun
          // gorecegi metin -- butonlarda title degil value gonderiliyor.
          local: true,
          sentMessage: message,
          customAction: '',
          customActionData: '',
          clientId: defaultConfiguration.clientId,
          tenant: defaultConfiguration.tenant,
          channel: bot ? null : defaultConfiguration.channel,
          project: defaultConfiguration.projectName,
          conversationId: sessionId,
          fullName: defaultConfiguration.fullName,
          endUser: defaultConfiguration.endUser,
          locale: normalizedLocale,
        });
      }

      const sendMesObj = {
        message: message,
        customAction: '',
        customActionData: defaultConfiguration.customActionData
          ? defaultConfiguration.customActionData
          : '{}',
        clientId: defaultConfiguration.clientId,
        tenant: defaultConfiguration.tenant,
        channel: defaultConfiguration.channel,
        project: defaultConfiguration.projectName,
        conversationId: sessionId,
        fullName: defaultConfiguration.fullName,
        endUser: defaultConfiguration.endUser,
        locale: normalizedLocale,
      };
      await client.sendAsync(JSON.stringify(sendMesObj));
      // sendConversationStart=false akışında ilk mesaj örtük başlatma yapıp
      // conversationId + sessionToken döndürebilir; oluştuysa kalıcılaştır.
      await persistSession();
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
        const status = resp?.respInfo?.status;
        const raw = resp?.data;
        if (!raw) {
          console.warn('sendAudio: empty response body, status', status);
          return;
        }
        let parsed: any;
        try {
          parsed = JSON.parse(raw);
        } catch (e) {
          console.warn('sendAudio: non-JSON response, status', status);
          return;
        }
        const message = parsed?.message?.replace(/<\/?[^>]+(>|$)/g, '');
        sendMessage({ message: message, bot: true });
      })
      .catch((err: any) => {
        console.error('sendAudio request failed', err);
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
    if (sessionReadyRef.current) {
      // Sadece konusma baslatmanin BITMESINI bekliyoruz. Basarisiz olduysa
      // yine de yuklemeyi deniyoruz: aksi halde tek bir basarisiz start,
      // oturum boyunca her ses mesajini sessizce dusururdu.
      await sessionReadyRef.current.catch(() => {});
    }

    const formData = new Array();
    formData.push({
      name: 'audio',
      data: data,
      filename: filename,
      type: 'audio/' + filename.split('.')[1],
    });
    formData.push({ name: 'audioId', data: filename.split('.')[0] });
    formData.push({ name: 'user', data: client.conversationId || sessionId });
    formData.push({ name: 'sessionToken', data: client.sessionToken || '' });
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
      data: JSON.stringify({
        ...(defaultConfiguration.customActionData
          ? JSON.parse(defaultConfiguration.customActionData)
          : {}),
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
      data: getNormalizedLocale(defaultConfiguration.locale),
    });
    formData.push({
      name: 'channel',
      data: defaultConfiguration.channel || '',
    });
    const replaceLink = url.replace('chathub', 'Home/SendAudio');
    sendAudioSocket({ replaceLink, formData });
  };

  const sendAttachment = async (source: any) => {
    try {
      let res;
      let fileUri, fileName: any, fileType;
      let selectedFileSize = 0;

      if (source === 'document') {
        // Belge seçimi
        res = await modules.RNFileSelector.pick({
          type: [modules.RNFileSelector.types.allFiles],
        });

        if (res && res.length > 0) {
          // Belge için dosya bilgilerini al
          fileUri = res[0].uri;
          fileName = res[0].name;
          fileType = res[0].type;
          selectedFileSize = res[0].size || 0;
        } else {
          return;
        }
      } else if (source === 'gallery') {
        // Galeriden resim veya video seçimi
        res = await modules.launchImageLibrary({
          mediaType: 'photo',
          includeBase64: false,
        });

        if (res.assets && res.assets.length > 0) {
          fileUri = res.assets[0].uri;
          fileName = res.assets[0].fileName;
          fileType = res.assets[0].type;
          selectedFileSize = res.assets[0].fileSize || 0;
          const asset = res.assets[0];
          const { fileName: originalName, type } = asset;

          const ext =
            originalName && originalName.includes('.')
              ? originalName.split('.').pop()
              : type
              ? type.split('/')[1]
              : 'jpg';

          const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

          fileName = `photo_${timestamp}.${ext}`;
        } else {
          return;
        }
      } else if (source === 'camera') {
        res = await modules.launchcamera({
          mediaType: 'photo',
          includeBase64: false,
        });
        if (res.assets && res.assets.length > 0) {
          fileUri = res.assets[0].uri;
          fileName = res.assets[0].fileName;
          fileType = res.assets[0].type;
          selectedFileSize = res.assets[0].fileSize || 0;
        } else {
          return;
        }
        const asset = res.assets[0];
        const { fileName: originalName, type } = asset;

        const ext =
          originalName && originalName.includes('.')
            ? originalName.split('.').pop()
            : type
            ? type.split('/')[1]
            : 'jpg';

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

        fileName = `photo_${timestamp}.${ext}`;
      }
      if (selectedFileSize > 10 * 1024 * 1024) {
        setExceededFileSize(true);
        return;
      }
      setLoading(true);
      const formData = new FormData();

      formData.append('attachment', {
        uri: fileUri,
        name: fileName,
        type: fileType,
      });

      formData.append('user', client.conversationId || sessionId);
      formData.append('sessionToken', client.sessionToken || '');
      formData.append('project', defaultConfiguration.projectName);
      formData.append('tenant', defaultConfiguration.tenant);
      formData.append('customAction', defaultConfiguration.customAction);
      formData.append(
        'customActionData',
        defaultConfiguration.customActionData
          ? defaultConfiguration.customActionData
          : '{}'
      );
      formData.append('channel', 'webchatmobile-sestek');
      formData.append(
        'locale',
        getNormalizedLocale(defaultConfiguration.locale)
      );
      formData.append('clientId', defaultConfiguration.clientId);
      formData.append('endUser', JSON.stringify(defaultConfiguration.endUser));
      setLoading(false);

      const replaceLink = url.replace('chathub', 'Home/SendAttachment');
      const response = await fetch(replaceLink, {
        method: 'POST',
        headers: {
          'Accept': '*/*',
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
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
      } else {
        Alert.alert('An error occurred while uploading the file. ');
        console.error('Attachment upload failed', data);
      }
    } catch (err) {
      if (modules.RNFileSelector.isCancel(err)) {
        Alert.alert('User canceled file selection ');
      } else {
        Alert.alert('File upload error ' + err);
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
      customActionData: defaultConfiguration.customActionData
        ? defaultConfiguration.customActionData
        : '{}',
      clientId: defaultConfiguration.clientId,
      tenant: defaultConfiguration.tenant,
      channel: defaultConfiguration.channel,
      project: defaultConfiguration.projectName,
      fullName: defaultConfiguration.fullName,
      userAgent: 'USERAGENT EKLENECEK',
      browserLanguage: 'en-US', // BURASI DİNAMİK İSTENECEK
      endUser: defaultConfiguration.endUser,
      locale: defaultConfiguration.locale
        ? getNormalizedLocale(defaultConfiguration.locale)
        : 'en-US',
      responseType: 'AudioBase64',
    };

    addMessageList(startObj);
    // StartConversation { conversationId, sessionToken, traceId } döner;
    // SignalRClient bunu benimser, biz de kalıcılaştırırız.
    await client.startConversation(JSON.stringify(startObj));
    await persistSession();
    defaultConfiguration.customAction = '';
  };
  const sendEnd = async () => {
    try {
      const dataToSend = {
        message: 'Chat ended by client!',
        customAction: 'endOfConversation',
        customActionData: defaultConfiguration.customActionData
          ? defaultConfiguration.customActionData
          : '{}',
        clientId: defaultConfiguration.clientId,
        tenant: defaultConfiguration.tenant,
        channel: defaultConfiguration.channel,
        project: defaultConfiguration.projectName,
        conversationId: sessionId,
        fullName: defaultConfiguration.fullName,
        endUser: defaultConfiguration.endUser,
      };

      const sent =
        (await client.endConversation(JSON.stringify(dataToSend))) === true;
      if (!sent) {
        console.error('EndConversation could not be delivered');
        return false;
      }

      setMessageList([]);
      sethistoryCount(0);

      // Ayni mount icinde yeniden baslatilabilsin: bu ref sifirlanmazsa
      // initSocket bir daha startOfConversation gondermez.
      startSentRef.current = false;
      sessionReadyRef.current = null;
      lastHistoryStampRef.current = null;

      // await SART: close() artik async ve icerde connection.stop() cagiriyor.
      // Beklemezsek soket henuz kapanmadan yeni konusma acilabiliyor.
      // Ayrica hatayi yutmuyoruz -- eskiden buradaki bos catch, olmayan bir
      // HubConnection.close() metodundan gelen TypeError'i gizliyordu.
      if (client && typeof client.close === 'function') {
        try {
          await client.close();
        } catch (closeError) {
          console.error('Socket could not be closed', closeError);
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Error ending conversation:', error);
      return false;
    }
  };

  const parseAttachment = async (data: any, i: number) => {
    const parsedJsonContent = JSON.parse(data[i].jsonContent);

    const storageKey = data[i]?.storagePath;
    const messageType = data[i]?.messageType;
    const tenantName = defaultConfiguration.tenant;
    // Bot (VirtualAgent) sesleri storageType=1, kullanici (Client) sesleri
    // storageType=0 altinda duruyor. Yanlis tip HTTP 200 ama BOS govde
    // donduruyor; bu da 0 byte'lik bir .wav uretiyor ve oynatici
    // "unsupported file type" (OSStatus 2003334207) veriyor. Once mesaj
    // tipine gore dogru olani deniyoruz, bos gelirse digerine dusuyoruz.
    const storageTypeCandidates =
      messageType === 'VirtualAgent' ? [1, 0] : [0, 1];
    const fileUrlFor = (storageType: number) =>
      `${parseUrl}/file?tenantName=${tenantName}&key=${storageKey}&storageType=${storageType}`;

    // Indirilen dosyanin gercekten dolu oldugunu dogrular; fs.exists yetmiyor
    // cunku bos govde de dosyayi olusturuyor.
    const downloadAudioFile = async (
      dir: string,
      path: string
    ): Promise<boolean> => {
      // checkAudioFile() klasoru await edilmeden olusturuyor, dolayisiyla ilk
      // acilista (temiz kurulum) getHistory buraya klasor daha yokken
      // gelebiliyor ve blob-util yazamiyor. Indirmeden once garanti altina al.
      try {
        await GeneralManager.ensureDir(modules.RNFS, dir);
      } catch (e) {
        console.warn('audio dir could not be created', dir, e);
      }

      const fileSize = async (): Promise<number> => {
        try {
          const stat = await modules.RNFS.fs.stat(path);
          return Number(stat?.size) || 0;
        } catch {
          return 0;
        }
      };

      const contentLengthOf = (response: any): number => {
        const headers = response?.respInfo?.headers || {};
        const raw =
          headers['Content-Length'] ??
          headers['content-length'] ??
          headers['Content-length'];
        const n = Number(raw);
        return Number.isFinite(n) && n > 0 ? n : 0;
      };

      const isOkStatus = (status?: number) =>
        status === undefined || (status >= 200 && status < 300);

      // Dosya zaten tam indirilmisse tekrar indirme. getHistory artik her
      // cagrisinda tum history'yi parse ediyor; bu kontrol olmadan ayni ses
      // dosyalari her acilista bastan cekilirdi.
      const alreadyOnDisk = await fileSize();
      if (alreadyOnDisk > 0) {
        return true;
      }

      // Tam indi mi? Content-Length biliniyorsa ona gore, bilinmiyorsa
      // "en azindan bos degil" olcutu. Kismi dosyayi ASLA kabul etme:
      // yarim WAV/MP4 oynaticida "unsupported file type" olarak patliyor.
      const isComplete = (size: number, expected: number) =>
        size > 0 && (expected === 0 || size >= expected);

      const attempt = async (storageType: number): Promise<boolean> => {
        const requestUrl = fileUrlFor(storageType);
        let expected = 0;

        // A) blob-util'in dogrudan diske yazan yolu.
        try {
          const response = await modules.RNFS.config({ path: path }).fetch(
            'GET',
            requestUrl,
            { Accept: '*/*' }
          );
          const status = response?.respInfo?.status;
          if (!isOkStatus(status)) {
            console.warn(`audio storageType=${storageType} -> HTTP ${status}`);
            return false;
          }
          expected = contentLengthOf(response);
          const size = await fileSize();
          if (isComplete(size, expected)) {
            return true;
          }
          console.warn(
            `audio storageType=${storageType} dosyaya eksik indi (${size}/${
              expected || '?'
            } byte), base64 ile yeniden deneniyor`
          );
        } catch (e) {
          // Android'de blob-util'in FileStorage yolu "Download interrupted."
          // ile kesilebiliyor (ReactNativeBlobUtilReq.java:833) ve dosya
          // tek Okio segmentinde (8192 byte) yarim kaliyor.
          console.warn(
            `audio storageType=${storageType} dosyaya indirme hatasi, base64 ile yeniden deneniyor`,
            e
          );
        }

        // B) Govdeyi bellege alip diske yaz. 'RNFB-Response: base64' blob-util'e
        //    dosya stream'ini hic kullanmamasini soyluyor, boylece yukaridaki
        //    Android hatasi devre disi kaliyor. Ses dosyalari ~100 KB, sorun degil.
        try {
          const response = await modules.RNFS.fetch('GET', requestUrl, {
            'Accept': '*/*',
            'RNFB-Response': 'base64',
          });
          const status = response?.respInfo?.status;
          if (!isOkStatus(status)) {
            console.warn(
              `audio storageType=${storageType} (base64) -> HTTP ${status}`
            );
            return false;
          }
          const base64Body = response?.data;
          if (!base64Body) {
            console.warn(
              `audio storageType=${storageType} (base64) -> bos govde`
            );
            return false;
          }
          await modules.RNFS.fs.writeFile(path, base64Body, 'base64');
          const size = await fileSize();
          const expectedNow = contentLengthOf(response) || expected;
          if (isComplete(size, expectedNow)) {
            return true;
          }
          console.warn(
            `audio storageType=${storageType} (base64) eksik (${size}/${
              expectedNow || '?'
            } byte)`
          );
        } catch (e) {
          console.warn(`audio storageType=${storageType} (base64) hatasi`, e);
        }

        return false;
      };

      for (const storageType of storageTypeCandidates) {
        if (await attempt(storageType)) {
          return true;
        }
      }
      // Geriye bos bir dosya birakma: sonraki acilislarda "var ama bozuk"
      // gorunup oynaticiyi hataya dusurur.
      try {
        await modules.RNFS.fs.unlink(path);
      } catch {}
      return false;
    };

    var audioPath: any = null;
    if (parsedJsonContent?.attachments) {
      const updatedAttachments = await Promise.all(
        parsedJsonContent.attachments.map(async (attachment: any) => {
          let parsedContent;
          try {
            parsedContent = JSON.parse(attachment.content);
          } catch (e) {
            parsedContent = attachment.content;
          }

          if (
            attachment?.contentType === 'document/pdf' ||
            attachment?.contentType === 'image/jpg' ||
            attachment?.contentType === 'image/jpeg'
          ) {
            parsedJsonContent.text = attachment.name;
          }
          // Ses eklerini BURADA indirmiyoruz. Eskiden her history kaydi icin
          // indirme yapiliyordu: 16 kayitlik bir gecmis ~4 saniye suruyor,
          // bu sirada canli gelen mesajlar listeye karisiyor ve kullanici
          // hicbir zaman dinlemeyecegi dosyalar icin bekliyordu.
          // Bunun yerine indirmeyi yapacak fonksiyonu mesaja ilistiriyoruz;
          // oynatici (AudioComponent) ilk ihtiyac aninda cagiriyor.
          if (attachment?.contentType === 'audio/base64' && storageKey) {
            const dirs = modules.RNFS.fs.dirs.DocumentDir + '/sestek_bot_audio';
            const parts = storageKey.split('/');
            const lastPart = parts[parts.length - 1];
            const path = `${dirs}/${lastPart}.wav`;

            audioPath = `file://${path}`;
            return {
              ...attachment,
              content: parsedContent,
              message: audioPath,
              messageType: messageType,
              // Oynatici cagirinca indirir; dosya zaten diskteyse indirme
              // yapmadan true doner.
              resolveAudio: async () => {
                const ok = await downloadAudioFile(dirs, path);
                if (!ok) {
                  throw new Error(
                    `Failed to download audio file (storageTypes ${storageTypeCandidates.join(
                      '/'
                    )}, key ${storageKey})`
                  );
                }
                return audioPath;
              },
            };
          }

          return {
            ...attachment,
            content: parsedContent,
            message: audioPath,
            messageType: messageType,
          };
        })
      );

      return {
        ...parsedJsonContent,
        attachments: updatedAttachments,
        timestamp: new Date(data[i].dialogTime),
        channel:
          data[i].messageType === 'VirtualAgent'
            ? null
            : defaultConfiguration.channel,
        conversationId: sessionId,
      };
    }

    return {
      ...parsedJsonContent,
      timestamp: new Date(data[i].dialogTime),
      channel:
        data[i].messageType === 'VirtualAgent'
          ? null
          : defaultConfiguration.channel,
      conversationId: sessionId,
    };
  };

  // NOT: burada bir sure history "ayrac normalizasyonu" vardi (pes pese gelen
  // endOfConversation kayitlarini tek ayraca indiriyor, sondakini atiyordu).
  // Kaldirildi: history ekrana AYNEN yazilmali. Hangi kaydin gosterilecegine
  // karar vermek sunucunun isi; biz gelen listeyi oldugu gibi cizeriz.
  const getHistory = async () => {
    if (!sessionInfo) return;

    try {
      // CIHAZ saati. Hangi canli mesajin BU istekten SONRA geldigini ayirt
      // etmek icin kullaniliyor; sunucu saatiyle (dialogTime) karsilastirma
      // YAPILMIYOR, aradaki saat farki listeyi bozardi.
      const requestedAt = Date.now();
      const res = await fetch(histortURL, { method: 'GET' });
      const data: any = await res.json();

      if (!data) {
        return;
      }

      if (data.length === 0) {
        if (historyCount > 0) {
          console.warn('History cleared on backend');
          setMessageList([]);
          sethistoryCount(0);
        }
        lastHistoryStampRef.current = null;
        return;
      }

      // DIKKAT: burada eskiden "data.length === historyCount ise cik" vardi.
      // Sunucu history'yi PENCERELI donduruyor (gozlenen: son 15 kayit), yani
      // pencere dolduktan sonra uzunluk SABIT kaliyor -- bu kontrol history'yi
      // bir daha hic senkronlamiyordu: yeni mesajlar listeye girmiyor, eski
      // canli artiklar da hic temizlenmiyordu. Uzunluk yerine son kaydin
      // zamani + uzunluk birlikte imza olarak kullaniliyor.
      const lastStamp: string | null = data[data.length - 1]?.dialogTime ?? null;
      if (
        lastStamp &&
        lastStamp === lastHistoryStampRef.current &&
        data.length === historyCount
      ) {
        return;
      }

      // History AYNEN, geldigi sirayla parse ediliyor. Kayit atilmiyor,
      // birlestirilmiyor, yeniden siralanmiyor: ekrandaki blok = sunucunun
      // dondugu listenin kendisi.
      //
      // NOT: tek tek addMessageList yerine blok halinde yaziliyor. Eskiden her
      // kayit ayri ayri ekleniyordu; parseAttachment ses ekleri icin indirme
      // yaptigindan dongu saniyelerce suruyor ve o sirada canli gelen mesajlar
      // listenin ORTASINA dusuyordu.
      const parsed: any[] = [];
      for (let i = 0; i < data.length; i++) {
        const item = await parseAttachment(data, i);
        // Kararli anahtar: endOfConversation gibi Event kayitlarinda id YOK,
        // onlari sunucu zamaniyla tanimliyoruz. Sonraki senkronlarda "bu kaydi
        // zaten yazmis miyim" sorusu bununla cevaplaniyor.
        item.historyKey = item?.id ?? `t:${data[i]?.dialogTime}`;
        parsed.push(item);
      }

      const historyIds = new Set(
        parsed.map((m: any) => m?.id).filter((id: any) => id !== undefined)
      );
      const historyKeys = new Set(parsed.map((m: any) => m?.historyKey));

      // Bu senkronda YENI gelen kayitlar. Yalnizca bunlar bekleyen bir iyimser
      // mesaji sahiplenebilir; aksi halde onceki bir konusmada gecen ayni metin
      // ("Evet", "Test") bugun gonderilen mesaji yutar ve mesaj listenin
      // yanlis yerinde gorunurdu.
      //
      // Olcut olarak SUNUCU zamani kullaniliyor: sayi tabanli pencere hesabi
      // (parsed.length - yeni kayit sayisi) history pencereli dondugu icin
      // yaniltiyordu -- uzunluk sabitlenince hicbir kayit sahiplenilebilir
      // gorunmuyordu.
      const previousStampMs = lastHistoryStampRef.current
        ? new Date(lastHistoryStampRef.current).getTime()
        : 0;
      const isNewRecord = (m: any) => {
        const t = m?.timestamp ? new Date(m.timestamp).getTime() : 0;
        return t > previousStampMs;
      };

      setMessageList((prev: any[]) => {
        const live = (prev || []).filter((m: any) => m?.type !== 'typing');
        const claimed = new Set<any>();

        // Daha once bir iyimser kaydi sahiplenmis mesajlarin gosterilen metni
        // (buton basligi). Sunucu ayni kaydi value ile geri gonderdiginde
        // ekrandaki baslik value'ya donmesin diye tasiniyor.
        const displayOverrides = new Map<any, string>();
        live.forEach((m: any) => {
          if (m?.id !== undefined && m?.displayOverride) {
            displayOverrides.set(m.id, m.displayOverride);
          }
        });

        const merged = parsed.map((historyItem: any) => {
          const override =
            historyItem?.id !== undefined
              ? displayOverrides.get(historyItem.id)
              : undefined;
          if (override) {
            return {
              ...historyItem,
              text: override,
              displayOverride: override,
            };
          }

          if (!isNewRecord(historyItem) || !isUserSide(historyItem)) {
            return historyItem;
          }
          // Kullanicinin az once gonderdigi mesaj history'ye dusmus olabilir.
          // Iki kayit birakma: sunucu kaydini al, gosterilen metni (buton
          // basligini) koru.
          const local = live.find(
            (m: any) =>
              !claimed.has(m) &&
              isPendingLocal(m) &&
              isUserSide(m) &&
              matchesPendingLocal(m, historyItem)
          );
          if (!local) {
            return historyItem;
          }
          claimed.add(local);
          return adoptRemoteIntoLocal(local, historyItem);
        });

        // Listede zaten duran mesajlardan hangileri KORUNACAK?
        // Kural: history'de karsiligi olan her sey history'nin kopyasiyla
        // temsil edilir (mukerrer olmasin); karsiligi OLMAYAN hicbir sey
        // atilmaz (kayip mesaj olmasin).
        const kept = live.filter((m: any) => {
          // Sunucu kaydini sahiplenmis iyimser kayit: artik history'de duruyor.
          if (claimed.has(m)) {
            return false;
          }
          // Henuz sunucuya islenmemis olabilecek gonderim: her zaman korunur.
          if (isPendingLocal(m)) {
            return true;
          }
          // Onceki senkronda history'den yazilmis kayit. Yeni history'de de
          // varsa yenisi kullanilir; YOKSA sunucu penceresinden dusmus demektir
          // ve ekrandan SILINMEZ -- kronolojik yerinde kalir.
          if (m?.historyKey !== undefined) {
            return !historyKeys.has(m.historyKey);
          }
          // Soketten gelmis canli mesaj: id'si history'de varsa mukerrer.
          if (m?.id !== undefined && historyIds.has(m.id)) {
            return false;
          }
          // id'si OLMAYAN canli kayit (orn. endOfConversation Event'i) history
          // ile id uzerinden eslestirilemiyor. History istegi ATILDIKTAN once
          // gelmisse sunucu onu kaydetmis kabul edilir ve history kopyasi
          // kullanilir; yoksa ekranda alt alta iki "session terminated" olusuyordu.
          return (m?.receivedAt ?? 0) >= requestedAt;
        });

        // Yerlestirme: history blogunun SIRASI hic bozulmuyor.
        //  - History'nin son kaydindan ONCEKI korunmus mesajlar (pencereden
        //    dusmus eskiler) blogun ICINE kronolojik olarak giriyor; boylece
        //    16:32'lik bir mesaj 16:40'liklarin altinda kalmiyor.
        //  - History'den SONRA gelenler (canli mesajlar, orn. startOfConversation
        //    karsiligi) blogun ardina, geldikleri sirayla ekleniyor.
        //  - Bekleyen gonderimler en sonda.
        const timeOf = (m: any) => {
          const t = m?.timestamp ? new Date(m.timestamp).getTime() : 0;
          return Number.isFinite(t) ? t : 0;
        };
        const historyEndMs = merged.length ? timeOf(merged[merged.length - 1]) : 0;

        const pending = kept.filter((m: any) => isPendingLocal(m));
        const rest = kept.filter((m: any) => !isPendingLocal(m));
        const older = rest.filter((m: any) => timeOf(m) < historyEndMs);
        const newer = rest.filter((m: any) => timeOf(m) >= historyEndMs);

        const result: any[] = [];
        let oi = 0;
        for (const item of merged) {
          const t = timeOf(item);
          while (oi < older.length && timeOf(older[oi]) <= t) {
            result.push(older[oi++]);
          }
          result.push(item);
        }
        while (oi < older.length) {
          result.push(older[oi++]);
        }

        return [...result, ...newer, ...pending];
      });
      sethistoryCount(data.length);
      lastHistoryStampRef.current = lastStamp;
    } catch (error) {
      console.error('getHistory error:', error);
    }
  };

  const continuingRef = useRef(false);

  const continueIfNeeded = async (refreshHistory = false) => {
    if (continuingRef.current || !client?.needsReattach?.()) {
      return;
    }
    continuingRef.current = true;
    try {
      await conversationContinue();
      // Baglanti koptugu sirada gelen mesajlar sokete hic dusmedi, yalnizca
      // history'de varlar. Reconnect sonrasi senkronla; mukerrer olusmaz
      // cunku getHistory hem id'ye hem bekleyen iyimser kayda gore birlestirir.
      if (refreshHistory) {
        await getHistory();
      }
    } finally {
      continuingRef.current = false;
    }
  };

  const continueIfNeededRef = useRef(continueIfNeeded);
  continueIfNeededRef.current = continueIfNeeded;
  useEffect(() => {
    client.onReattachNeeded = () => {
      // Soket yeniden baglandi: konusmayi devam ettir ve kacan mesajlari
      // history'den tamamla.
      continueIfNeededRef.current(true);
    };
    return () => {
      client.onReattachNeeded = undefined;
    };
  }, [client]);

  const conversationContinue = async () => {
    await client.continueConversation('{}');
    await persistSession();
  };

  return {
    messageList,
    sendMessage,
    sendAudio,
    sendAttachment,
    sendEnd,
    getHistory,
    conversationContinue,
    continueIfNeeded,
    exceededFileSize,
    setExceededFileSize,
  };
};

export { useChat };
