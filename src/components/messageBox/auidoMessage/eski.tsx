import React, { FC, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Recorder } from '../../../services';
import type { PropsAudio } from '../../../types';
import RenderImage from '../../renderImage';
import { useCustomizeConfiguration } from '../../../context/CustomizeContext';
import { useModules } from '../../../context/ModulesContext';
interface PositionStyle {
  sliderMinimumTrackTintColor: any;
  sliderMaximumTrackTintColor: any;
  sliderThumbTintColor: any;
  sliderPlayImage: { type: 'url' | 'component' | undefined; value: any };
  sliderPauseImage: { type: 'url' | 'component' | undefined; value: any };
}
const AudioComponent: FC<PropsAudio> = (props) => {
  const { customizeConfiguration } = useCustomizeConfiguration();
  const { modules } = useModules();
  const [stateRecord, setStateRecord] = useState<any>({
    playTime: '00:00:00',
    duration: '00:00:00',
  });
  const [recorder] = useState<Recorder>(
    new Recorder(modules.AudioRecorderPlayer, modules.RNFS, modules.Record)
  );
  const [start, setStart] = useState<boolean>(false);
  const triggerStart = () => setStart((old) => !old);

  const RNSlider = modules?.RNSlider;
  const AuidoProp = customizeConfiguration?.audioSliderSettings;

  const defaultPlayImage = {
    type: AuidoProp?.botSliderPlayImage?.type,
    value: AuidoProp?.botSliderPlayImage?.value,
  };
  const defaultPauseImage = {
    type: AuidoProp?.botSliderPauseImage?.type,
    value: AuidoProp?.botSliderPauseImage?.value,
  };
  let defaultPositionStyle: PositionStyle = {
    sliderMinimumTrackTintColor: AuidoProp?.botSliderMinimumTrackTintColor,
    sliderMaximumTrackTintColor: AuidoProp?.botSliderMaximumTrackTintColor,
    sliderThumbTintColor: AuidoProp?.botSliderThumbTintColor,
    sliderPlayImage: defaultPlayImage,
    sliderPauseImage: defaultPauseImage,
  };
  if (AuidoProp && props?.position === 'right') {
    defaultPositionStyle = {
      sliderMinimumTrackTintColor:
        AuidoProp?.userSliderMinimumTrackTintColor ||
        defaultPositionStyle.sliderMinimumTrackTintColor,
      sliderMaximumTrackTintColor:
        AuidoProp?.userSliderMaximumTrackTintColor ||
        defaultPositionStyle.sliderMaximumTrackTintColor,
      sliderThumbTintColor:
        AuidoProp?.userSliderThumbTintColor ||
        defaultPositionStyle.sliderThumbTintColor,
      sliderPlayImage: {
        type: AuidoProp.userSliderPlayImage?.type || defaultPlayImage.type,
        value: AuidoProp.userSliderPlayImage?.value || defaultPlayImage.value,
      },
      sliderPauseImage: {
        type: AuidoProp.userSliderPauseImage?.type || defaultPauseImage.type,
        value: AuidoProp.userSliderPauseImage?.value || defaultPauseImage.value,
      },
    };
  }
  const renderSliderImage = () => {
    const { sliderPlayImage, sliderPauseImage } = defaultPositionStyle;
    const { value, type } =
      stateRecord.playTime !== '00:00:00' && start === true
        ? sliderPauseImage
        : sliderPlayImage;

    return (
      <RenderImage
        type={type}
        value={value}
        style={{ width: 25, height: 25 }}
      />
    );
  };

  useEffect(() => {
    getDuration();
  }, []);

  useEffect(() => {
    if (
      props.position === 'left' &&
      props.url &&
      customizeConfiguration?.autoPlayAudio
    ) {
      recorder.audioRecorderPlayer.removePlayBackListener();

      recorder.audioRecorderPlayer.stopPlayer();
      onPlayPlayer();
    }
  }, [props.url]);

  const getDuration = async () => {
    await recorder.audioRecorderPlayer.startPlayer(props.url);
    recorder.audioRecorderPlayer.addPlayBackListener((e: any, _: any) => {
      recorder.currentDurationSec = e.duration;
      setStateRecord({
        playTime: '00:00:00',
        duration: recorder.audioRecorderPlayer.mmssss(Math.floor(e.duration)),
      });
      recorder.audioRecorderPlayer.stopPlayer();
      recorder.audioRecorderPlayer.removePlayBackListener();
      return;
    });
  };

  useEffect(() => {
    if (
      stateRecord.playTime === stateRecord.duration &&
      stateRecord.playTime !== '00:00:00'
    ) {
      recorder.audioRecorderPlayer.stopPlayer();
      recorder.audioRecorderPlayer.removePlayBackListener();
      setStateRecord({
        playTime: '00:00:00',
        duration: stateRecord.duration,
      });
      triggerStart();
    }
  }, [stateRecord]);

  const onPlayPlayer = async () => {
    if (stateRecord.playTime !== '00:00:00') {
      await recorder.audioRecorderPlayer.resumePlayer();
    } else {
      await recorder.audioRecorderPlayer.startPlayer(props.url);
    }
    recorder.audioRecorderPlayer.addPlayBackListener((e: any, _: any) => {
      recorder.currentPositionSec = e.currentPosition;
      recorder.currentDurationSec = e.duration;
      setStateRecord({
        playTime: recorder.audioRecorderPlayer.mmssss(
          Math.floor(e.currentPosition)
        ),
        duration: recorder.audioRecorderPlayer.mmssss(Math.floor(e.duration)),
      });
      return;
    });
    triggerStart();
  };

  const onPausePlayer = async () => {
    recorder.audioRecorderPlayer.removePlayBackListener();
    await recorder.audioRecorderPlayer.pausePlayer();
    triggerStart();
  };
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        minWidth: 170,
        paddingRight: 10,
      }}
    >
      <View
        style={{
          flex: 3,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <TouchableOpacity
          onPress={() => (!start ? onPlayPlayer() : onPausePlayer())}
        >
          {renderSliderImage()}
        </TouchableOpacity>
      </View>
      {RNSlider ? (
        <View
          style={{
            flex: 9,
            paddingLeft: 10,
          }}
        >
          <RNSlider
            style={{
              margin: 0,
              width: '100%',
              transform: [{ scaleX: 0.2 }, { scaleY: 0.2 }],
            }}
            value={
              stateRecord.playTime &&
              parseInt(stateRecord.playTime.substring(3, 5))
            }
            minimumValue={0}
            disabled
            maximumValue={
              stateRecord.duration &&
              parseInt(stateRecord.duration.substring(3, 5))
            }
            minimumTrackTintColor={
              defaultPositionStyle.sliderMinimumTrackTintColor
            }
            maximumTrackTintColor={
              defaultPositionStyle.sliderMaximumTrackTintColor
            }
            thumbTintColor={defaultPositionStyle.sliderThumbTintColor}
          />
        </View>
      ) : (
        <Text
          style={{
            paddingRight: 5,
            fontSize: customizeConfiguration?.fontSettings?.descriptionFontSize,
          }}
        >
          {stateRecord.playTime + ' / ' + stateRecord.duration}
        </Text>
      )}
    </View>
  );
};

export default React.memo(AudioComponent);
