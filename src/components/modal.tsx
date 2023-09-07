import React, { forwardRef, useState, useImperativeHandle } from 'react';
import {
  Alert,
  Modal,
  View,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useChat } from '../plugin/useChat';
import type { PropsModalComponent } from '../types';
import BodyComponent from './body';
import FooterComponent from './footer';
import HeaderComponent from './header';
import { styles } from './modal-style';
import CloseModal from './closeModal';

export interface ModalCompRef {
  messageList: any;
}

const ModalComponent = forwardRef<ModalCompRef, PropsModalComponent>(
  (props, ref) => {
    const [inputData, setInputData] = useState<string>('');
    const changeInputData = (text: string) => setInputData(text);

    const [messageList, sendMessage, sendAudio] = useChat({
      url: props?.url,
      defaultConfiguration: props.defaultConfiguration,
      messages: [],
      sessionId: props.sessionId,
      client: props.client,
      rnfs: props.modules.RNFS,
    });

    //console.log(JSON.stringify(messageList));
    const {
      bodyColorOrImage,
      headerColor,
      headerText,
      bottomColor,
      bottomInputText,
    } = props.customizeConfiguration;

    useImperativeHandle(ref, () => ({
      messageList: messageList,
    }));

    return (
      <Modal
        animationType={'slide'}
        transparent={true}
        visible={props.visible}
        onRequestClose={() => {
          props.closeModal();
        }}
      >
        <CloseModal
          closeModal={props?.closedModalManagment?.closeModal}
          setCloseModal={props?.closedModalManagment?.setCloseModal}
          closeConversation={props?.closeConversation}
          closeModalSettings={props?.customizeConfiguration?.closeModalSettings}
        />

        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          pointerEvents="box-none"
        >
          <View
            style={[
              styles.header,
              headerColor ? { backgroundColor: headerColor } : {},
            ]}
          >
            <HeaderComponent
              {...props}
              headerText={headerText || undefined}
              hideIcon={props.customizeConfiguration.hideIcon}
              closeIcon={props.customizeConfiguration.closeIcon}
            />
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor:
                bodyColorOrImage?.type == 'color'
                  ? bodyColorOrImage.value
                  : '#fff',
            }}
          >
            {bodyColorOrImage?.type == 'image' && (
              <ImageBackground
                source={{ uri: bodyColorOrImage?.value }}
                style={{ width: '100%', height: '100%' }}
                resizeMode="stretch"
              >
                <BodyComponent
                  modules={props.modules}
                  customizeConfiguration={props.customizeConfiguration}
                  messageList={messageList}
                  changeInputData={changeInputData}
                  sendMessage={sendMessage}
                />
              </ImageBackground>
            )}
            {bodyColorOrImage?.type != 'image' && (
              <BodyComponent
                modules={props.modules}
                customizeConfiguration={props.customizeConfiguration}
                messageList={messageList}
                changeInputData={changeInputData}
                sendMessage={sendMessage}
              />
            )}
          </View>
          <View
            style={[
              styles.footer,
              bottomColor ? { backgroundColor: bottomColor } : {},
            ]}
          >
            <FooterComponent
              {...props}
              inputData={inputData}
              changeInputData={changeInputData}
              sendMessage={sendMessage}
              sendAudio={sendAudio}
              placeholderText={bottomInputText}
            />
          </View>
        </KeyboardAvoidingView>
      </Modal>
    );
  }
);

export default ModalComponent;
