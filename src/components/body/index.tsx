import React, { FC } from 'react';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';
import type { PropsBodyComponent } from 'src/types';
import { RobotIcon } from '../../image';
import { GeneralManager } from '../../services';
import { styles } from './style';
import MessageBox from '../messageBox';

const BodyComponent: FC<PropsBodyComponent> = (props) => {
  const {
    userMessageBoxIcon,
    chatBotMessageIcon,
    userMessageBoxHeaderName,
    chatBotMessageBoxHeaderName,
    chatBotMessageBoxHeaderNameColor,
    userMessageBoxHeaderNameColor,
    userMessageBoxTextColor,
    chatBotMessageBoxBackground,
    chatBotMessageBoxTextColor,
    chatBody,
    fontSettings
  } = props.customizeConfiguration;
  const { scrollViewRef } = props;

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
  const getCurrentDate = () => {
    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();
    return date + ' / ' + month + ' / ' + year;
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={() =>
          scrollViewRef?.current?.scrollToEnd({ animated: true })
        }
      >
        <View
          style={[styles.textContainer, { backgroundColor: chatBody?.value }]}
        >
          <View
            style={{
              ...styles.textSubContainer,
              backgroundColor: chatBotMessageBoxBackground,
            }}
          >
            <Text style={{ ...styles.text, color: chatBotMessageBoxTextColor,fontSize:fontSettings?.descriptionFontSize }}>
              {getCurrentDate()}
            </Text>
          </View>
        </View>
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
