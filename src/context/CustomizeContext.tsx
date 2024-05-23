
import React, { createContext, useState, useEffect, useContext } from 'react';
import type PropsCustomizeConfiguration from '../types/propsCustomizeConfiguration';
import { DefaultFontSettings } from '../constant/ChatModalConstant';

interface CustomizeConfigurationContextType {
  customizeConfiguration: PropsCustomizeConfiguration;
  setCustomizeConfiguration: React.Dispatch<React.SetStateAction<PropsCustomizeConfiguration>>;
}
 const defaultCustomizeConfiguration: PropsCustomizeConfiguration = {
   headerColor: '#7743DB',
   headerTextColor: 'white',
   headerHideIcon: {
     type: 'url',
     value: "",
   },
   headerCloseIcon: {
     type: 'url',
     value: "",
   },
   headerAlignmentType: 'textToCenter',
   bottomColor: 'white',
   bottomInputBackgroundColor: 'white',
   bottomInputBorderColor: '#d5d5d5',
   bottomInputSendButtonColor: '#7743DB',
   userMessageBoxBackground: '#863CEB',
   userMessageBoxTextColor: 'white',
   chatBotMessageBoxBackground: '#EFEFEF',
   chatBotMessageBoxTextColor: 'black',
   chatBotMessageIcon: {
     type: 'url',
     value: 'https://demo-app.sestek.com/sestek-com-avatar/image/ppp.png',
   },
   chatBotMessageBoxButtonBackground: 'white',
   chatBotMessageBoxButtonTextColor: '#863CEB',
   chatBotMessageBoxButtonBorderColor: '#EFEFEF',
   chatBotMessageBoxAvatarIconSize: 28,
   chatBotCarouselSettings: {
     buttonGroup: {
       borderColor: '#E2E2E4',
       backgroundColor: '#ffffff',
       textColor: '#863CEB',
     },
   },
   chatBody: { type: 'color', value: 'white' },
   chatBodyMessageBoxGap: 20,
   chatStartButton: {
     type: 'url',
     value: "",
   },
   chatStartButtonBackground: 'white',
   chatStartButtonBackgroundSize: 70,
   chatStartButtonHide: false,
   audioSliderSettings: {
     userSliderMinimumTrackTintColor: '#C3ACD0',
     userSliderMaximumTrackTintColor: 'white',
     userSliderThumbTintColor: '#C3ACD0',
     botSliderMinimumTrackTintColor: 'red',
     botSliderMaximumTrackTintColor: 'blue',
     botSliderThumbTintColor: 'black',
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
   dateSettings: {
     backgroundColor: 'pink',
     textColor: 'black',
   },
   autoPlayAudio: false,
 };
// const CustomizeConfigurationContext = createContext<CustomizeConfigurationContextType | undefined>(undefined);
const CustomizeConfigurationContext = createContext<CustomizeConfigurationContextType>({
  customizeConfiguration: defaultCustomizeConfiguration,
  setCustomizeConfiguration: () => {}, 
});

const CustomizeConfigurationProvider: React.FC<{ url: any; initialConfig: PropsCustomizeConfiguration ;  integrationId?: any;}> = ({
  url,
  initialConfig,
  integrationId,
  children,
}) => {
  const [customizeConfiguration, setCustomizeConfiguration] = useState<PropsCustomizeConfiguration>(initialConfig || defaultCustomizeConfiguration);

  useEffect(() => {
    const fetchIntegrationConfig = async (integrationId: string) => {
      try {
        const cleanedUrl = url.replace(/\/chathub$/, '');
        console.log(`${cleanedUrl}/settings/${integrationId}`)
        const response = await fetch(`${cleanedUrl}/settings/${integrationId}`,
          {
            method: 'GET',
          }
        );

        if (!response.ok) {
          throw new Error(`Error fetching integration config: ${response.statusText} (${response.status})`);
        }
        const json = await response.json();


        const chatAvatatUri = json?.agent?.avatar?.split('"')[3];
        console.log(chatAvatatUri)

        const mergedConfig: PropsCustomizeConfiguration = {
          ...initialConfig,
          headerText: json?.title ?? initialConfig.headerText,
          bottomColor: json?.productColor ?? initialConfig.bottomColor,
          headerColor: json?.productColor ?? initialConfig.headerColor,
          chatBody: { type: 'color', value: 'white' },
          chatBotMessageBoxTextColor: json?.agent?.textColor ?? initialConfig.chatBotMessageBoxTextColor,
          // chatBotMessageIcon: { type: 'uri', value: chatAvatatUri },
          chatBotMessageBoxBackground: json?.agent?.bgColor ?? initialConfig.chatBotMessageBoxBackground,
          userMessageBoxTextColor: json?.client?.textColor ?? initialConfig.userMessageBoxTextColor,
          userMessageBoxBackground: json?.client?.bgColor ?? initialConfig.userMessageBoxBackground,
          chatStartButtonBackground: json?.bubbleColor ?? initialConfig.chatStartButtonBackground,
          bottomInputText: json?.placeholder ?? initialConfig.bottomInputText,
          chatBotMessageIcon:{type:'url', value:chatAvatatUri},
          // closeModalSettings: {
          //   ...initialConfig.closeModalSettings,
          //   text: json?.warningModal?.content,
          //   buttons: {
          //     yesButton: {
          //       ...initialConfig.closeModalSettings?.buttons?.yesButton,
          //       // text: json?.warningModal?.acceptButton,
          //     },
          //     noButton: {
          //       ...initialConfig.closeModalSettings?.buttons?.noButton,
          //       // text: json?.warningModal?.noButton,
          //     },
          //   },
          // },
          chatBotMessageBoxButtonBackground: json?.productColor ?? initialConfig.chatBotMessageBoxButtonBackground,
          chatBotMessageBoxButtonTextColor: initialConfig.chatBotMessageBoxButtonTextColor,
          fontSettings: initialConfig.fontSettings ?? DefaultFontSettings,
        };

        setCustomizeConfiguration(mergedConfig);
      } catch (error) {
        console.error('Error fetching integration config:', error);
      }
    };

    if (integrationId) {
      fetchIntegrationConfig(integrationId);
    }
  }, [initialConfig, url]);

  return (
    <CustomizeConfigurationContext.Provider value={{ customizeConfiguration, setCustomizeConfiguration }}>
      {children}
    </CustomizeConfigurationContext.Provider>
  );
};

export { CustomizeConfigurationProvider, CustomizeConfigurationContext };
