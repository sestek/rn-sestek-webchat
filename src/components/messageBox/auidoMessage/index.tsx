import React, { useContext } from 'react';
import { Text } from 'react-native';
import AudioComponent from './audio';
import { Recorder } from '../../../services';
import PropsModules from 'src/types/propsModules';
import { useCustomizeConfiguration } from '../../../context/CustomizeContext';

interface AudioMessageProps {
  modules: PropsModules;
  activity: any;
  userMessageBoxTextColor: string;
  inlineText?: boolean;
  messageId?: any
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
  const { customizeConfiguration } = useCustomizeConfiguration();

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
              ).saveLocalFileAudio(url, props.messageId)
            : url
        }
        modules={props.modules}
        position={position}
        key={props.messageId}

      />
      {position === 'right' && (
        <Text
          style={{
            marginVertical: props.activity?.text && 10,
            color: props?.userMessageBoxTextColor ?? 'white',
            paddingLeft: 10,
            fontSize: customizeConfiguration?.fontSettings?.subtitleFontSize,
          }}
        >
          {props.activity?.text}
        </Text>
      )}
    </>
  );
};

export default AudioMessage;
