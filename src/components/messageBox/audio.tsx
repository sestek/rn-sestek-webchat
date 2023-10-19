import React, { FC, useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Recorder } from '../../services';
import type { PropsAudio } from '../../types/';
import { PlayIcon, PauseIcon, PlayIcon2, PauseIcon2 } from '../../image';

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
  const AuidoProp = props.customizeConfiguration;

  //GET DURATION
  useEffect(() => {
    getDuration();
  }, []);

  const getDuration = async () => {
    await recorder.audioRecorderPlayer.startPlayer(props.url);
    recorder.audioRecorderPlayer.addPlayBackListener((e: any, x: any) => {
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
    recorder.audioRecorderPlayer.addPlayBackListener((e: any, x: any) => {
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

  const PauseIconOrImage = AuidoProp.sliderPauseImage?.value
    ? AuidoProp.sliderPauseImage?.value
    : PauseIcon2;
  const PlayIconOrImage = AuidoProp.sliderPlayImage?.value
    ? AuidoProp.sliderPlayImage?.value
    : PlayIcon2;

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        width: 250,
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
          <Image
            source={!start ? PlayIconOrImage : PauseIconOrImage}
            style={{ width: 24, height: 24 }}
          />
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
              width: 230,
              transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
            }}
            value={
              stateRecord.playTime &&
              parseInt(stateRecord.playTime.substring(4, 5))
            }
            minimumValue={0}
            disabled
            maximumValue={
              stateRecord.duration &&
              parseInt(stateRecord.duration.substring(4, 5))
            }
            minimumTrackTintColor={AuidoProp.sliderMinimumTrackTintColor}
            maximumTrackTintColor={AuidoProp.sliderMaximumTrackTintColor}
            thumbTintColor={AuidoProp.sliderThumbTintColor}
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
