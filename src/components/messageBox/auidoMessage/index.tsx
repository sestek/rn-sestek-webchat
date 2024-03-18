import React from 'react';
import { Text } from 'react-native';
import AudioComponent from './audio'
import { Recorder } from '../../../services';

const AudioMessage = (props) => {
  if (!props.modules.AudioRecorderPlayer || !props.modules.RNFS) {
    return null;
  }

  let url = props.activity?.message;
  if (props.activity?.channelData?.AudioFromTts?.Data)
    url = props.activity.channelData.AudioFromTts.Data;
  return (
    <>
      <AudioComponent
        url={
          url && url.length > 1000
            ? 'file://' +
              new Recorder(
                props.modules.AudioRecorderPlayer,
                props.modules.RNFS,
                props.modules.Record
              ).saveLocalFileAudio(url)
            : url
        }
        modules={props.modules}
        customizeConfiguration={props.customizeConfiguration}
      />
      <Text
        style={{
          marginVertical: props.activity?.text && 10,
          color: props?.userMessageBoxTextColor ?? 'white',
          paddingLeft: 10,
        }}
      >
        {props.activity?.text}
      </Text>
    </>
  );
};

export default AudioMessage;
