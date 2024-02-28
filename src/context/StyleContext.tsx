import React, { createContext, useState } from 'react';

interface contextType {
  appStyle: any;
  handleStyle: any;
  getCssIntegration: any;
}
const StyleContext = createContext<contextType>({
  appStyle: '',
  handleStyle: '',
  getCssIntegration: '',
});

const StyleContextProvider = (props: any) => {
  const [appStyle, setAppStyle] = useState<object>({});
  const handleStyle = (
    propsCustomizeConfiguration: any,
    tenant: string,
    projectName: string
  ) => {
    setAppStyle({
      headerText: propsCustomizeConfiguration?.headerText,
      headerTextColor: propsCustomizeConfiguration?.headerTextColor,
      bottomColor: propsCustomizeConfiguration?.bottomColor,
      bottomInputSendButtonColor:
        propsCustomizeConfiguration?.bottomInputSendButtonColor,
      bottomInputBorderColor:
        propsCustomizeConfiguration?.bottomInputBorderColor,
      headerColor: propsCustomizeConfiguration?.headerColor,
      chatBody: { ...propsCustomizeConfiguration?.chatBody },
      chatBotMessageBoxTextColor:
        propsCustomizeConfiguration?.chatBotMessageBoxTextColor,
      chatBotMessageIcon: {
        ...propsCustomizeConfiguration?.chatBotMessageIcon,
      },
      chatBotMessageBoxBackground:
        propsCustomizeConfiguration?.chatBotMessageBoxBackground,
      userMessageBoxTextColor:
        propsCustomizeConfiguration?.userMessageBoxTextColor,
      userMessageBoxIcon: {
        ...propsCustomizeConfiguration?.userMessageBoxIcon,
      },
      userMessageBoxBackground:
        propsCustomizeConfiguration?.userMessageBoxBackground,
      chatStartButtonBackground:
        propsCustomizeConfiguration?.chatStartButtonBackground,
      bottomInputText: propsCustomizeConfiguration?.bottomInputText,
      closeModalSettings: {
        ...propsCustomizeConfiguration?.closeModalSettings,
      },
      tenant: tenant,
      projectName: projectName,
      chatBotMessageBoxButtonBackground:
        propsCustomizeConfiguration?.chatBotMessageBoxButtonBackground,
      chatBotMessageBoxButtonBorderColor:
        propsCustomizeConfiguration?.chatBotMessageBoxButtonBorderColor,
      chatBotMessageBoxButtonTextColor:
        propsCustomizeConfiguration?.chatBotMessageBoxButtonTextColor,
    });
  };

  const getCssIntegration = async (
    integrationId: string,
    propsCustomizeConfiguration: any
  ) => {
    const response = await fetch(
      'https://eu.va.knovvu.com/webchat/settings/' + integrationId,
      {
        method: 'GET',
      }
    );
    const json = await response.json();

    const chatAvatatUri = json?.agent?.avatar?.split('"')[3];
    const userAvatatUri = json?.client?.avatar?.split('"')[3];

    setAppStyle({
      headerText: json?.title,
      bottomColor: json?.productColor,
      headerColor: json?.productColor,
      chatBody: { type: 'color', value: 'white' },
      chatBotMessageBoxTextColor: json?.agent?.textColor,
      chatBotMessageIcon: {
        type: 'uri',
        value: chatAvatatUri,
      },
      chatBotMessageBoxBackground: json?.agent?.bgColor,
      userMessageBoxTextColor: json?.client?.textColor,
      userMessageBoxIcon: {
        type: 'uri',
        value: userAvatatUri,
      },
      userMessageBoxBackground: json?.client?.bgColor,
      chatStartButtonBackground: json?.bubbleColor,
      bottomInputText: json?.placeholder,
      closeModalSettings: {
        use: propsCustomizeConfiguration?.closeModalSettings?.use,
        text: json?.warningModal?.content,
        textColor: propsCustomizeConfiguration?.closeModalSettings?.textColor,
        background: propsCustomizeConfiguration?.closeModalSettings?.background,
        buttons: {
          yesButton: {
            text: json?.warningModal?.acceptButton,
            textColor:
              propsCustomizeConfiguration?.closeModalSettings?.buttons
                ?.yesButton.textColor,
            background:
              propsCustomizeConfiguration?.closeModalSettings?.buttons
                ?.yesButton.background,
            borderColor:
              propsCustomizeConfiguration?.closeModalSettings?.buttons
                ?.yesButton.borderColor,
          },
          noButton: {
            text: json?.warningModal?.noButton,
            textColor:
              propsCustomizeConfiguration?.closeModalSettings?.buttons?.noButton
                .textColor,
            background:
              propsCustomizeConfiguration?.closeModalSettings?.buttons?.noButton
                .background,
            borderColor:
              propsCustomizeConfiguration?.closeModalSettings?.buttons?.noButton
                .borderColor,
          },
        },
      },
      tenant: json?.tenant,
      projectName: json?.projectName,
      chatBotMessageBoxButtonBackground: json?.productColor,
      chatBotMessageBoxButtonTextColor:
        propsCustomizeConfiguration?.chatBotMessageBoxButtonTextColor,
    });
  };

  const contextValue: contextType = {
    appStyle,
    handleStyle,
    getCssIntegration,
  };
  return (
    <StyleContext.Provider value={contextValue}>
      {props.children}
    </StyleContext.Provider>
  );
};

export { StyleContext, StyleContextProvider };
