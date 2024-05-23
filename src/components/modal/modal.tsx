import React, {
  forwardRef,
  useState,
  useImperativeHandle,
  useContext,
  useEffect,
  useRef,
} from 'react';
import {
  Modal,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useChat } from '../../plugin/useChat';
import type { PropsModalComponent } from '../../types';
import BodyComponent from '../body';
import FooterComponent from '../footer';
import HeaderComponent from '../header';
import { styles } from './style';
import CloseModal from '../closeModal';
import { ModalCompRef } from '../../types/components/ModalComponent';
import GenerateBody from '../body/GenerateBody';
import LoadingModal from '../loadingModal';
import { useLoading } from '../../context/LoadingContext';
import useCheckBackground from '../../hook/useCheckBackground';
import { CustomizeConfigurationContext } from '../../context/CustomizeContext';
const ModalComponent = forwardRef<ModalCompRef, PropsModalComponent>(
  (props, ref) => {
    const {
      url,
      defaultConfiguration,
      sessionId,
      client,
      modules,
      closeConversation,
      closedModalManagment,
      hideModal,
      visible,
      clickClosedConversationModalFunc,
    } = props;

    const context = useContext(CustomizeConfigurationContext);
    const { customizeConfiguration } = context;

    const [inputData, setInputData] = useState<string>('');
    const changeInputData = (text: string) => setInputData(text);
    const scrollViewRef = useRef<ScrollView>(null);
    const { loading } = useLoading();

    const {
      messageList,
      sendMessage,
      sendAudio,
      sendAttachment,
      getHistory,
      conversationContinue,
      getHistoryBackground,
      sendEnd,
    } = useChat({
      url: url,
      defaultConfiguration: defaultConfiguration,
      sessionId: sessionId,
      client: client,
      rnfs: modules?.RNFS,
    });

    useImperativeHandle(ref, () => ({
      messageList: messageList,
      sendEnd: sendEnd,
    }));


    const { background } = useCheckBackground();
    useEffect(() => {
      if (background) {
        getHistoryBackground && getHistoryBackground();
      } else {
        getHistory && getHistory();
        conversationContinue && conversationContinue();
      }
    }, [background]);

    return (
      <Modal
        animationType={'slide'}
        transparent={true}
        visible={visible && Object.keys(customizeConfiguration).length > 0}
        onRequestClose={() => {
          hideModal && hideModal();
        }}
      >
        {loading && (
          <LoadingModal
            indicatorColor={customizeConfiguration?.indicatorColor ?? ''}
          />
        )}

        {customizeConfiguration?.closeModalSettings?.use && (
          <CloseModal
            closeModal={closedModalManagment?.closeModal}
            setCloseModal={closedModalManagment?.setCloseModal}
            closeConversation={closeConversation}
            closeModalSettings={customizeConfiguration?.closeModalSettings}
            getResponseData={defaultConfiguration?.getResponseData}
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
              customizeConfiguration?.headerColor
                ? { backgroundColor: customizeConfiguration?.headerColor }
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
              hideIcon={customizeConfiguration?.headerHideIcon}
              closeIcon={customizeConfiguration?.headerCloseIcon}
            />
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor:
              customizeConfiguration?.chatBody?.type == 'color'
                  ? customizeConfiguration?.chatBody?.value
                  : '#fff',
            }}
          >
            <GenerateBody
              BodyComponent={
                <BodyComponent
                  modules={modules}
                  messageList={messageList}
                  changeInputData={changeInputData}
                  sendMessage={sendMessage}
                  scrollViewRef={scrollViewRef}
                />
              }
            />
          </View>
          <View
            style={[
              styles.footer,
              customizeConfiguration?.bottomColor
                ? { backgroundColor: customizeConfiguration?.bottomColor }
                : {},
            ]}
          >
            <FooterComponent
              modules={modules}
              inputData={inputData}
              changeInputData={changeInputData}
              sendMessage={sendMessage}
              sendAudio={sendAudio}
              sendAttachment={sendAttachment}
              scrollViewRef={scrollViewRef}
            />
          </View>
        </KeyboardAvoidingView>
      </Modal>
    );
  }
);

export { ModalComponent, ModalCompRef };
