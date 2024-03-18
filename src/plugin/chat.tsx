import React, {
  useState,
  useCallback,
  useImperativeHandle,
  forwardRef,
  useRef,
} from 'react';
import { Image, StatusBar, TouchableOpacity, View } from 'react-native';
import { GeneralManager, SignalRClient } from '../services';
import ModalComponent, { ModalCompRef } from '../components/modal';
import { ChatIcon } from '../image';
import type { PropsChatModal } from '../types';
import { StyleContextProvider } from '../context/StyleContext';
import { ChatModalProps } from '../types/plugin/ChatModalProps';
import { styles } from './chat-styles';
import { LoadingProvider } from '../context/LoadingContext';
import { useChat } from '../plugin/useChat';

let sessionId = GeneralManager.createUUID();
let client = new SignalRClient(GeneralManager.getWebchatHost());

console.log('session-id : ', sessionId);

export const ChatModal = forwardRef<ChatModalProps, PropsChatModal>(
  (props, ref) => {
    const { defaultConfiguration, url, modules, customizeConfiguration } =
      props;

    const {
      chatStartButtonBackground,
      chatStartButtonBackgroundSize,
      chatStartButton,
      chatStartButtonHide,
    } = customizeConfiguration;

    // ! Artık nd ve knovvu ortamları eşit ikisinin de başında mobile prefix var
    // ! durum değişirse diye eklendi
    // if (defaultConfiguration?.enableNdUi) {
    //   sessionId = 'Mobil' + sessionId;
    //   defaultConfiguration.channel = 'NdUi';
    // }

    const modalRef = useRef<ModalCompRef>(null);
    const [closeModal, setCloseModal] = useState<boolean>(false);
    const [start, setStart] = useState<boolean>(false);
    const [visible, setVisible] = useState<boolean>(false);

    const { sendEnd } = useChat({
      url: url ? url : '',
      defaultConfiguration: defaultConfiguration,
      sessionId: sessionId,
      client: client,
      rnfs: modules?.RNFS,
    });

    const startConversation = () => {
      if (!start) {
        sessionId = 'Mobil' + GeneralManager.createUUID();
        client = new SignalRClient(url || ChatModal.defaultProps?.url);
      }
      setStart(true);
      setVisible(true);
      if (modules?.RNFS) {
        let dirs = modules?.RNFS.fs.dirs;
        let folderPath = dirs.DocumentDir + '/sestek_bot_audio';
        modules?.RNFS.fs
          .mkdir(folderPath)
          .then((res: string) => console.log(res))
          .catch((err: string) => console.log(err));
      }
    };

    const endConversation = async () => {
      setStart(false);
      setVisible(false);
      sendEnd();
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
              <Image
                style={{
                  width: chatStartButtonBackgroundSize || 50,
                  height: chatStartButtonBackgroundSize || 50,
                }}
                source={GeneralManager.returnIconData(
                  chatStartButton?.type,
                  chatStartButton?.value,
                  ChatIcon
                )}
              />
            </TouchableOpacity>
          </View>
        )}
        {start && (
          <LoadingProvider>
            <StyleContextProvider>
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
                modules={modules}
                customizeConfiguration={customizeConfiguration}
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
            </StyleContextProvider>
          </LoadingProvider>
        )}
      </React.Fragment>
    );
  }
);
