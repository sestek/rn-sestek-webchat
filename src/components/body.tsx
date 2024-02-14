import React, { FC, useRef } from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import type { PropsBodyComponent } from 'src/types';
import { RobotIcon } from '../image';
import { GeneralManager } from '../services';
import { styles } from './body-style';
import MessageBox from './messageBox';

const BodyComponent: FC<PropsBodyComponent> = (props) => {
  const scrollView = useRef<ScrollView>(null);
  const {
    userMessageBoxIcon,
    chatBotMessageIcon,
    userMessageBoxHeaderName,
    chatBotMessageBoxHeaderName,
    chatBotMessageBoxHeaderNameColor,
    userMessageBoxHeaderNameColor,
    userMessageBoxTextColor,
  } = props.customizeConfiguration;

  const getUserName = (channel: any) => {
    return channel
      ? userMessageBoxHeaderName || 'User'
      : chatBotMessageBoxHeaderName || 'Chatbot';
  };

  const getTextColor = (channel: any) => {
    return channel
      ? userMessageBoxHeaderNameColor || 'black'
      : chatBotMessageBoxHeaderNameColor || 'black';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        ref={scrollView}
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={() =>
          scrollView?.current?.scrollToEnd({ animated: true })
        }
      >
        {props.messageList
          .slice(1)
          .filter((x) => x.message !== '' && x.message !== '<p></p>')
          .map((x: any, key: number) => (
            <MessageBox
              {...props}
              modules={props.modules}
              userMessageBoxTextColor={userMessageBoxTextColor ?? ''}
              key={key}
              position={x.channel ? 'left' : 'right'}
              type={x?.type || 'text'}
              activity={x}
              status={null}
              title={getUserName(x?.channel)}
              titleColor={getTextColor(x?.channel)}
              avatar={
                x.channel
                  ? GeneralManager.returnIconData(
                      userMessageBoxIcon?.type,
                      userMessageBoxIcon?.value,
                      RobotIcon
                    )
                  : GeneralManager.returnIconData(
                      chatBotMessageIcon?.type,
                      chatBotMessageIcon?.value,
                      RobotIcon
                    )
              }
              renderAddCmp={undefined}
            />
          ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default BodyComponent;
