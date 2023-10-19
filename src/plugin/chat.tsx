import React, {
  useState,
  useCallback,
  useImperativeHandle,
  forwardRef,
  useRef,
  useEffect,
} from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Modal,
  Platform,
  Text,
} from 'react-native';
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
console.log("sesiom : ",sessionId)
export const ChatModal = forwardRef<ChatModalRef, PropsChatModal>(
  (props, ref) => {
    if (props?.defaultConfiguration?.enableNdUi) {
      sessionId = 'Mobil' + sessionId;
      props.defaultConfiguration.channel = 'NdUi';
    }

    const [closeModal, setCloseModal] = useState<boolean>(false);

    const modalRef = useRef<ModalCompRef>(null);
    const [start, setStart] = useState<boolean>(false);
    const startConversation = () => {
      if (!start) {
        sessionId = GeneralManager.createUUID();
        client = new SignalRClient(props?.url || '');
      }
      setStart(true);
      setVisible(true);
      if (props.modules?.RNFS) {
        let dirs = props.modules.RNFS.fs.dirs;
        let folderPath = dirs.DocumentDir + '/sestek_bot_audio'; // cached folder.
        props.modules?.RNFS.fs
          .mkdir(folderPath)
          .then((res) => console.log(res))
          .catch((err) => console.log(err));
      }
    };

    const endConversation = async () => {
      setStart(false);
      setVisible(false);
      if (props.modules?.RNFS) {
        let dirs = props.modules.RNFS.fs.dirs;
        let folderPath = dirs.DocumentDir + '/sestek_bot_audio'; // cached folder.
        props.modules.RNFS.fs
          .unlink(folderPath)
          .then((res) => console.log(res))
          .catch((err) => console.log(err));
      }
    };

    const clickClosedConversationModalFunc = () => {
      setCloseModal(true);
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
      getAllMessages: () => {
        return;
      },
      conversationStatus: start,
      messageList: modalRef.current?.messageList,
      responseData: modalRef.current?.responseData,
    }));

    const { firstColor, firstSize, firsIcon, firstIconHide } =
      props.customizeConfiguration;

    return (
      <>
        {!firstIconHide && (
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
        )}
        {start && (
          <ModalComponent
            ref={modalRef}
            url={props?.url || ''}
            modules={props.modules}
            customizeConfiguration={props.customizeConfiguration}
            defaultConfiguration={props.defaultConfiguration}
            visible={visible}
            closeConversation={endConversation}
            closeModal={triggerVisible}
            sessionId={sessionId}
            client={client}
            closedModalManagment={{ closeModal, setCloseModal }}
            clickClosedConversationModalFunc={clickClosedConversationModalFunc}
            //...props}
          />
        )}
      </>
    );
  }
);

ChatModal.defaultProps = {
  //url: 'http://192.168.20.72:55022/chathub'
  //  url: 'https://stable.web.cai.demo.sestek.com/webchat/chathub',
  //url: 'https://nd-test-webchat.sestek.com/chathub'
  // url:'https://eu.va.knovvu.com/webchat/chathub'
  url: 'https://igavassistwebchat.igairport.aero:6443/chathub',
};

//`https://nd-test-webchat.sestek.com/chathub`;

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
