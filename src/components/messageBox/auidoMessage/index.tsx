import React from 'react';
import { Text } from 'react-native';
import AudioComponent from './audio';
import { Recorder } from '../../../services';
import { useCustomizeConfiguration } from '../../../context/CustomizeContext';
import { useModules } from '../../../context/ModulesContext';

interface AudioMessageProps {
  activity: any;
  userMessageBoxTextColor: string;
  inlineText?: boolean;
}

const AudioMessage = (props: AudioMessageProps) => {
  const { modules } = useModules();

  if (!modules?.AudioRecorderPlayer || !modules?.RNFS) {
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
                modules?.AudioRecorderPlayer,
                modules?.RNFS,
                modules?.Record
              ).saveLocalFileAudio(url, props?.activity?.id)
            : url
        }
        position={position}
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
