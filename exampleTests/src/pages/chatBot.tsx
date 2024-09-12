import React, {useRef, useState, useLayoutEffect} from 'react';
import {Image, Pressable, PermissionsAndroid, Platform} from 'react-native';
import {ChatModal, ChatModalProps} from '../../../src/index';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFetchBlob from 'react-native-fetch-blob';
import {Slider} from '@miblanchard/react-native-slider';
import {WebView} from 'react-native-webview';
import AudioRecord from 'react-native-audio-record';
import DocumentPicker from 'react-native-document-picker';
import config from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation, useRoute, useIsFocused} from '@react-navigation/native'; // Import useNavigation for navigation
import {CloseIcon, MinusIcon} from '../../../src/image';

export default function ChatbotScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const modalRef = useRef<ChatModalProps>(null);

  const isFocused = useIsFocused();

  useLayoutEffect(() => {
    if (isFocused) {
      modalRef.current?.startConversation();
    }
  }, [isFocused]);

  const [responseData, setResponseData] = useState<any>({});
  const setResponse = (value: any) => {
    setResponseData(value);
    // console.log('value', value);
  };

  const customActionDataExample = {
    user_id: 'e32c9a7f-63e7-4886-84e8-6fb8f5ef976d',
  };

  const endUserInfo = {
    name: 'sestek user',
    phone: '+905555555555',
    email: 'sestek@doe.com',
    twitter: '@sestek',
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
  return (
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
        channel: 'webchatmobile-sestek',
        // clientId: '1111',
        tenant: config.TNAME_,
        projectName: config.PNAME_,
        locale:'en-US',
        // fullName:'',
        endUser: endUserInfo,
        getResponseData: setResponse,
        customActionData: JSON.stringify(customActionDataExample),
      }}
      customizeConfiguration={{
        permissionAudioCheck: permissionAudioCheck,
        // headerCloseIcon: {
        //   type: 'component',
        //   value: (
        //     <Image source={CloseIcon} style={{width: 20, height: 20}}></Image>
        //   ),
        // },
        autoPlayAudio: false,
        headerHideIcon: {
          type: 'component',
          value: (
            <Pressable
              onPress={() => {
                modalRef.current?.triggerVisible();
                navigation.navigate('Example');
              }}>
              <Image source={MinusIcon} style={{width: 20, height: 20}} />
            </Pressable>
          ),
        },
        closeModalSettings: {
          use: true,
          onClose: () => {
            navigation.navigate('Home');
          },
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

          es: {
            headerText: 'Knovvu',
            bottomInputText: 'Please write a message',
            closeModalText: 'Are you sure you want to exit chat?',
            closeModalYesButtonText: 'Yes',
            closeModalNoButtonText: 'No',
          },
        },
      }}
    />
  );
}
