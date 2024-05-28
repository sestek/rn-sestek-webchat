import React, {
  useState,
  useCallback,
  useImperativeHandle,
  forwardRef,
  useRef,
} from 'react';
import { Image, StatusBar, TouchableOpacity, View } from 'react-native';
import { GeneralManager, SignalRClient } from '../services';
import { ModalCompRef, ModalComponent } from '../components/modal/modal';
import { ChatIcon } from '../image';
import type { PropsChatModal } from '../types';
import { ChatModalProps } from '../types/plugin/ChatModalProps';
import { styles } from './chat-styles';
import { LoadingProvider } from '../context/LoadingContext';
import RenderImage from '../../src/components/renderImage';
import { CustomizeConfigurationProvider } from '../context/CustomizeContext';
import { ModulesProvider } from '../context/ModulesContext';

let sessionId = GeneralManager.createUUID();
let client = new SignalRClient(GeneralManager.getWebchatHost());

const ChatModal = forwardRef<ChatModalProps, PropsChatModal>((props, ref) => {
  const { defaultConfiguration, url, modules, customizeConfiguration } = props;

  const {
    chatStartButtonBackground,
    chatStartButtonBackgroundSize,
    chatStartButton,
    chatStartButtonHide,
  } = customizeConfiguration;

  const { asyncStorage } = modules;

  const modalRef = useRef<ModalCompRef>(null);
  const [closeModal, setCloseModal] = useState<boolean>(false);
  const [start, setStart] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);

  const buildConversation = async () => {
    sessionId = 'Mobil' + GeneralManager.createUUID();
    if (asyncStorage) {
      await asyncStorage.setItem('sessionId', sessionId);
    }
  };

  const checkAudioFile = () => {
    if (modules?.RNFS) {
      let dirs = modules?.RNFS.fs.dirs;
      let folderPath = dirs.DocumentDir + '/sestek_bot_audio';
      modules?.RNFS.fs
        .mkdir(folderPath)
        .then((res: string) => console.log(res))
        .catch((err: string) => console.log(err));
    }
  };

  const startConversation = async () => {
    if (!start) {
      buildConversation();
      client = new SignalRClient(url || ChatModal.defaultProps?.url);
    }
    setStart(true);
    setVisible(true);
    checkAudioFile();
  };

  const startStorageSession = async () => {
    if (!start) {
      if (asyncStorage) {
        const storageSessionId = await asyncStorage.getItem('sessionId');
        if (storageSessionId) {
          sessionId = storageSessionId;
          defaultConfiguration.sendConversationStart = false;
        } else {
          buildConversation();
        }
      } else {
        buildConversation();
      }
      client = new SignalRClient(url || ChatModal.defaultProps?.url);
    }
    setStart(true);
    setVisible(true);
    checkAudioFile();
  };

  const endConversation = async () => {
    setStart(false);
    setVisible(false);
    modalRef.current?.sendEnd();
    if (modules?.RNFS) {
      let dirs = modules?.RNFS.fs.dirs;
      let folderPath = dirs.DocumentDir + '/sestek_bot_audio';
      modules?.RNFS.fs
        .unlink(folderPath)
        .then((res: string) => console.log(res))
        .catch((err: string) => console.log(err));
    }
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
    endConversation: () => {
      endConversation();
    },
    conversationStatus: start,
    messageList: modalRef.current?.messageList,
    startStorageSession: () => {
      startStorageSession();
    },
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
            {chatStartButton ? (
              <RenderImage
                type={chatStartButton.type}
                value={chatStartButton.value}
                style={{
                  width: chatStartButtonBackgroundSize || 50,
                  height: chatStartButtonBackgroundSize || 50,
                }}
              />
            ) : (
              <Image
                style={{
                  width: chatStartButtonBackgroundSize || 50,
                  height: chatStartButtonBackgroundSize || 50,
                }}
                source={ChatIcon}
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
              initialConfig={customizeConfiguration}
              integrationId={defaultConfiguration?.integrationId}
            >
              {visible && (
                <StatusBar
                  animated={true}
                  backgroundColor="#7743DB"
                  barStyle="default"
                  showHideTransition="fade"
                  hidden={false}
                />
              )}
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
            </CustomizeConfigurationProvider>
          </ModulesProvider>
        </LoadingProvider>
      )}
    </React.Fragment>
  );
});

export { ChatModal, ChatModalProps };
