import { Platform } from 'react-native';
import GeneralManager from './general';

class Recorder {
  audioRecorderPlayer: any;
  recordPack: any;
  rnfs: any;
  recordSecs: number = 0;
  recordTime: string = '';
  currentPositionSec: number = 0;
  currentDurationSec: number = 0;
  playTime: string = '';
  duration: string = '';

  constructor(_audioRecordPlayer: any, _rnfs: any, _recordPack: any) {
    this.audioRecorderPlayer = new _audioRecordPlayer();
    this.rnfs = _rnfs;
    this.recordPack = _recordPack;
  }

  onStartRecord = async () => {
    const options = {
      sampleRate: 8000,
      channels: 1,
      bitsPerSample: 16,
      audioSource: 6,
      wavFile: 'sestek_bot_audio/' + GeneralManager.createUUID() + '.wav',
    };
    this.recordPack.init(options);
    this.recordPack.on('data', async (data: any) => {});
    this.recordPack.start();

    // const dirs = this.rnfs.fs.dirs.CacheDir + '/sestek_bot_audio';
    // const path = Platform.select({
    //   ios: 'sestek_bot_audio/' + GeneralManager.createUUID() + '.m4a',
    //   android: `${dirs}/${GeneralManager.createUUID()}.mp3`,
    // });
    // await this.audioRecorderPlayer.startRecorder(path);
    // this.audioRecorderPlayer.addRecordBackListener((e: any) => {
    //   this.recordSecs = e.currentPosition;
    //   this.recordTime = this.audioRecorderPlayer.mmssss(
    //     Math.floor(e.currentPosition)
    //   );
    //   return;
    // });
  };

  onStopRecord = async () => {
    const audioResult = await this.recordPack.stop();
    console.log(audioResult)
    const audioFile: string = 'file://' + audioResult;
    this.recordSecs = 0;
    const dirFile = audioFile.split('/');
    const data =
      this.rnfs.fs.dirs.DocumentDir +
      '/sestek_bot_audio/' +
      dirFile[dirFile.length - 1];
    return {
      url: audioFile,
      data: await this.rnfs.fs.readFile(data, 'base64'),
    };
  };

  saveLocalFileAudio = (data: string) => {
    const dirs = this.rnfs.fs.dirs.DocumentDir + '/sestek_bot_audio';
    const path = `${dirs}/${GeneralManager.createUUID()}.wav`;
    this.rnfs.fs.createFile(path, data, 'base64').then((res: any) => {});
    return path;
  };

  //   onStartPlay = async (urlData?: string) => {
  //     const msg = await this.audioRecorderPlayer.startPlayer(urlData);
  //     this.audioRecorderPlayer.addPlayBackListener((e: any) => {
  //       this.currentPositionSec = e.currentPosition;
  //       this.currentDurationSec = e.duration;
  //       this.playTime = this.audioRecorderPlayer.mmssss(
  //         Math.floor(e.currentPosition)
  //       );
  //       this.duration = this.audioRecorderPlayer.mmssss(Math.floor(e.duration));
  //       return;
  //     });
  //   };

  onPausePlay = async () => {
    await this.audioRecorderPlayer.pausePlayer();
  };

  onStopPlay = async () => {
    console.log('onStopPlay');
    this.audioRecorderPlayer.stopPlayer();
    this.audioRecorderPlayer.removePlayBackListener();
  };
}

export default Recorder;
