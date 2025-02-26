import React, { createContext, useState, useEffect, useContext } from 'react';
import type PropsCustomizeConfiguration from '../types/propsCustomizeConfiguration';
import {
  Back,
  CloseIcon,
  FileIcon,
  KnovuuIcon,
  Link,
  MinusIcon,
  Next,
  PauseIcon,
  PlayIcon,
  RecordDisable,
  RecordInIcon,
  RecordOutIcon,
  SendIconWhite,
} from '../image';

interface CustomizeConfigurationContextType {
  customizeConfiguration: PropsCustomizeConfiguration;
  setCustomizeConfiguration: React.Dispatch<
    React.SetStateAction<PropsCustomizeConfiguration>
  >;
  language: string;
  changeLanguage: (newLanguage: string) => void;
  getTexts: () => Record<string, string>;
}

export const defaultCustomizeConfiguration: PropsCustomizeConfiguration = {
  headerColor: '#7743DB',
  headerTextStyle: {
    fontWeight: 'bold',
    fontSize: 15,
    color: 'white',
  },
  headerHideIcon: {
    type: 'url',
    value: MinusIcon,
  },
  headerCloseIcon: {
    type: 'url',
    value: CloseIcon,
  },
  headerAlignmentType: 'textToCenter',
  bottomColor: 'transparent',
  bottomInputBackgroundColor: 'white',
  bottomInputBorderColor: '#d5d5d5',
  bottomInputSendButtonColor: '#7743DB',
  bottomAttachmentIcon: {
    type: 'url',
    value: Link,
  },
  bottomSendIcon: {
    type: 'url',
    value: SendIconWhite,
  },
  bottomVoiceIcon: {
    type: 'url',
    value: RecordOutIcon,
  },
  bottomVoiceStopIcon: {
    type: 'url',
    value: RecordInIcon,
  },
  bottomVoiceDisabledIcon: {
    type: 'url',
    value: RecordDisable,
  },
  userMessageBoxBackground: '#863CEB',
  userMessageBoxTextColor: 'white',
  userMessageIcon: {
    type: undefined,
    value: undefined,
  },
  chatBotMessageBoxBackground: '#EFEFEF',
  chatBotMessageBoxTextColor: 'black',
  chatBotMessageIcon: {
    type: 'url',
    value: KnovuuIcon,
  },
  chatBotMessageBoxButtonBackground: 'white',
  chatBotMessageBoxButtonTextColor: '#863CEB',
  chatBotMessageBoxButtonBorderColor: '#EFEFEF',
  messageBoxAvatarIconSize: 28,
  chatBotCarouselSettings: {
    nextButtonIcon: {
      type: 'url',
      value: Next,
    },
    prevButtonIcon: {
      type: 'url',
      value: Back,
    },
    buttonGroup: {
      borderColor: undefined,
      backgroundColor: undefined,
      textColor: undefined,
    },
  },
  chatBody: { type: 'color', value: 'white' },
  chatBodyMessageBoxGap: 20,
  chatStartButton: {
    type: 'url',
    value: KnovuuIcon,
  },
  chatStartButtonBackground: 'white',
  chatStartButtonBackgroundSize: 70,
  chatStartButtonHide: false,
  audioSliderSettings: {
    userUnplayedTrackColor: 'white',
    userPlayedTrackColor: '#FF4081',
    userTimerTextColor: 'white',
    userSliderPlayImage: {
      type: 'url',
      value: PlayIcon,
    },
    userSliderPauseImage: {
      type: 'url',
      value: PauseIcon,
    },
    botUnplayedTrackColor: 'gray',
    botPlayedTrackColor: '#007BFF',
    botTimerTextColor: 'black',
    botSliderPlayImage: {
      type: 'url',
      value: PlayIcon,
    },
    botSliderPauseImage: {
      type: 'url',
      value: PauseIcon,
    },
  },
  permissionAudioCheck: async () => {},
  indicatorColor: '#863CEB',
  fontSettings: {
    titleFontSize: 18,
    subtitleFontSize: 16,
    descriptionFontSize: 13,
  },
  closeModalSettings: {
    use: true,
    textColor: 'black',
    background: 'white',
    onClose: () => {},
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
      filePTitle: 'Depolama İzni Gerekli',
      filePMessage:
        'Bu uygulamanın dosya kaydetmesi ve açması için izne ihtiyacı var.',
      filePNeutral: 'Daha Sonra',
      filePNegative: 'İptal',
      filePPositive: 'Tamam',
      noAppFoundTitle: 'Uygulama Bulunamadı',
      noAppFoundMessage:
        'Bu dosya türünü açmak için uygun bir uygulama bulunamadı. Google Play Store’dan bir uygulama yükleyin.',
      noAppFoundCancel: 'İptal',
      addFile: 'Add File',
      addPhoto: 'Add Photo',
      fileErrorText: 'The file size must be smaller than 10MB.',
    },
    en: {
      headerText: 'Knovvu',
      bottomInputText: 'Please write a message',
      closeModalText: 'Are you sure you want to exit chat?',
      closeModalYesButtonText: 'Yes',
      closeModalNoButtonText: 'No',
      filePTitle: 'Storage Permission Required',
      filePMessage: 'This application needs permission to save and open files.',
      filePNeutral: 'Later',
      filePNegative: 'Cancel',
      filePPositive: 'OK',
      noAppFoundTitle: 'No App Found',
      noAppFoundMessage:
        'No suitable application found to open this file type. Please download an app from the Google Play Store.',
      noAppFoundCancel: 'Cancel',
      addFile: 'Dosya Ekle',
      addPhoto: 'Fotoğraf Ekle',
      fileErrorText: "Dosya boyutu 10MB'dan küçük olmalıdır.",
    },
  },
  dateSettings: {
    use: true,
    backgroundColor: '#EFEFEF',
    textColor: 'black',
    borderRadius: 20,
    format: 'long',
  },
  autoPlayAudio: false,
  fileIcon: {
    type: 'url',
    value: FileIcon,
  },
};

