import React, {
  useState,
  useCallback,
  useImperativeHandle,
  forwardRef,
  useRef,
  useMemo,
} from 'react';
import { TouchableOpacity, View } from 'react-native';
import { GeneralManager, SignalRClient } from '../services';
import { ModalCompRef, ModalComponent } from '../components/modal/modal';
import type { PropsChatModal } from '../types';
import { ChatModalProps } from '../types/plugin/ChatModalProps';
import { styles } from './chat-styles';
import { LoadingProvider } from '../context/LoadingContext';
import RenderImage from '../../src/components/renderImage';
import {
  CustomizeConfigurationProvider,
  defaultCustomizeConfiguration,
} from '../context/CustomizeContext';
import { ModulesProvider } from '../context/ModulesContext';
import { CustomActionProvider } from '../context/CustomActionContext';
import { createNitroAudioModules } from '../adapters/nitroAudio';
import {
  createDocumentsPickerModule,
  isNewDocumentsPickerApi,
} from '../adapters/documentsPicker';
import { createBlobUtilFileViewer } from '../adapters/blobUtilFileViewer';
import { createAsyncStorageModule } from '../adapters/asyncStorage';

let sessionId = GeneralManager.createUUID();
let client = new SignalRClient(GeneralManager.getWebchatHost());

