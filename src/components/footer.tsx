import React, { FC, useState, useEffect } from 'react';
import { Image, TextInput, TouchableOpacity, View } from 'react-native';
import type { PropsFooterComponent } from 'src/types';
import { styles } from './footer-style';
import { RecordInIcon, RecordOutIcon, SendIcon, RecordDisable } from '../image';
import { Recorder } from '../services';

const FooterComponent: FC<PropsFooterComponent> = (props) => {
  const recordEnabled =
    props.modules.AudioRecorderPlayer && props.modules.RNFS ? true : false;

  const [recorder] = useState<Recorder | undefined>(
    recordEnabled
      ? new Recorder(
          props.modules.AudioRecorderPlayer,
          props.modules.RNFS,
          props.modules.Record
        )
      : undefined
  );
  const [recordStart, setRecordStart] = useState<boolean>(false);
  const [disableRecord, setDisableRecord] = useState<boolean>(false);

  const triggerRecord = async () => {
    if (disableRecord) {
      return; // Don't perform the action when recording is disabled
    }

    if (recordStart) {
      setDisableRecord(true); // Disable recording when it starts
      var result = await recorder?.onStopRecord();
      const dirFile = result?.url?.split('/');
      if (dirFile) {
        console.log('TEST', dirFile[dirFile.length - 1]);
        props.sendAudio(result?.url, dirFile[dirFile.length - 1], result?.data);
        setTimeout(() => {
          setDisableRecord(false); // Enable recording after 2 seconds
        }, 3500);
      }
    } else {
      recorder?.onStartRecord();
    }
    setRecordStart((old) => !old);
  };

  // Interactive effects when the disableRecord state changes
  useEffect(() => {
    if (disableRecord) {
      // Actions to perform when recording is disabled (e.g., visual feedback)
    } else {
      // Actions to perform when recording is enabled (e.g., visual feedback)
    }
  }, [disableRecord]);

  const clickSendButton = () => {
    if (!props.inputData) return;
    props.sendMessage(props.inputData);
    props.changeInputData('');
  };

  const touchRecord = () => {
    if (props.customizeConfiguration.beforeAudioClick) {
      props.customizeConfiguration
        .beforeAudioClick()
        .then(() => triggerRecord());
    } else {
      triggerRecord();
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <TextInput
          style={styles.textInput}
          value={props.inputData}
          onChangeText={(text: string) => props.changeInputData(text)}
          placeholder={props.placeholderText || 'Please write a message'}
          placeholderTextColor="grey"
          keyboardType="default"
        />
      </View>
      {props.modules.AudioRecorderPlayer && props.modules.RNFS && (
        <TouchableOpacity onPress={touchRecord}>
          <Image
            style={styles.icon}
            source={
              recordStart
                ? RecordInIcon
                : disableRecord
                ? RecordDisable
                : RecordOutIcon
            }
          />
        </TouchableOpacity>
      )}
      <TouchableOpacity onPress={clickSendButton}>
        <Image style={styles.icon} source={SendIcon} />
      </TouchableOpacity>
    </View>
  );
};

export default FooterComponent;
