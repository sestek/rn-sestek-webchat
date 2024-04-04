import React, { FC, useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Recorder } from '../../../services';
import type { PropsAudio } from '../../../types';
import { PlayIcon2, PauseIcon2 } from '../../../image';
interface PositionStyle {
  sliderMinimumTrackTintColor: any;
  sliderMaximumTrackTintColor: any;
  sliderThumbTintColor: any;
  sliderPlayImage: any;
  sliderPauseImage: any;
}
const AudioComponent: FC<PropsAudio> = (props) => {
  const [stateRecord, setStateRecord] = useState<any>({
    playTime: '00:00:00',
    duration: '00:00:00',
  });
  const [recorder] = useState<Recorder>(
    new Recorder(
      props.modules.AudioRecorderPlayer,
      props.modules.RNFS,
      props.modules.Record
    )
  );
  const [start, setStart] = useState<boolean>(false);
  const triggerStart = () => setStart((old) => !old);

  const RNSlider = props.modules.RNSlider;
  const AuidoProp = props?.customizeConfiguration?.audioSliderSettings;

  let defaultPositionStyle: PositionStyle = {
    sliderMinimumTrackTintColor: '#C3ACD0',
    sliderMaximumTrackTintColor: 'white',
    sliderThumbTintColor: '#C3ACD0',
    sliderPlayImage: { type: 'component', value: PlayIcon2 },
    sliderPauseImage: { type: 'component', value: PauseIcon2 },
  };

  if (AuidoProp && props.position === 'left') {
    defaultPositionStyle = {
      sliderMinimumTrackTintColor: AuidoProp.botSliderMinimumTrackTintColor,
      sliderMaximumTrackTintColor: AuidoProp.botSliderMaximumTrackTintColor,
      sliderThumbTintColor: AuidoProp.botSliderThumbTintColor,
      sliderPlayImage: AuidoProp.botSliderPlayImage,
      sliderPauseImage: AuidoProp.botSliderPauseImage,
    };
  }
  if (AuidoProp && props.position === 'right') {
    defaultPositionStyle = {
      sliderMinimumTrackTintColor: AuidoProp.userSliderMinimumTrackTintColor,
      sliderMaximumTrackTintColor: AuidoProp.userSliderMaximumTrackTintColor,
      sliderThumbTintColor: AuidoProp.userSliderThumbTintColor,
      sliderPlayImage: AuidoProp.userSliderPlayImage,
      sliderPauseImage: AuidoProp.userSliderPauseImage,
    };
  }
  const renderSliderImage = () => {
    const { sliderPlayImage, sliderPauseImage } = defaultPositionStyle;
    const { value, type } = start ? sliderPauseImage : sliderPlayImage;

    if (type === 'component') {
      return <Image source={value} style={{ width: 20, height: 20 }} />;
    } else {
      return (
        <Image source={{ uri: value }} style={{ width: 20, height: 20 }} />
      );
    }
  };
  useEffect(() => {
    getDuration();
  }, []);

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
        minWidth: 150,
        paddingRight: 10,
      }}
    >
      <View
        style={{
          flex: 2,
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
            flex: 10,
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
        <Text style={{ paddingRight: 5 }}>
          {stateRecord.playTime + ' / ' + stateRecord.duration}
        </Text>
      )}
    </View>
  );
};

AudioComponent.defaultProps = {
  url: '',
};

export default React.memo(AudioComponent);
