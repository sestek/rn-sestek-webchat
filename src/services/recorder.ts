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
  };

  onStopRecord = async () => {
    const audioResult = await this.recordPack.stop();
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

  onPausePlay = async () => {
    await this.audioRecorderPlayer.pausePlayer();
  };

  onStopPlay = async () => {
    this.audioRecorderPlayer.stopPlayer();
    this.audioRecorderPlayer.removePlayBackListener();
  };
}

export default Recorder;
