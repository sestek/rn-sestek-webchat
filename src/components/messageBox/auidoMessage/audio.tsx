import React, { FC, useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
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
  const [recorder] = useState<Recorder>(
    new Recorder(modules.AudioRecorderPlayer, modules.RNFS, modules.Record)
  );
  const [start, setStart] = useState<boolean>(false);
  const [urlChanged, setUrlChanged] = useState<boolean>(false);

  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [filledBars, setFilledBars] = useState<number>(0);
  const heights = useState<number[]>(
    Array.from({ length: 50 }, () => 10 + Math.random() * 20)
  )[0];

  const previousUrlRef = useRef<string | null>(null); 

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
    sliderMinimumTrackTintColor: AuidoProp?.botUnplayedTrackColor,
    sliderMaximumTrackTintColor: AuidoProp?.botPlayedTrackColor,
    sliderThumbTintColor: AuidoProp?.botTimerTextColor,
    sliderPlayImage: defaultPlayImage,
    sliderPauseImage: defaultPauseImage,
  };

  if (AuidoProp && props?.position === 'right') {
    defaultPositionStyle = {
      sliderMinimumTrackTintColor:
        AuidoProp?.userUnplayedTrackColor ||
        defaultPositionStyle.sliderMinimumTrackTintColor,
      sliderMaximumTrackTintColor:
        AuidoProp?.userPlayedTrackColor ||
        defaultPositionStyle.sliderMaximumTrackTintColor,
      sliderThumbTintColor:
        AuidoProp?.userTimerTextColor ||
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

  useEffect(() => {
    if (previousUrlRef.current !== props.url) {
      recorder.audioRecorderPlayer.stopPlayer();
      recorder.audioRecorderPlayer.removePlayBackListener();

      setUrlChanged(true);
    } else {
      setUrlChanged(false);
    }
    previousUrlRef.current = props.url;
  }, [props.url]);

  const renderSliderImage = () => {
    const { sliderPlayImage, sliderPauseImage } = defaultPositionStyle;
    const { value, type } = !start ? sliderPlayImage : sliderPauseImage;
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
    recorder.audioRecorderPlayer.addPlayBackListener((e: any) => {
      setDuration(e.duration);
      setCurrentTime(e.duration);
      recorder.audioRecorderPlayer.stopPlayer();
      recorder.audioRecorderPlayer.removePlayBackListener();
      setStart(false);
      return;
    });
  };

  useEffect(() => {
    if (currentTime === duration && currentTime !== 0) {
      recorder.audioRecorderPlayer.stopPlayer();
      recorder.audioRecorderPlayer.removePlayBackListener();
      setCurrentTime(duration);
      setStart(false);
    }
  }, [currentTime, duration]);

  const onPlayPlayer = async () => {
    if (currentTime < duration && currentTime > 0) {
      if (urlChanged) {
        setCurrentTime(0);
        await recorder.audioRecorderPlayer.startPlayer(props.url);
      } else {
        await recorder.audioRecorderPlayer.resumePlayer();
      }
    } else {
      setCurrentTime(0);
      await recorder.audioRecorderPlayer.startPlayer(props.url);
    }

    recorder.audioRecorderPlayer.addPlayBackListener((e: any) => {
      setCurrentTime(e.currentPosition);
      setDuration(e.duration);
      const filled = Math.ceil(
        (e.currentPosition / e.duration) * heights.length
      );
      setFilledBars(Math.min(filled, heights.length));
      return;
    });
    setStart(true);
  };

  const onPausePlayer = async () => {
    recorder.audioRecorderPlayer.removePlayBackListener();
    await recorder.audioRecorderPlayer.stopPlayer();
    setStart(false);
  };

  useEffect(() => {
    // if (start) {
    // } else if (!start && currentTime > 0 && currentTime < duration) {
    // }
    if (!start && currentTime === duration && currentTime !== 0) {
      setFilledBars(0);
    }
  }, [start, currentTime, duration]);

  const renderBars = () => {
    return heights.map((height, index) => {
      const barColor =
        index < filledBars
          ? defaultPositionStyle.sliderMaximumTrackTintColor
          : defaultPositionStyle.sliderMinimumTrackTintColor;

      return (
        <View
          key={index}
          style={[
            styles.bar,
            {
              height,
              backgroundColor: barColor,
            },
          ]}
        />
      );
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => (!start ? onPlayPlayer() : onPausePlayer())}
        style={{ marginRight: 10 }}
      >
        {renderSliderImage()}
      </TouchableOpacity>
      <View style={styles.audioBar}>{renderBars()}</View>
      <Text
        style={[
          styles.timer,
          { color: defaultPositionStyle.sliderThumbTintColor },
        ]}
      >
        {currentTime >= 0 && duration > 0
          ? new Date(currentTime).toISOString().substr(14, 5)
          : '00:00'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minWidth: 250,
    flexDirection: 'row',
    padding: 5,
    backgroundColor: 'transparent',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  audioBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginRight: 5,
  },
  bar: {
    flex: 1,
    marginHorizontal: 1,
    borderRadius: 5,
  },
  timer: {
    fontSize: 12,
    width: 50,
    textAlign: 'right',
    fontWeight: '500',
  },
});

export default React.memo(AudioComponent);
