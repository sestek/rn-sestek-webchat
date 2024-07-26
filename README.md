# rn-sestek-webchat

 <img src="https://github.com/sestek/rn-sestek-webchat/assets/54579230/a6c0cee3-0711-4d3b-affd-1080950cd82c" width="250" height="473" />
 <img src="https://github.com/sestek/rn-sestek-webchat/assets/54579230/30a4e24a-558e-4206-90c9-bcce8920d831" width="250" height="473" />
 <img src="https://github.com/sestek/rn-sestek-webchat/assets/54579230/e845fa51-8736-452d-b541-9a74367f4876" width="250" height="473" />

## Install

```
npm install rn-sestek-webchat --save
```

---

### If you want to send and listen audio you have to follow the steps below

##### Step 1: Install react-native-audio-recorder-player && Install react-native-audio-record

```
npm install react-native-audio-recorder-player@3.4.0
```

```
npm i --save  react-native-audio-record@0.2.2
```

- To record and " listen " audio, you need to install the package above and [click this link](https://www.npmjs.com/package/react-native-audio-recorder-player) to make the necessary integrations.
- To record and "send " audio, you need to install the package above and [click this link](https://www.npmjs.com/package/react-native-audio-record) to make the necessary integrations.

##### Step 2: Install react-native-fetch-blob

```
npm i --save react-native-fetch-blob@0.10.8
```

If you want to send audio, you must also install the "react-native-fetch-blob" package. Because it is needed to keep the recorded audio in the cache and listen again.
You can follow the [link](https://www.npmjs.com/package/react-native-fetch-blob) below to integrate

##### Step 3: Install react-native-slider

```
npm i --save @miblanchard/react-native-slider
```

If you use to slider, you must also install the "@miblanchard/react-native-slider" package. You can follow the [link](https://www.npmjs.com/package/@miblanchard/react-native-slider) below to integrate

---

### If you want to send files and pictures, you need to follow these steps

##### Step 1: Install react-native-document-picker

RN >= 0.69

```
npm i --save react-native-document-picker@9.1.1
```

0.63 >= RN < 0.69

```
npm i --save react-native-document-picker@8.2.2
```

You can follow the [link](https://www.npmjs.com/package/react-native-document-picker) below to integrate

RN < 0.63 Older RN versions are not supported.

##### Step 2: Install react-native-fetch-blob

```
npm i --save react-native-fetch-blob@0.10.8
```

If you want to send files, you also need to install the "react-native-fetch-blob" package. Because we need it to read the selected file and convert it to base64.
You can follow the [link](https://www.npmjs.com/package/react-native-fetch-blob) below to integrate

---

### Listening to event from conversation

You can easily catch the event with the responseData state you create in your code.
Create the state, then update your state in the setResponse function and send this function to ChatModal as props.
You can also provide whether the state has changed or not with your useffect or alternative solutions.

### custom ActionData

The CustomActionData field can be used for any custom information wanted to be passed to the bot, that's not included in the context object parameters.  
It is recommended to be sent in key/value pairs. i.e.
customActionData: "{\"channel\":\"xxx\",\"phoneNumber\":\"xxx xxx xx xx\",\"customerName\":\"John Doe\"}",

---

## Usage

### If you want to restart an existing session you need to follow these steps (background, screen lock, kill)

##### Step 1: Install @react-native-async-storage/async-storage

```
npm i --save @react-native-async-storage/async-storage
```

You may have a general understanding of how it works with the following snippet.

```javascript
import { ChatModal, ChatModalProps } from 'rn-sestek-webchat';
import AudioRecorderPlayer from 'react-native-audio-recorder-player'; //Required package to listen to audio files
import RNFetchBlob from 'react-native-fetch-blob'; //Required package to listen to audio files
import AudioRecord from 'react-native-audio-record'; //Required package to send audio files as waw
import AudioRecord from 'react-native-audio-record'; //Required package to send audio files as waw
import DocumentPicker from 'react-native-document-picker'

import AsyncStorage from '@react-native-async-storage/async-storage';// for the start storage session


const modalRef = useRef<ChatModalProps>(null);

const pressStartConversation = () => {
    modalRef.current?.startConversation();
}; // open chat wherever you want

const pressEndConversation = () => {
    if (!modalRef.current?.conversationStatus) {
      showMessage({
        backgroundColor: '#7f81ae',
        description: 'The conversation has already ended.',
        message: 'Warning',
      });
    }
    modalRef.current?.endConversation();
}; // stop chat anywhere you want

// capture event from conversation
const [responseData, setResponseData] = useState<any>({});
const setResponse = (value: any) => {
    setResponseData(value);
};

useEffect(() => {
    console.log('response event : ', modalRef.current.responseData);
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
}; // hide chat anywhere you want

const pressGetMessageList = () => {
    const data = modalRef.current?.messageList;
    // console.log(JSON.stringify(data));
}; // conversation history

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
}; // example check audio permission controller for android


const customActionDataExample = {
    tel: '900000000000',
}; // send webchat custom action data

const startStorageSession = () => {
    modalRef.current?.startStorageSession();
};
// start storage session and it should also be used in the case where modal hide does not work depending on navigation,
// i.e. in the case of an existing sessionID. When this function is used, the session will continue where it left off.

// Icon
// In icon components, if you are going to provide an image, the type should be 'component'
// and the value should be called as require('./src/images/test.png'). If you want to give a url instead of an image,
// the type should be 'uri' and the value should be a string url, for example value : "https://test.png"

 <ChatModal
  url={`ConnectionChathubUrl`}
  modules={{
    AudioRecorderPlayer: AudioRecorderPlayer,
    RNFS: RNFetchBlob,
    RNSlider: Slider,
    RNWebView: null,
    Record: AudioRecord,
    RNFileSelector: DocumentPicker,
    asyncStorage: AsyncStorage,
  }}
  ref={modalRef}
  defaultConfiguration={{
    sendConversationStart: true,
    tenant: 'exampleTenant',
    projectName: 'exampleProjectName',
    channel: 'Mobil',
   // clientId: 'Please send the user id',
    enableNdUi: true,
    getResponseData: setResponse,
    customActionData: JSON.stringify(customActionDataExample),
  }}
  customizeConfiguration={{
    // Header
    headerColor: '#7743DB',
    headerText: 'Knovvu',
    headerTextStyle:{
      fontWeight: 'bold',
      fontSize: 18,
      color:'white'
    },
    headerHideIcon: {
      type: 'component',
      value:  <Icon name="example" size={20} color="#900" />,
    },
    headerCloseIcon: {
      type: 'url',
      value: require('./example.png'),
    },
    headerAlignmentType: 'textToCenter',
    // Bottom
    bottomColor: 'white',
    bottomInputText: 'Bottom input text..',
    bottomInputBorderColor: '#d5d5d5',
    bottomInputSendButtonColor: '#7743DB',
    bottomAttachmentIcon: {
      type: 'url',
      value: 'https://example.com/exampleImage.png',
    },
    bottomSendIcon: {
      type: 'componenet',
      value: <Icon name="example" size={20} color="#900" />,
    },
    bottomVoiceIcon: {
      type: 'url',
      value: require('https://example.com/exampleImage.png'),
    },
    bottomVoiceStopIcon: {
      type: 'url',
      value: require('./example.png'),
    },
    bottomVoiceDisabledIcon: {
      type: 'url',
      value: require('./example.png'),
    },
    // User MessageBox
    userMessageBoxBackground: '#863CEB',
    userMessageBoxTextColor: 'white',
    userMessageIcon: { // You can add a profile picture or icon to user messages using this props. If you don't send, the user profile picture or icon will not be visible.
       type: 'url',
       value:
       require('./src/images/knovvu_logo.png'),
      },

    // ChatBot MessageBox
    chatBotMessageBoxBackground: '#EFEFEF',
    chatBotMessageBoxTextColor: 'black',
    chatBotMessageIcon: {
      type: 'url',
      value: require('./example.png'),
    },
    chatBotMessageBoxButtonBackground: 'white',
    chatBotMessageBoxButtonTextColor: 'black',
    chatBotMessageBoxButtonBorderColor: '#863CEB',
    messageBoxAvatarIconSize: 28,
    // Chat Body
    chatBody: {type: 'color', value: 'white'},// Use to set body background color or image.
    chatBodyMessageBoxGap: 20,
    // Chat Start Button
    chatStartButton: {
      type: 'url',
      value: require('./example.png'),
    },
    chatStartButtonBackground: 'white',
    chatStartButtonBackgroundSize: 70,
    chatStartButtonHide: false,
    //Carousel
    chatBotCarouselSettings: {
      nextButtonIcon: {
        type: 'url',
        value: require('./example.png'),
      },
      prevButtonIcon: {
        type: 'url',
        value: require('./example.png'),
      },
      buttonGroup: {
        borderColor: '#E2E2E4',
        backgroundColor: '#ffffff',
        textColor: '#863CEB',
      },
    },
    // Slider
    audioSliderSettings:{
    userSliderMinimumTrackTintColor: '#C3ACD0',
    userSliderMaximumTrackTintColor: 'white',
    userSliderThumbTintColor: '#C3ACD0',
    userSliderPlayImage:{
      type: 'url',
      value: require('./example.png'),
    },
    userSliderPauseImage: {
      type: 'url',
      value: require('./example.png'),
    },
    //bot
    botSliderMinimumTrackTintColor: "red",
    botSliderMaximumTrackTintColor:"blue",
    botSliderThumbTintColor: "black",
    botSliderPlayImage: {
      type: 'url',
      value: require('./example.png'),
    },
    botSliderPauseImage: {
      type: 'url',
      value: require('./example.png'),
    },
    // Before Func
    permissionAudioCheck: permissionAudioCheck,
    //loading indicator
    indicatorColor : "#863CEB",
    //FontSettings
    fontSettings: {
      titleFontSize:18,
      subtitleFontSize: 16,
      descriptionFontSize: 13,
    },
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
    language: {
      tr: {
        headerText: 'Knovvu',
        bottomInputText: 'Lütfen bir mesaj yazınız..',
        closeModalText: 'Chatden çıkmak istediğinize emin misiniz?',
        closeModalYesButtonText: 'Evet',
        closeModalNoButtonText: 'Hayır',
      },
      en: {
        headerText: 'Knovvu',
        bottomInputText: 'Please write a message..',
        closeModalText: 'Are you sure you want to exit chat?',
        closeModalYesButtonText: 'Yes',
        closeModalNoButtonText: 'No',
      },
    },
    dateSettings: {
      use:true,
      backgroundColor: '#EFEFEF',
      textColor: 'black',
      borderRadius:20,
      format:'long' //If you want to change the date format, these props are used.
    },
    autoPlayAudio: false,
  }}
/>


```
NOTE: With the language object in customizeConfiguration, you can update all texts in Chat modal from here. The first value given is set as the default language setting. If no value is given to the language object, the default values of the chat modal will be valid. Please do not forget to enter data in this field for your application. 

```


```

For other additional information, we have created a document that you can use in the table below.

| props              | type    | description                                                                                                                  |
| ------------------ | ------- | ---------------------------------------------------------------------------------------------------------------------------- |
| startConversation  | void    | Function that starts the chat for the user and automatically triggers the modal screen.                                      |
| endConversation    | void    | Function that ends the chat for the user and automatically closes the modal screen.                                          |
| triggerVisible     | void    | Function that opens and closes the modal screen after the chat starts and continues the conversation from where it left off. |
| messageList        | any     | Returns the active chat history.                                                                                             |
| conversationStatus | boolean | Indicates whether there is an active conversation or not.                                                                    |

You can customize your external components with the following values

```javascript
 export default interface PropsCustomizeConfiguration {
  headerColor?: string;
  headerTextStyle?:any;
  headerHideIcon?: IconType;
  headerCloseIcon?: IconType;
  headerAlignmentType?: HeaderAlignmentType;
  bottomColor?: string;
  bottomInputText?: string;
  bottomInputBackgroundColor?: string;
  bottomInputBorderColor?: string;
  bottomVoiceIcon?: IconType;
  bottomVoiceStopIcon?: IconType;
  bottomVoiceDisabledIcon?: IconType;
  bottomSendIcon?: IconType;
  bottomAttachmentIcon?: IconType;
  bottomInputSendButtonColor?: string;
  userMessageBoxTextColor?: string;
  userMessageIcon?: IconType;
  chatBotMessageIcon?: IconType;
  chatBotMessageBoxTextColor?: string;
  chatBotMessageBoxBackground?: string;
  chatBotMessageBoxButtonBackground?: string;
  chatBotMessageBoxButtonBorderColor?: string;
  chatBotMessageBoxButtonTextColor?: string;
  messageBoxAvatarIconSize?: number;
  chatBotCarouselSettings?: CarouselSettings;
  chatBody?: BodyColorOrImageType;
  chatBodyMessageBoxGap?: number;
  chatBodyTimeBackground?: string;
  chatStartButtonHide?: boolean;
  chatStartButton?: IconType;
  chatStartButtonBackground?: string;
  chatStartButtonBackgroundSize?: number;
  userMessageBoxBackground?: string;
  audioSliderSettings?: AudioSliderSettings;
  closeModalSettings?: CloseModalSettings;
  indicatorColor?: string;
  fontSettings?: FontSettings;
  permissionAudioCheck?: () => Promise<void>;
  language?: {
    [key: string]: {
      headerText: string;
      bottomInputText:string;
      closeModalText:string;
      closeModalYesButtonText:string;
      closeModalNoButtonText:string
    };
  };
  dateSettings?:{
    use?:boolean;
    backgroundColor?:string;
    textColor?:string;
    borderRadius?:number;
    format?:DateFormatType;
  },
  autoPlayAudio?: boolean
}

interface BodyColorOrImageType {
  type: 'image' | 'color';
  value: any;
}

type DateFormatType = 'short' | 'long' ;

type HeaderAlignmentType = 'textToLeft' | 'textToRight' | 'textToCenter';

export interface IconType {
  type: 'url' | 'component' | undefined;
  value: string | React.ReactElement | React.ReactNode;
}

export interface FontSettings {
  titleFontSize?:number;
  subtitleFontSize?:number;
  descriptionFontSize?:number;
}

interface CarouselSettings {
  nextButtonIcon?: IconType;
  prevButtonIcon?: IconType;
  buttonGroup?: {
    borderColor?: string;
    backgroundColor?: string;
    textColor?: string;
  };
}

interface CloseModalSettings {
  use: boolean;
  textColor: string;
  background: string;
  buttons: {
    yesButton: {
      textColor: string;
      background: string;
      borderColor: string;
    };
    noButton: {
      textColor: string;
      background: string;
      borderColor: string;
    };
  };
}

export interface AudioSliderSettings {
  userSliderMinimumTrackTintColor?: string;
  userSliderMaximumTrackTintColor?: string;
  userSliderThumbTintColor?: string;
  userSliderPlayImage?: IconType;
  userSliderPauseImage?: IconType;
  botSliderMinimumTrackTintColor?: string;
  botSliderMaximumTrackTintColor?: string;
  botSliderThumbTintColor?: string;
  botSliderPlayImage?: IconType;
  botSliderPauseImage?: IconType;
}


```
