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
import {ChatModal, ChatModalProps} from '../src/index';
import FlashMessage, {showMessage} from 'react-native-flash-message';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFetchBlob from 'react-native-fetch-blob';
import {Slider} from '@miblanchard/react-native-slider';
import {WebView} from 'react-native-webview';
import AudioRecord from 'react-native-audio-record';
import DocumentPicker from 'react-native-document-picker';
import config from './src/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function App() {
  const modalRef = useRef<ChatModalProps>(null);

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

  const startStorageSession = () => {
    modalRef.current?.startStorageSession();
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
        <Pressable style={styles.button} onPress={startStorageSession}>
          <Text style={styles.text}>Deep Test2</Text>
        </Pressable>
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
        url={config.URL_}
        modules={{
          AudioRecorderPlayer: AudioRecorderPlayer,
          RNFS: RNFetchBlob,
          RNSlider: Slider,
          RNWebView: WebView,
          Record: AudioRecord,
          RNFileSelector: DocumentPicker,
          asyncStorage: AsyncStorage,
        }}
        ref={modalRef}
        defaultConfiguration={{
          sendConversationStart: true,
          channel: 'mobil',
          clientId: 'mobile-testing',
           tenant: config.TNAME_,
           projectName: config.PNAME_,
      
          // enableNdUi: false,
          getResponseData: setResponse,
          customActionData: JSON.stringify(customActionDataExample),
        }}
        customizeConfiguration={{
          // Header
          headerColor: '#7743DB',
  
          // headerTextStyle:{
          //   color:'red',
          //   fontSize:20
          // },
          // headerHideIcon: {
          //   type: 'url',
          //   value: require('./src/images/hide.png'),
          // },
          // headerCloseIcon: {
          //   type: 'url',
          //   value: require('./src/images/close.png'),
          // },
          headerAlignmentType: 'textToCenter',
          // Bottom
          bottomColor: 'white',
          bottomInputBackgroundColor: 'white',
          bottomInputBorderColor: '#d5d5d5',
          bottomInputSendButtonColor: '#7743DB',
          //  bottomAttachmentIcon: {
          //    type: 'component',
          //    value: <Icon name="rocket" size={40} color="#900" />,
          //  },
          // bottomSendIcon: {
          //   type: 'component',
          //   value:  <Icon name="rocket" size={40} color="#900" />,
          // },
          // bottomVoiceIcon: {
          //   type: 'component',
          //   value: <Icon name="rocket" size={20} color="black" />,
          // },
          // bottomVoiceStopIcon: {
          //   type: 'component',
          //   value:  <Icon name="rocket" size={20} color="pink" />,
          // },
          // bottomVoiceDisabledIcon: {
          //   type: 'component',
          //   value:  <Icon name="rocket" size={20} color="blue" />,
          // },
          // User MessageBox
          userMessageBoxBackground: '#863CEB',
          userMessageBoxTextColor: 'white',

          // ChatBot MessageBox
          chatBotMessageBoxBackground: '#EFEFEF',
          chatBotMessageBoxTextColor: 'black',
          // chatBotMessageIcon: {
          //   type: 'url',
          //   value:
          //     'https://demo-app.sestek.com/sestek-com-avatar/image/ppp.png',
          // },
          chatBotMessageBoxButtonBackground: 'white',
          chatBotMessageBoxButtonTextColor: '#863CEB',
          chatBotMessageBoxButtonBorderColor: '#EFEFEF',
          chatBotMessageBoxAvatarIconSize: 28,
          // Carousel
          // chatBotCarouselSettings: {
          //   // nextButtonIcon: {
          //   //   type: 'component',
          //   //   value: <Icon name="rocket" size={30} color="#900" />,
          //   // },
          //   //  prevButtonIcon: {
          //   //    type: 'component',
          //   //    value: <Icon name="rocket" size={30} color="#900" />,
          //   //  },
          //   buttonGroup: {
          //     borderColor: '#E2E2E4',
          //     backgroundColor: '#ffffff',
          //     textColor: '#863CEB',
          //   },
          // },
          // Chat Body
          chatBody: {type: 'color', value: 'white'},
          chatBodyMessageBoxGap: 20,
          // Chat Start Button
          chatStartButton: {
            type: 'url',
            value: require('./src/images/knovvu_logo.png'),
          },
          chatStartButtonBackground: 'white',
          chatStartButtonBackgroundSize: 70,
          chatStartButtonHide: false,
          // Slider
          // audioSliderSettings: {
            // userSliderMinimumTrackTintColor: '#C3ACD0',
            // userSliderMaximumTrackTintColor: 'white',
            // userSliderThumbTintColor: '#C3ACD0',
            // userSliderPlayImage: {
            //   type: 'component',
            //   value:  <Icon name="rocket" size={40} color="#900" />,
            // },
            // userSliderPauseImage: {
            //   type: 'url',
            //   value: require('../src/image/pause-audio.png'),
            // },
            //bot
            // botSliderMinimumTrackTintColor: 'red',
            // botSliderMaximumTrackTintColor: 'blue',
            // botSliderThumbTintColor: 'black',
            // botSliderPlayImage: {
            //   type: 'component',
            //   value: <Icon name="rocket" size={40} color="#900" />,
            // },
            // botSliderPauseImage: {
            //   type: 'url',
            //   value: require('../src/image/pause-audio.png'),
            // },
          // },
          // Before Func
          permissionAudioCheck: permissionAudioCheck,
          indicatorColor: '#863CEB',
          // FontSettings
          fontSettings: {
            titleFontSize: 18,
            subtitleFontSize: 16,
            descriptionFontSize: 13,
          },
          // Close Modal
          closeModalSettings: {
            use: true,
            textColor: 'black',
            background: 'white',
            buttons: {
              yesButton: {
                textColor: 'white',
                background: '#863CEB',
                borderColor: 'transparent',
              },
              noButton: {
                textColor: 'black',
                background: 'transparent',
                borderColor: '#863CEB',
              },
            },
          },
          language: {
            tr: {
              headerText: 'Knovvu',
              bottomInputText: 'Lütfen bir mesaj yazınız',
              closeModalText: 'Chatden çıkmak istediğinize emin misiniz?',
              closeModalYesButtonText: 'Evet',
              closeModalNoButtonText: 'Hayır',
            },
            en: {
              headerText: 'Knovvu',
              bottomInputText: 'Please write a message',
              closeModalText: 'Are you sure you want to exit chat?',
              closeModalYesButtonText: 'Yes',
              closeModalNoButtonText: 'No',
            },
          },
          //  dateSettings: {
          //     use:false,
          //    backgroundColor: 'pink',
          //    textColor: 'black',
          //     borderRadius:20
          //  },
          autoPlayAudio: false,
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
