import React from 'react';
import { Text } from 'react-native';
import AudioComponent from './audio';
import { Recorder } from '../../../services';
import PropsModules from 'src/types/propsModules';
import PropsCustomizeConfiguration from 'src/types/propsCustomizeConfiguration';

interface AudioMessageProps {
  modules: PropsModules;
  customizeConfiguration: PropsCustomizeConfiguration;
  activity: any;
  userMessageBoxTextColor: string;
  inlineText?: boolean;
}

const AudioMessage = (props: AudioMessageProps) => {
  if (!props.modules.AudioRecorderPlayer || !props.modules.RNFS) {
    return null;
  }
  let url = props.activity?.message;
  let position = 'right';
  if (props?.activity?.attachments && props?.activity?.attachments[0]) {
    url = props?.activity?.attachments[0]?.content;
    position = 'left';
  }

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
        position = {position}
      />
      {position === 'right' && (
        <Text
          style={{
            marginVertical: props.activity?.text && 10,
            color: props?.userMessageBoxTextColor ?? 'white',
            paddingLeft: 10,
          }}
        >
          {props.activity?.text}
        </Text>
      )}
    </>
  );
};

export default AudioMessage;
