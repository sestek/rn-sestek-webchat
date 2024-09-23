import React, { FC } from 'react';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';
import type { PropsBodyComponent } from 'src/types';

import { styles } from './style';
import MessageBox from '../messageBox';
import { useCustomizeConfiguration } from '../../context/CustomizeContext';
import { GeneralManager } from '../../services';
const BodyComponent: FC<PropsBodyComponent> = (props) => {
  const { customizeConfiguration, language } = useCustomizeConfiguration();
  const {
    userMessageBoxTextColor,
    chatBotMessageBoxBackground,
    chatBotMessageBoxTextColor,
    fontSettings,
    dateSettings,
  } = customizeConfiguration;
  const { scrollViewRef } = props;
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
          style={[styles.textContainer]}
        >
          {customizeConfiguration?.dateSettings?.use && (
            <View
              style={{
                ...styles.textSubContainer,
                borderRadius: dateSettings?.borderRadius ?? 20,
                backgroundColor:
                  dateSettings?.backgroundColor ?? chatBotMessageBoxBackground,
              }}
            >
              <Text
                style={{
                  ...styles.text,
                  color: dateSettings?.textColor ?? chatBotMessageBoxTextColor,
                  fontSize: fontSettings?.descriptionFontSize,
                }}
              >
                {GeneralManager.getCurrentDate(language, dateSettings?.format)}
              </Text>
            </View>
          )}
        </View>
        {props.messageList
          //  .slice(1)
          .filter((x:any) => x.message !== '' && x.message !== '<p></p>')
          .map((x: any, key: number) => (
            <MessageBox
              {...props}
              userMessageBoxTextColor={userMessageBoxTextColor ?? ''}
              key={key}
              position={x.channel ? 'left' : 'right'}
              type={x?.type || 'text'}
              activity={x}
              status={null}
              renderAddCmp={undefined}
              url={props.url}
              defaultConfiguration={props.defaultConfiguration}
            />
          ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default BodyComponent;
