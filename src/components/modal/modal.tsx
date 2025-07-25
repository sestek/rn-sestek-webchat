import React, {
  forwardRef,
  useState,
  useImperativeHandle,
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
import { useCustomizeConfiguration } from '../../context/CustomizeContext';
import { useModules } from '../../context/ModulesContext';
import FileSizeWarningModal from '../fileSizeWarningModal';
import { InfoAreaView } from '../header/InfoAreaView';
const ModalComponent = forwardRef<ModalCompRef, PropsModalComponent>(
  (props, ref) => {
    const {
      url,
      defaultConfiguration,
      sessionId,
      client,
      closeConversation,
      closedModalManagment,
      hideModal,
      visible,
      clickClosedConversationModalFunc,
    } = props;

    const { customizeConfiguration } = useCustomizeConfiguration();
    const { modules } = useModules();
    const [showInfo, setShowInfo] = useState(false);
    const toggleInfo = () => setShowInfo((v) => !v);
    const [inputData, setInputData] = useState<string>('');
    const changeInputData = (text: string) => setInputData(text);
    const scrollViewRef = useRef<ScrollView>(null);
    const { loading } = useLoading();
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const {
      messageList,
      sendMessage,
      sendAudio,
      sendAttachment,
      getHistory,
      conversationContinue,
      getHistoryBackground,
      sendEnd,
      exceededFileSize,
      setExceededFileSize,
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

    const closeSizeWarningModal = () => {
      setExceededFileSize(false);
    };
    const infoBg = customizeConfiguration?.chatBody?.value ?? '#fff';
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
          <>
            <LoadingModal
              indicatorColor={customizeConfiguration?.indicatorColor ?? 'black'}
            />
          </>
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
              onToggleInfo={
                customizeConfiguration?.infoArea ? toggleInfo : undefined
              }
              isInfoVisible={showInfo}
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
            {showInfo ? (
              <InfoAreaView
                markdown={customizeConfiguration?.infoInput ?? ''}
                background={infoBg}
              />
            ) : (
              <GenerateBody
                BodyComponent={
                  <>
                    <BodyComponent
                      messageList={messageList}
                      changeInputData={changeInputData}
                      sendMessage={sendMessage}
                      scrollViewRef={scrollViewRef}
                      defaultConfiguration={defaultConfiguration}
                      url={url}
                    />
                    <View
                      style={[
                        styles.footer,
                        customizeConfiguration?.bottomColor
                          ? {
                              backgroundColor:
                                customizeConfiguration?.bottomColor,
                            }
                          : {},
                      ]}
                    >
                      <FooterComponent
                        inputData={inputData}
                        changeInputData={changeInputData}
                        sendMessage={sendMessage}
                        sendAudio={sendAudio}
                        sendAttachment={sendAttachment}
                        scrollViewRef={scrollViewRef}
                        isDropdownVisible={isDropdownVisible}
                        setDropdownVisible={setDropdownVisible}
                      />
                    </View>
                  </>
                }
              />
            )}
          </View>
          <FileSizeWarningModal
            visible={exceededFileSize}
            onClose={closeSizeWarningModal}
          />
        </KeyboardAvoidingView>
      </Modal>
    );
  }
);

export { ModalComponent, ModalCompRef };