const CustomizeConfigurationContext = createContext<
  CustomizeConfigurationContextType | undefined
>(undefined);

const CustomizeConfigurationProvider: React.FC<{
  url: any;
  initialConfig: PropsCustomizeConfiguration;
  integrationId?: any;
}> = ({ url, initialConfig, integrationId, children }) => {
  const mergedInitialConfig: PropsCustomizeConfiguration = {
    ...defaultCustomizeConfiguration,
    ...initialConfig,
  };

  const [customizeConfiguration, setCustomizeConfiguration] =
    useState<PropsCustomizeConfiguration>(mergedInitialConfig);

  const languages = customizeConfiguration.language ?? {};
  const languageKeys = Object.keys(languages);
  const defaultLanguage = languageKeys.length > 0 ? languageKeys[0] : 'en';

  const [language, setLanguage] = useState(defaultLanguage);

  const changeLanguage = (newLanguage: string) => {
    setLanguage(newLanguage);
  };

  const getTexts = () => languages[language] ?? {};

  useEffect(() => {
    const fetchIntegrationConfig = async (integrationId: string) => {
      try {
        const cleanedUrl = url.replace(/\/chathub$/, '');
        const response = await fetch(
          `${cleanedUrl}/settings/${integrationId}`,
          { method: 'GET' }
        );
        if (!response.ok) {
          throw new Error(
            `Error fetching integration config: ${response.statusText} (${response.status})`
          );
        }

        const json = await response.json();
        const chatAvatatUri = json?.agent?.avatar?.split('"')[3];

        const mergedConfig: PropsCustomizeConfiguration = {
          ...initialConfig,
          // headerText: json?.title ?? initialConfig.headerText,
          bottomColor: json?.productColor ?? initialConfig.bottomColor,
          headerColor: json?.productColor ?? initialConfig.headerColor,
          chatBody: { type: 'color', value: 'white' },
          chatBotMessageBoxTextColor:
            json?.agent?.textColor ?? initialConfig.chatBotMessageBoxTextColor,
          chatBotMessageIcon: { type: 'url', value: chatAvatatUri },
          chatBotMessageBoxBackground:
            json?.agent?.bgColor ?? initialConfig.chatBotMessageBoxBackground,
          userMessageBoxTextColor:
            json?.client?.textColor ?? initialConfig.userMessageBoxTextColor,
          userMessageBoxBackground:
            json?.client?.bgColor ?? initialConfig.userMessageBoxBackground,
          chatStartButtonBackground:
            json?.bubbleColor ?? initialConfig.chatStartButtonBackground,
          // bottomInputText: json?.placeholder ?? initialConfig.bottomInputText,
          chatBotMessageBoxButtonBackground:
            json?.productColor ??
            initialConfig.chatBotMessageBoxButtonBackground,
          chatBotMessageBoxButtonTextColor:
            json?.agent?.textColor ??
            initialConfig.chatBotMessageBoxButtonTextColor,
        };

        setCustomizeConfiguration(mergedConfig);
      } catch (error) {
        console.error('Error fetching integration config:', error);
      }
    };

    if (integrationId) {
      fetchIntegrationConfig(integrationId);
    }
  }, [initialConfig, url, integrationId]);

  return (
    <CustomizeConfigurationContext.Provider
      value={{
        customizeConfiguration,
        setCustomizeConfiguration,
        language,
        changeLanguage,
        getTexts,
      }}
    >
      {children}
    </CustomizeConfigurationContext.Provider>
  );
};

export { CustomizeConfigurationProvider, CustomizeConfigurationContext };

export const useCustomizeConfiguration =
  (): CustomizeConfigurationContextType => {
    const context = useContext(CustomizeConfigurationContext);
    if (!context) {
      throw new Error(
        'useCustomizeConfiguration must be used within a CustomizeConfigurationProvider'
      );
    }
    return context;
  };
