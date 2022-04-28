import React, { useState, useCallback, useImperativeHandle, forwardRef, useRef } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { GeneralManager, SignalRClient } from '../services';
import ModalComponent, { ModalCompRef } from '../components/modal';
import { ChatIcon } from '../image';
import type { PropsChatModal } from '../types';

export interface ChatModalRef {
  triggerVisible: () => void;
  startConversation: () => void;
  endConversation: () => void;
  conversationStatus: boolean;
  messageList: any;
}

let sessionId = GeneralManager.createUUID();
let client = new SignalRClient(GeneralManager.getWebchatHost());

export const ChatModal = forwardRef<ChatModalRef, PropsChatModal>((props, ref) => {

  const modalRef = useRef<ModalCompRef>(null);
  const [start, setStart] = useState<boolean>(false);
  const startConversation = () => {
    if (!start) {
      sessionId = GeneralManager.createUUID();
      client = new SignalRClient(props.url);
    }
    setStart(true);
    setVisible(true);
  }
  const endConversation = () => {
    setStart(false);
    setVisible(false);
  }

  const [visible, setVisible] = useState<boolean>(false);
  const triggerVisible = useCallback(() => {
    setVisible(old => !old);
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
    getAllMessages: () => {
      return
    },
    conversationStatus: start,
    messageList: modalRef.current?.messageList
  }));

  const { firstColor, firstSize, firsIcon } = props.customizeConfiguration;

  return (
    <>
      <View style={styles.mainContainer}>
        <TouchableOpacity
          style={[
            styles.floatBottomRight,
            firstColor ? { backgroundColor: firstColor } : {}
          ]}
          onPress={() => startConversation()}
        >
          <Image
            style={{
              width: firstSize || 50,
              height: firstSize || 50,
            }}
            source={GeneralManager.returnIconData(firsIcon?.type, firsIcon?.value, ChatIcon)}
          />
        </TouchableOpacity>
      </View>
      {start && (
        <ModalComponent
          ref={modalRef}
          url={props.url}
          modules={props.modules}
          customizeConfiguration={props.customizeConfiguration}
          defaultConfiguration={props.defaultConfiguration}
          visible={visible}
          closeConversation={endConversation}
          closeModal={triggerVisible}
          sessionId={sessionId}
          client={client}
        //...props} 
        />
      )}
    </>
  );
});


const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'column',
    zIndex: 2,
    flex: 1,
    position: 'absolute',
    alignSelf: 'flex-end',
    bottom: 10,
    right: 10,
  },
  floatBottomRight: {
    backgroundColor: GeneralManager.getColorAndText().backgroundColor,
    padding: 0,
    borderRadius: 50,
  }
});
