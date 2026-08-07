import React, {
  forwardRef,
  useState,
  useImperativeHandle,
  useEffect,
  useRef,
  useMemo,
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

// modules.SafeAreaContext verilmediginde kullanilan yedek: guvenli alan
// hesabi yapmaz, yalnizca cocuklarini cizer (`edges` yok sayilir).
const PassthroughView = ({ children, style }: any) => (
  <View style={style}>{children}</View>
);

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
    const { SafeAreaContext } = modules || {};

    // modules.SafeAreaContext OPSIYONEL. Verilmezse inset uygulanmaz ve duz
    // View'e dusulur; verilirse header/footer guvenli alan payini alir.
    // (Burada bir sure `return null` vardi: bu prop'u gecmeyen mevcut
    // entegrasyonlarda sohbet HIC render edilmiyordu.)
    const SafeAreaProvider =
      SafeAreaContext?.SafeAreaProvider ?? PassthroughView;
    const SafeAreaView = SafeAreaContext?.SafeAreaView ?? PassthroughView;

    const { loading } = useLoading();
    const { background } = useCheckBackground();

    const [showInfo, setShowInfo] = useState(false);
    const [inputData, setInputData] = useState('');
    const [isDropdownVisible, setDropdownVisible] = useState(false);

    const scrollViewRef = useRef<ScrollView>(null);

    const toggleInfo = () => setShowInfo((v) => !v);
    const changeInputData = (text: string) => setInputData(text);

    const {
      messageList,
      sendMessage,
      sendAudio,
      sendAttachment,
      getHistory,
      continueIfNeeded,
      sendEnd,
      exceededFileSize,
      setExceededFileSize,
    } = useChat({
      url,
      defaultConfiguration,
      sessionId,
      client,
      rnfs: modules?.RNFS,
    });

    useImperativeHandle(
      ref,
      () => ({
        messageList,
        sendEnd,
      }),
      [messageList, sendEnd]
    );

    const handlersRef = useRef({ getHistory, continueIfNeeded });
    handlersRef.current = { getHistory, continueIfNeeded };

    // Sohbet gorunur oldugunda ve uygulama arka plandan ONE dondugunde
    // history ile senkronlan; arka plandayken bir sey yapma.
    useEffect(() => {
      if (!visible || background) {
        return;
      }

      handlersRef.current.getHistory?.();
      handlersRef.current.continueIfNeeded?.();
    }, [visible, background]);

    const closeSizeWarningModal = () => {
      setExceededFileSize(false);
    };

    const isAndroid = Platform.OS === 'android';

    const isVisible = visible && Object.keys(customizeConfiguration).length > 0;

    const headerStyle = useMemo(
      () =>
        customizeConfiguration?.headerColor
          ? { backgroundColor: customizeConfiguration.headerColor }
          : undefined,
      [customizeConfiguration?.headerColor]
    );

    const footerStyle = useMemo(
      () =>
        customizeConfiguration?.bottomColor
          ? { backgroundColor: customizeConfiguration.bottomColor }
          : undefined,
      [customizeConfiguration?.bottomColor]
    );

    const bodyBackgroundStyle = useMemo(
      () => ({
        backgroundColor:
          customizeConfiguration?.chatBody?.type === 'color'
            ? customizeConfiguration.chatBody.value
            : '#fff',
      }),
      [
        customizeConfiguration?.chatBody?.type,
        customizeConfiguration?.chatBody?.value,
      ]
    );

    const infoBg = customizeConfiguration?.chatBody?.value ?? '#fff';

    return (
      <Modal
        animationType="slide"
        transparent
        visible={isVisible}
        onRequestClose={() => hideModal?.()}
      >
        <SafeAreaProvider>
          {loading && (
            <LoadingModal
              indicatorColor={customizeConfiguration?.indicatorColor ?? 'black'}
            />
          )}

          {customizeConfiguration?.closeModalSettings?.use && (
            <CloseModal
              closeModal={closedModalManagment?.closeModal}
              setCloseModal={closedModalManagment?.setCloseModal}
              closeConversation={closeConversation}
              closeModalSettings={customizeConfiguration.closeModalSettings}
              getResponseData={defaultConfiguration?.getResponseData}
            />
          )}
          <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            pointerEvents="box-none"
          >
            <SafeAreaView edges={isAndroid ? ['top'] : []} style={headerStyle}>
              <View style={[styles.header, headerStyle]}>
                <HeaderComponent
                  hideModal={hideModal}
                  clickClosedConversationModalFunc={
                    clickClosedConversationModalFunc
                  }
                  defaultConfiguration={defaultConfiguration}
                  closeModalStatus={
                    !!customizeConfiguration?.closeModalSettings?.use
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
            </SafeAreaView>

            <View style={[{ flex: 1 }, bodyBackgroundStyle]}>
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

                      <SafeAreaView>
                        <View style={[styles.footer, footerStyle]}>
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
                      </SafeAreaView>
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
        </SafeAreaProvider>
      </Modal>
    );
  }
);

export { ModalComponent, ModalCompRef };
