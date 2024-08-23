import React, { FC, useState } from 'react';
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
  const [currentPlayingUrl, setCurrentPlayingUrl] = useState<string | null>(null);

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
          .filter((x) => x.message !== '' && x.message !== '<p></p>')
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
              currentPlayingUrl={currentPlayingUrl} // Merkezi durumu buradan geçiriyoruz
              setCurrentPlayingUrl={setCurrentPlayingUrl} // Merkezi durumu güncellemek için fonksiyonu geçiriyoruz
              messageIndex={key} // Burada index değerini geçiyoruz
              messageData={x} // Ya da doğrudan mesaj verisini geçiriyoruz
            />
          ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default BodyComponent;
