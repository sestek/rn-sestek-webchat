import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import ModalComponent from '../components/modal';
import { ChatIcon } from '../image';
import { GeneralManager, SignalRClient } from '../services';
import type { PropsChatModal } from '../types';

export interface ChatModalRef {
  triggerVisible: () => void;
  startConversation: () => void;
  endConversation: () => void;
  conversationStatus: boolean;
}

let sessionId = GeneralManager.createUUID();
let client = new SignalRClient(GeneralManager.getWebchatHost());

export const ChatModal = forwardRef<ChatModalRef, PropsChatModal>(
  (props, ref) => {
    const [start, setStart] = useState<boolean>(false);
    const startConversation = () => {
      if (!start) {
        sessionId = GeneralManager.createUUID();
        client = new SignalRClient(GeneralManager.getWebchatHost());
      }
      setStart(true);
      setVisible(true);
    };
    const endConversation = () => {
      setStart(false);
      setVisible(false);
    };

    const [visible, setVisible] = useState<boolean>(false);
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
    }));

    const { firstColor, firstSize, firsIcon } = props.customizeConfiguration;

    return (
      <>
        <View style={styles.mainContainer}>
          <TouchableOpacity
            style={[
              styles.floatBottomRight,
              firstColor ? { backgroundColor: firstColor } : {},
            ]}
            onPress={() => startConversation()}
          >
            <Image
              style={{
                width: firstSize || 50,
                height: firstSize || 50,
              }}
              source={GeneralManager.returnIconData(
                firsIcon?.type,
                firsIcon?.value,
                ChatIcon
              )}
            />
          </TouchableOpacity>
        </View>
        {start && (
          <ModalComponent
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
  }
);

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
  },
});
