import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Pressable,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {ChatModal, ChatModalRef} from '../src/index';
import FlashMessage, {showMessage} from 'react-native-flash-message';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFetchBlob from 'react-native-fetch-blob';
import {Slider} from '@miblanchard/react-native-slider';
import {WebView} from 'react-native-webview';
import AudioRecord from 'react-native-audio-record';
import DocumentPicker from 'react-native-document-picker';
import config from './src/config';

export default function App() {
  const modalRef = useRef<ChatModalRef>(null);

  const pressStartConversation = () => {
    modalRef.current?.startConversation();
  };
  const pressEndConversation = () => {
    if (!modalRef.current?.conversationStatus) {
      showMessage({
        backgroundColor: '#7f81ae',
        description: 'The conversation has already ended.',
        message: 'Warning',
      });
    }
    modalRef.current?.endConversation();
  };

  const [responseData, setResponseData] = useState<any>({});
  const setResponse = (value: any) => {
    setResponseData(value);
    console.log('value', value);
  };

  useEffect(() => {
    // console.log('response event : ', modalRef.current.responseData);
  }, [responseData]);

  const pressTriggerVisible = () => {
    if (!modalRef.current?.conversationStatus) {
      showMessage({
        backgroundColor: '#7f81ae',
        description: 'First you need to start the conversation.',
        message: 'Warning',
      });
      return;
    }
    modalRef.current?.triggerVisible();
  };

  const pressGetMessageList = () => {
    const data = modalRef.current?.messageList;
    console.log(JSON.stringify(data));
  };

  const permissionAudioCheck = async () => {
    return new Promise<void>((resolve, reject) => {
      if (Platform.OS === 'android') {
        PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ).then(res => {
          if (res === PermissionsAndroid.RESULTS.GRANTED) {
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  };

  const customActionDataExample = {
    tel: '900000000000',
  };
  return (
    <View style={styles.container}>
      <View style={{flex: 1}}>
        <Image
          style={{height: 300}}
          source={require('./src/images/knovvu_subtitle.png')}
          resizeMode="contain"
        />
      </View>

      <View style={{flex: 1}}>
        <Pressable style={styles.button} onPress={pressStartConversation}>
          <Text style={styles.text}>Start Conversation</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={pressEndConversation}>
          <Text style={styles.text}>End Conversation</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={pressTriggerVisible}>
          <Text style={styles.text}>Trigger Visible</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={pressGetMessageList}>
          <Text style={styles.text}>Get Message Data</Text>
        </Pressable>
      </View>
      {/*<View style={{ flex: 1, flexDirection: 'row' }}>
        <Pressable style={[styles.button, styles.buttonRow]} onPress={() => recorder.onStartRecord()}>
          <Text style={styles.text}>Start Record</Text>
        </Pressable>
        <Pressable style={[styles.button, styles.buttonRow]} onPress={() => recorder.onStopRecord()}>
          <Text style={styles.text}>Stop Record</Text>
        </Pressable>
        <Pressable style={[styles.button, styles.buttonRow]} onPress={() => {
          recorder.onStartPlay();
          //'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
        }}>
          <Text style={styles.text}>Record Play</Text>
        </Pressable>
      </View>*/}
      <View style={{flex: 0.5, justifyContent: 'center'}}>
        <Text style={{margin: 20, fontSize: 12, fontWeight: '100'}}>
          Sestek is a global technology company helping organizations with
          Conversational Solutions to be data-driven, increase efficiency and
          deliver better experiences for their customers. Sestek’s AI-powered
          solutions are build on text-to-speech, speech recognition, natural
          language processing and voice biometrics technologies.
        </Text>
      </View>
      <FlashMessage position="top" />
      {/* @ts-expect-error Server Component */}
      <ChatModal
         url={config?.URL}
        modules={{
          AudioRecorderPlayer: AudioRecorderPlayer,
          RNFS: RNFetchBlob,
          RNSlider: Slider,
          RNWebView: WebView,
          Record: AudioRecord,
          RNFileSelector: DocumentPicker,
        }}
        ref={modalRef}
        defaultConfiguration={{
          sendConversationStart: true,

          channel: 'mobil',
          clientId: 'mobile-testing',
           tenant: config.TNAME,
           projectName: config.PNAME,

          // enableNdUi: false,
          getResponseData: setResponse,
          customActionData: JSON.stringify(customActionDataExample),
        }}
        customizeConfiguration={{
          // Header
          headerColor: '#7743DB',
          headerText: 'Knovvu',
          headerTextColor: 'white',
          headerHideIcon: {
            type: 'component',
            value: require('./src/images/hide.png'),
          },
          headerCloseIcon: {
            type: 'component',
            value: require('./src/images/close.png'),
          },
          // Bottom
          bottomColor: 'white',
          bottomInputText: 'Bottom input text..',
          bottomInputBorderColor: '#d5d5d5',
          bottomInputSendButtonColor: '#7743DB',
          // bottomAttachmentIcon: {
          //   type: 'component',
          //   value: require('./example.png'),
          // },
          // bottomSendIcon: {
          //   type: 'component',
          //   value: require('./example.png'),
          // },
          // bottomVoiceIcon: {
          //   type: 'component',
          //   value: require('./example.png'),
          // },
          // bottomVoiceStopIcon: {
          //   type: 'component',
          //   value: require('./example.png'),
          // },
          // bottomVoiceDisabledIcon: {
          //   type: 'component',
          //   value: require('./example.png'),
          // },
          // User MessageBox
          userMessageBoxBackground: '#863CEB',
          userMessageBoxTextColor: 'white',
          userMessageBoxIcon: {
            type: 'uri',
            value: '',
          },
          userMessageBoxHeaderName: '',
          userMessageBoxHeaderNameColor: 'white',
          // ChatBot MessageBox
          chatBotMessageBoxBackground: '#EFEFEF',
          chatBotMessageBoxTextColor: 'black',
          chatBotMessageIcon: {
            type: 'component',
            value: require('./src/images/knovvu_logo.png'),
          },
          chatBotMessageBoxHeaderName: 'Knovvu',
          chatBotMessageBoxHeaderNameColor: 'black',
          chatBotMessageBoxButtonBackground: 'white',
          chatBotMessageBoxButtonTextColor: 'black',
          chatBotMessageBoxButtonBorderColor: '#863CEB',
          // Chat Body
          chatBody: {type: 'color', value: 'white'},
          // Chat Start Button
          chatStartButton: {
            type: 'component',
            value: require('./src/images/knovvu_logo.png'),
          },
          chatStartButtonBackground: 'white',
          chatStartButtonBackgroundSize: 70,
          chatStartButtonHide: false,
          // Slider
          sliderMaximumTrackTintColor: 'white',
          sliderThumbTintColor: '#C3ACD0',
          sliderMinimumTrackTintColor: '#C3ACD0',
          sliderPauseImage: {
            type: 'image',
            value: require('../src/image/pause-audio.png'),
          },
          sliderPlayImage: {
            type: 'image',
            value: require('../src/image/play-audio.png'),
          },
          // Before Func
          permissionAudioCheck: permissionAudioCheck,
          indicatorColor: '#863CEB',
          // Close Modal
          closeModalSettings: {
            use: true,
            text: "Chat'ten çıkmak istediğinize emin misiniz ?",
            textColor: 'black',
            background: 'white',
            buttons: {
              yesButton: {
                text: 'Evet',
                textColor: 'white',
                background: '#863CEB',
                borderColor: 'transparent',
              },
              noButton: {
                text: 'Hayır',
                textColor: 'black',
                background: 'transparent',
                borderColor: '#863CEB',
              },
            },
          },
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#b796e7',
    //marginTop: Platform.OS === "ios" ? 33 : 0,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'white',
    marginBottom: 10,
  },
  buttonRow: {
    fontSize: 5,
    margin: 5,
    maxHeight: 75,
    maxWidth: 125,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: '#7f81ae',
  },
});
