import React, { FC, useContext } from 'react';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';
import type { PropsBodyComponent } from 'src/types';

import { styles } from './style';
import MessageBox from '../messageBox';
import { useLanguage } from '../../context/LanguageContext';
import { CustomizeConfigurationContext } from '../../context/CustomizeContext';
const BodyComponent: FC<PropsBodyComponent> = (props) => {
  const context = useContext(CustomizeConfigurationContext);
  const { customizeConfiguration } = context;
  const {
    userMessageBoxTextColor,
    chatBotMessageBoxBackground,
    chatBotMessageBoxTextColor,
    chatBody,
    fontSettings,
    dateSettings,
  } = customizeConfiguration;
  const { scrollViewRef } = props;

  const { language } = useLanguage();

  const getCurrentDate2 = (locale: string) => {
    return new Date().toLocaleDateString(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
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
              borderRadius: dateSettings?.borderRadius ?? 20,
              backgroundColor:
                dateSettings?.backgroundColor ?? chatBotMessageBoxBackground,
            }}
          >
            {dateSettings?.use ?? (
              <Text
                style={{
                  ...styles.text,
                  color: dateSettings?.textColor ?? chatBotMessageBoxTextColor,
                  fontSize: fontSettings?.descriptionFontSize,
                }}
              >
                {getCurrentDate2(language)}
              </Text>
            )}
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
              renderAddCmp={undefined}
            />
          ))}
      </ScrollView>
    </SafeAreaView>
  );
};



export default BodyComponent;
