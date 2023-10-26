import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, View, Text, Image, Pressable} from 'react-native';
import {ChatModal, ChatModalRef} from '../src/index';
import FlashMessage, {showMessage} from 'react-native-flash-message';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFetchBlob from 'react-native-fetch-blob';
import {Slider} from '@miblanchard/react-native-slider';
import {WebView} from 'react-native-webview';
import AudioRecord from 'react-native-audio-record';

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
  };
  useEffect(() => {
    console.log(responseData);
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
    //console.log(JSON.stringify(data));
  };

  const beforeAudioFunc = () => {
    return new Promise<void>((resolve, reject) => {
      resolve();
    });
  };

  const customActionDataEx = {
    tel: '905301138326',
  };

  const customActionDataExNdUi = {
    tel: '905301138326',
    
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
        url={`https://eu.va.knovvu.com/webchat/chathub`}
        //url={`https://nd-test-webchat.sestek.com/chathub`}
        modules={{
          AudioRecorderPlayer: AudioRecorderPlayer,
          RNFS: RNFetchBlob,
          RNSlider: Slider,
          RNWebView: null,
          Record: AudioRecord,
        }}
        ref={modalRef}
        defaultConfiguration={{
          sendConversationStart: true,
          tenant: 'Demo',
          projectName: 'MasterBankingDemo_1_0',
          channel: 'Mobil',
          clientId: 'mobile-testing',
          enableNdUi: false,
          getResponseData: setResponse,
          customActionData: JSON.stringify(customActionDataExNdUi)
        }}
        customizeConfiguration={{
          headerColor: '#7f81ae',
          headerText: 'Knovvu',
          bottomColor: '#7f81ae',
          bottomInputText: 'Bottom input text..',
          //bottomVoiceIcon: "<Cmp />",
          //bottomSendIcon: "<Cmp />",
          incomingIcon: {
            type: 'uri',
            value:
              'https://upload.wikimedia.org/wikipedia/commons/7/70/User_icon_BLACK-01.png',
          },
          incomingText: '',
          incomingTextColor: 'black',
          outgoingIcon: {
            type: 'component',
            value: require('./src/images/knovvu_logo.png'),
          },
          outgoingText: 'Knovvu',
          outgoingTextColor: '#7f81ae',
          messageColor: '#FCFBF7',
          messageBoxColor: '#7f81ae',
          //bodyColorOrImage: { type: 'image', value: 'https://i.pinimg.com/550x/4a/6f/59/4a6f59296f90c11d77744720ca10d1af.jpg' },
          bodyColorOrImage: {type: 'color', value: '#7f81ae'},
          firsIcon: {
            type: 'component',
            value: require('./src/images/knovvu_logo.png'),
          },
          firstColor: 'white',
          firstSize: 70,
          leftMessageBoxColor: 'white',
          sliderMaximumTrackTintColor: 'gray',
          sliderThumbTintColor: 'blue',
          sliderMinimumTrackTintColor: 'pink',
          sliderPauseImage: {
            type: 'image',
            value: require('../src/image/pause2.png'),
          },
          sliderPlayImage: {
            type: 'image',
            value: require('../src/image/play2.png'),
          },
          beforeAudioClick: beforeAudioFunc,
          closeModalSettings: {
            use: true,
            text: "Chat'ten çıkmak istediğinize emin misiniz ?",
            textColor: 'black',
            background: 'white',
            buttons: {
              yesButton: {
                text: 'Evet',
                textColor: 'white',
                background: '#7f81ae',
                borderColor: 'transparent',
              },
              noButton: {
                text: 'Hayır',
                textColor: 'black',
                background: 'transparent',
                borderColor: 'black',
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
    backgroundColor: '#abaee6',
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
