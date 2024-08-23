import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
} from 'react';
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

interface AudioComponentProps {
  url: string;
  position: string;
  onPlayPause: () => void;
}

export interface AudioComponentHandles {
  onPausePlayer: () => void;
}

const AudioComponent = forwardRef<AudioComponentHandles, AudioComponentProps>(
  ({ url, position, onPlayPause }, ref) => {
    const [isPlaying, setIsPlaying] = useState(false);

    const onPlayPlayer = async () => {
      setIsPlaying(true);
      onPlayPause();
      await recorder.audioRecorderPlayer.startPlayer(url);
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
      setIsPlaying(false);
      await recorder.audioRecorderPlayer.pausePlayer();
      setStart(false);
      // if (start) {
      //   await recorder.audioRecorderPlayer.pausePlayer();
      //   setStart(false);
      // }
    };

    useImperativeHandle(ref, () => ({
      onPausePlayer,
    }));

    const { customizeConfiguration } = useCustomizeConfiguration();
    const { modules } = useModules();
    const [recorder] = useState<Recorder>(
      new Recorder(modules.AudioRecorderPlayer, modules.RNFS, modules.Record)
    );
    const [start, setStart] = useState<boolean>(false);

    const [currentTime, setCurrentTime] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);
    const [filledBars, setFilledBars] = useState<number>(0);
    const heights = useState<number[]>(
      Array.from({ length: 50 }, () => 10 + Math.random() * 20)
    )[0];

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

    if (AuidoProp && position === 'right') {
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
          value:
            AuidoProp.userSliderPauseImage?.value || defaultPauseImage.value,
        },
      };
    }

    useEffect(() => {
      getDuration();
    }, []);

    useEffect(() => {
      if (position === 'left' && url && customizeConfiguration?.autoPlayAudio) {
        recorder.audioRecorderPlayer.removePlayBackListener();
        recorder.audioRecorderPlayer.stopPlayer();
        onPlayPlayer();
      }
    }, [url]);

    const getDuration = async () => {
      await recorder.audioRecorderPlayer.startPlayer(url);
      recorder.audioRecorderPlayer.addPlayBackListener((e: any) => {
        setDuration(e.duration);
        setCurrentTime(e.duration);
        recorder.audioRecorderPlayer.stopPlayer();
        recorder.audioRecorderPlayer.removePlayBackListener();
        setStart(false);
        setFilledBars(0);
        return;
      });
    };
    // useEffect(() => {
    //   if (start) {
    //     //console.log("Ses oynatılıyor.");
    //   } else if (!start && currentTime > 0 && currentTime < duration) {
    //     //console.log("Ses duraklatıldı.");
    //   }
    //   if (!start && currentTime === duration && currentTime !== 0) {
    //     setFilledBars(0);
    //     //console.log("Ses oynatıldı ve bitti.");
    //   }
    // }, [start, currentTime, duration]);
    useEffect(() => {
      if (currentTime === duration && currentTime !== 0) {
        recorder.audioRecorderPlayer.stopPlayer();
        recorder.audioRecorderPlayer.removePlayBackListener();
        setCurrentTime(duration);
        setStart(false);
        setFilledBars(0);
      }
    }, [currentTime, duration]);

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

    const inLineCode = () => {
      const { sliderPlayImage, sliderPauseImage } = defaultPositionStyle;
      const { value, type } = !start ? sliderPlayImage : sliderPauseImage;

      return (
        <>
          <TouchableOpacity
            onPress={() => (!start ? onPlayPlayer() : onPausePlayer())}
            style={{ marginRight: 10 }}
          >
            <RenderImage
              type={type}
              value={value}
              style={{ width: 25, height: 25 }}
            />
          </TouchableOpacity>
          <View style={styles.audioBar}>
            {heights.map((height, index) => {
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
            })}
          </View>
          <Text
            style={[
              styles.timer,
              { color: defaultPositionStyle.sliderThumbTintColor },
            ]}
          >
            {/* {new Date(currentTime).toISOString().substr(14, 5)} */}
            {currentTime >= 0 && duration > 0
              ? new Date(currentTime).toISOString().substr(14, 5)
              : '00:00'}
          </Text>
        </>
      );
    };
    return <View style={styles.container}>{inLineCode()}</View>;
  }
);

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
