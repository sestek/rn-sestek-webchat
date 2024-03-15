import React, {
  forwardRef,
  useState,
  useImperativeHandle,
  useContext,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import {
  Modal,
  View,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  AppState,
} from 'react-native';
import { useChat } from '../plugin/useChat';
import type { PropsModalComponent } from '../types';
import BodyComponent from './body';
import FooterComponent from './footer';
import HeaderComponent from './header';
import { styles } from './modal-style';
import CloseModal from './closeModal';
import { StyleContext } from '../context/StyleContext';
import { ModalCompRef } from '../types/components/ModalComponent';
import GenerateBody from './body/GenerateBody';
import LoadingModal from './loadingModal';
import { useLoading } from '../context/LoadingContext';

const ModalComponent = forwardRef<ModalCompRef, PropsModalComponent>(
  (props, ref) => {
    const {
      url,
      defaultConfiguration,
      sessionId,
      client,
      modules,
      customizeConfiguration,
      closeConversation,
      closedModalManagment,
      hideModal,
      visible,
      clickClosedConversationModalFunc,
    } = props;

    const [inputData, setInputData] = useState<string>('');
    const changeInputData = (text: string) => setInputData(text);

    const { loading } = useLoading();

    const [
      messageList,
      sendMessage,
      sendAudio,
      sendAttachment,
      sendEnd,
      getHistory,
      conversationContinue,
      getHistoryBackground,
    ] = useChat({
      url: url,
      defaultConfiguration: defaultConfiguration,
      sessionId: sessionId,
      client: client,
      rnfs: modules?.RNFS,
    });

    useImperativeHandle(ref, () => ({
      messageList: messageList,
    }));

    const { appStyle, handleStyle, getCssIntegration } =
      useContext(StyleContext);

    useEffect(() => {
      (async () => {
        // if (defaultConfiguration.integrationId) {
        //   await getCssIntegration(
        //     defaultConfiguration.integrationId,
        //     customizeConfiguration
        //   );
        // } else {
        //   handleStyle(
        //     customizeConfiguration,
        //     defaultConfiguration.tenant,
        //     defaultConfiguration.projectName
        //   );
        // }

        handleStyle(
          customizeConfiguration,
          defaultConfiguration?.tenant,
          defaultConfiguration?.projectName
        );
      })();
    }, []);

    const [background, setbackground] = useState(false);
    useEffect(() => {
      if (messageList && background) {
        getHistory(messageList?.slice(1));
        conversationContinue();
        setbackground(false);
      }
    }, [messageList, background]);

    useEffect(() => {
      const _handleAppStateChange = (nextAppState) => {
        if (nextAppState === 'active') {
          setbackground(true);
        } else {
          getHistoryBackground();
        }
      };
      AppState.addEventListener('change', _handleAppStateChange);

      return () => {
        AppState.removeEventListener('change', _handleAppStateChange);
      };
    }, []);

    return (
      <Modal
        animationType={'slide'}
        transparent={true}
        visible={visible && Object.keys(appStyle).length > 0}
        onRequestClose={() => {
          hideModal && hideModal();
        }}
      >
        {loading && (
          <LoadingModal
            indicatorColor={customizeConfiguration.indicatorColor ?? ''}
          />
        )}

        {appStyle.closeModalSettings?.use && (
          <CloseModal
            closeModal={closedModalManagment?.closeModal}
            setCloseModal={closedModalManagment?.setCloseModal}
            closeConversation={closeConversation}
            closeModalSettings={customizeConfiguration?.closeModalSettings}
          />
        )}

        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          pointerEvents="box-none"
        >
          <View
            style={[
              styles.header,
              appStyle?.headerColor
                ? { backgroundColor: appStyle?.headerColor }
                : {},
            ]}
          >
            <HeaderComponent
              hideModal={hideModal}
              clickClosedConversationModalFunc={
                clickClosedConversationModalFunc
              }
              defaultConfiguration={defaultConfiguration}
              closeModalStatus={
                customizeConfiguration?.closeModalSettings?.use ? true : false
              }
              closeConversation={closeConversation}
              headerText={appStyle?.headerText || undefined}
              hideIcon={customizeConfiguration?.headerHideIcon}
              closeIcon={customizeConfiguration?.headerCloseIcon}
            />
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor:
                appStyle?.chatBody?.type == 'color'
                  ? appStyle?.chatBody?.value
                  : '#fff',
            }}
          >
            <GenerateBody
              BodyComponent={
                <BodyComponent
                  modules={modules}
                  customizeConfiguration={customizeConfiguration}
                  messageList={messageList}
                  changeInputData={changeInputData}
                  sendMessage={sendMessage}
                />
              }
            />
          </View>
          <View
            style={[
              styles.footer,
              appStyle?.bottomColor
                ? { backgroundColor: appStyle?.bottomColor }
                : {},
            ]}
          >
            <FooterComponent
              modules={modules}
              inputData={inputData}
              changeInputData={changeInputData}
              customizeConfiguration={customizeConfiguration}
              sendMessage={sendMessage}
              sendAudio={sendAudio}
              placeholderText={appStyle?.bottomInputText}
              sendAttachment={sendAttachment}
            />
          </View>
        </KeyboardAvoidingView>
      </Modal>
    );
  }
);

export default ModalComponent;