const ChatModal = forwardRef<ChatModalProps, PropsChatModal>((props, ref) => {
  const { defaultConfiguration, url, customizeConfiguration } = props;
  const {
    nitroSound,
    AudioRecorderPlayer: providedPlayer,
    Record: providedRecord,
    RNFileSelector: providedPicker,
    fileViewer: providedViewer,
    asyncStorage: providedAsyncStorage,
    RNFS,
  } = props.modules || {};

  const nitroAudioAdapters = useMemo(() => {
    if (nitroSound && !providedPlayer && !providedRecord) {
      return createNitroAudioModules(nitroSound, RNFS);
    }
    return null;
  }, [nitroSound, RNFS, providedPlayer, providedRecord]);
  const normalizedPicker = useMemo(() => {
    if (providedPicker && isNewDocumentsPickerApi(providedPicker)) {
      return createDocumentsPickerModule(providedPicker);
    }
    return null;
  }, [providedPicker]);
  const blobUtilViewer = useMemo(() => {
    const canOpen =
      RNFS?.android?.actionViewIntent || RNFS?.ios?.previewDocument;
    if (!providedViewer && canOpen) {
      return createBlobUtilFileViewer(RNFS);
    }
    return null;
  }, [providedViewer, RNFS]);
  // AsyncStorage v3 multiGet/multiSet/multiRemove'u kaldirdi; adapter v2
  // kontratini geri veriyor. v2 gelirse aynen geri doner (bkz. adapters/asyncStorage).
  const normalizedAsyncStorage = useMemo(
    () => createAsyncStorageModule(providedAsyncStorage),
    [providedAsyncStorage]
  );

  const modules = useMemo(() => {
    let m = props.modules;
    if (nitroAudioAdapters) {
      m = { ...m, ...nitroAudioAdapters };
    }
    if (normalizedPicker) {
      m = { ...m, RNFileSelector: normalizedPicker };
    }
    if (blobUtilViewer) {
      m = { ...m, fileViewer: blobUtilViewer };
    }
    if (normalizedAsyncStorage) {
      m = { ...m, asyncStorage: normalizedAsyncStorage };
    }
    return m;
  }, [
    props.modules,
    nitroAudioAdapters,
    normalizedPicker,
    blobUtilViewer,
    normalizedAsyncStorage,
  ]);

  const customizeConfigurationData =
    customizeConfiguration || defaultCustomizeConfiguration;
  const {
    chatStartButtonBackground,
    chatStartButtonBackgroundSize,
    chatStartButton,
    chatStartButtonHide,
  } = customizeConfigurationData;

  const { asyncStorage } = modules;

  const modalRef = useRef<ModalCompRef>(null);
  const configuredSendStart = useRef(
    defaultConfiguration?.sendConversationStart
  );
  const [closeModal, setCloseModal] = useState<boolean>(false);
  const [start, setStart] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);

  const buildConversation = async () => {
    sessionId = 'Mobil' + GeneralManager.createUUID();
    if (asyncStorage) {
      // Kalicilastirma en iyi caba: storage hatasi konusma baslatmayi bozmasin.
      try {
        await asyncStorage.setItem('sessionId', sessionId);
        // YENI konusma: onceki konusmanin kimligi kalmamali. Kalirsa uygulama
        // kill edildikten sonra startStorageSession yeni sessionId ile ESKI
        // conversation'i devam ettirmeye calisir ve iki konusmanin mesajlari
        // birbirine karisir.
        await asyncStorage.multiRemove(['conversationId', 'sessionToken']);
      } catch (e) {
        console.warn('sessionId could not be persisted', e);
      }
    }
  };

  // Await edilebilir: temiz kurulusta getHistory'nin ses indirmesi klasor
  // henuz yokken calisip sessizce bos dosya uretiyordu.
  const checkAudioFile = async () => {
    if (modules?.RNFS) {
      const folderPath = modules.RNFS.fs.dirs.DocumentDir + '/sestek_bot_audio';
      try {
        await GeneralManager.ensureDir(modules.RNFS, folderPath);
      } catch (err) {
        console.warn('audio directory could not be created', err);
      }
    }
  };

  const startConversation = async () => {
    if (!start) {
      // Konusma baslatma davranisini yapilandirilmis haline dondur:
      // startStorageSession bir onceki oturumu devam ettirdiyse bunu false'a
      // cekmis olabilir. Oyle kalirsa yeni konusmada startOfConversation hic
      // gonderilmez; ekranda sadece history goruntulenir, bot karsilamaz.
      defaultConfiguration.sendConversationStart = configuredSendStart.current;
      await buildConversation();
      client = new SignalRClient(url || ChatModal.defaultProps?.url);
    }
    await checkAudioFile();
    setStart(true);
    setVisible(true);
  };

  const startStorageSession = async () => {
    let resumed = false;
    if (!start) {
      let many = null;
      if (asyncStorage) {
        try {
          many = await asyncStorage.multiGet([
            'sessionId',
            'sessionToken',
            'conversationId',
          ]);
        } catch (e) {
          // Okunamayan storage = devam ettirilecek oturum yok; yeni konusma ac.
          console.warn('stored session could not be read', e);
        }
      }
      const stored = many ? Object.fromEntries(many) : null;

      resumed = Boolean(
        stored?.sessionId && stored?.sessionToken && stored?.conversationId
      );

      if (resumed) {
        sessionId = stored!.sessionId!;
        defaultConfiguration.sendConversationStart = false;
      } else {
        defaultConfiguration.sendConversationStart =
          configuredSendStart.current;
        await buildConversation();
      }

      client = new SignalRClient(url || ChatModal.defaultProps?.url);

      if (resumed) {
        client.sessionToken = stored!.sessionToken!;
        client.conversationId = stored!.conversationId!;
      }
    }
    await checkAudioFile();
    setStart(true);
    setVisible(true);
    return resumed;
  };

  const endConversation = async () => {
    let sent = false;
    try {
      sent = (await modalRef.current?.sendEnd()) === true;
    } catch {
      sent = false;
    }

    setStart(false);
    setVisible(false);

    if (sent && asyncStorage) {
      try {
        await asyncStorage.multiRemove([
          'sessionToken',
          'conversationId',
          'sessionId',
        ]);
      } catch (e) {
        console.warn('stored session could not be cleared', e);
      }
    }

    if (sent && modules?.RNFS) {
      let dirs = modules?.RNFS.fs.dirs;
      let folderPath = dirs.DocumentDir + '/sestek_bot_audio';
      modules?.RNFS.fs
        .unlink(folderPath)
        .catch((err: string) =>
          console.warn('audio cache could not be cleared', err)
        );
    }

    return sent;
  };

  const clickClosedConversationModalFunc = () => {
    setCloseModal(true);
  };

  const triggerVisible = useCallback(() => {
    setVisible((old) => !old);
  }, [visible]);

  useImperativeHandle(ref, () => ({
    triggerVisible: () => {
      triggerVisible();
    },
    startConversation: () => {
      startConversation();
    },
    endConversation,
    conversationStatus: start,
    messageList: modalRef.current?.messageList,
    startStorageSession,
  }));
  return (
    <React.Fragment>
      {chatStartButtonHide ? (
        <React.Fragment></React.Fragment>
      ) : (
        <View style={styles.mainContainer}>
          <TouchableOpacity
            style={[
              styles.floatBottomRight,
              chatStartButtonBackground
                ? { backgroundColor: chatStartButtonBackground }
                : {},
            ]}
            onPress={() => startConversation()}
          >
            {chatStartButton && (
              <RenderImage
                type={chatStartButton.type}
                value={chatStartButton.value}
                style={{
                  width: chatStartButtonBackgroundSize || 50,
                  height: chatStartButtonBackgroundSize || 50,
                }}
              />
            )}
          </TouchableOpacity>
        </View>
      )}
      {start && (
        <LoadingProvider>
          <ModulesProvider modules={modules}>
            <CustomizeConfigurationProvider
              url={url}
              initialConfig={customizeConfigurationData}
              integrationId={defaultConfiguration?.integrationId}
            >
              <CustomActionProvider>
                <ModalComponent
                  ref={modalRef}
                  url={url || ChatModal.defaultProps?.url!}
                  defaultConfiguration={defaultConfiguration}
                  visible={visible}
                  closeConversation={endConversation}
                  hideModal={triggerVisible}
                  sessionId={sessionId}
                  client={client}
                  closedModalManagment={{ closeModal, setCloseModal }}
                  clickClosedConversationModalFunc={
                    clickClosedConversationModalFunc
                  }
                />
              </CustomActionProvider>
            </CustomizeConfigurationProvider>
          </ModulesProvider>
        </LoadingProvider>
      )}
    </React.Fragment>
  );
});

export { ChatModal, ChatModalProps };
