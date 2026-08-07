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
  // Tembel indirilen ses bir kez indirildi mi? (indirme tekrarini onler)
  const resolvedRef = useRef<boolean>(false);
  const [preparing, setPreparing] = useState<boolean>(false);

  // Android'de nitro-sound stopPlayer'i hazir olmayan bir MediaPlayer uzerinde
  // IllegalStateException ile reject ediyor (iOS'ta sessizce basarili olur).
  // Bu cagrilarin hepsi "her ihtimale karsi durdur" niteliginde, sonucu onemsiz.
  const safeStopPlayer = () => {
    try {
      Promise.resolve(recorder.audioRecorderPlayer.stopPlayer()).catch(
        () => {}
      );
    } catch {}
    try {
      recorder.audioRecorderPlayer.removePlayBackListener();
    } catch {}
  };

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
      safeStopPlayer();

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
    // History'den gelen sesler (resolveAudio verilmis) mount'ta INDIRILMEZ.
    // Sure olcumu icin dosyayi acmak indirmeyi tetiklerdi; kullanici hicbir
    // zaman dinlemeyecegi onlarca dosya icin gecmisin yuklenmesini bekliyordu.
    // Sure, ilk oynatmada playback listener'dan zaten geliyor.
    if (props.resolveAudio) {
      return;
    }
    getDuration();
  }, []);

  useEffect(() => {
    if (
      props.position === 'left' &&
      props.url &&
      customizeConfiguration?.autoPlayAudio
    ) {
      safeStopPlayer();
      onPlayPlayer();
    }
  }, [props.url]);

  // Tembel indirme: dosya diskte yoksa indirir, varsa hemen doner.
  // Basarisizlikta false doner ki cagiran startPlayer'i hic denemesin.
  const ensureAudioReady = async (): Promise<boolean> => {
    if (!props.resolveAudio) {
      return !!props.url;
    }
    if (resolvedRef.current) {
      return true;
    }
    try {
      setPreparing(true);
      await props.resolveAudio();
      resolvedRef.current = true;
      return true;
    } catch (e) {
      console.warn('audio could not be downloaded:', props.url, e);
      return false;
    } finally {
      setPreparing(false);
    }
  };

  const getDuration = async () => {
    // Indirme basarisiz oldugunda url null geliyor; startPlayer(null) native
    // tarafta "Value is null, expected a String" firlatir.
    if (!props.url) {
      return;
    }
    // Bozuk/eksik indirilen ses dosyalari startPlayer'i reject ettiriyor
    // (orn. OSStatus 2003334207 = desteklenmeyen dosya turu). Yakalamazsak
    // "Uncaught (in promise)" olarak patlar ve dev'de kirmizi ekran acar.
    try {
      await recorder.audioRecorderPlayer.startPlayer(props.url);
    } catch (e) {
      console.warn('audio could not be opened:', props.url, e);
      return;
    }
    recorder.audioRecorderPlayer.addPlayBackListener((e: any) => {
      setDuration(e.duration);
      setCurrentTime(e.duration);
      safeStopPlayer();
      setStart(false);
      return;
    });
  };

  useEffect(() => {
    if (currentTime === duration && currentTime !== 0) {
      safeStopPlayer();
      setCurrentTime(duration);
      setStart(false);
    }
  }, [currentTime, duration]);

  const onPlayPlayer = async () => {
    if (!props.url) {
      return;
    }
    // Dosya henuz inmediyse burada iner (ilk oynatma).
    if (!(await ensureAudioReady())) {
      setStart(false);
      return;
    }
    try {
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
    } catch (e) {
      console.warn('audio could not be played:', props.url, e);
      setStart(false);
      return;
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
    safeStopPlayer();
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
        // Indirme surerken tekrar basilmasin: ikinci istek ayni dosyayi
        // yeniden indirmeye calisirdi.
        disabled={preparing}
        style={{ marginRight: 10, opacity: preparing ? 0.5 : 1 }}
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
