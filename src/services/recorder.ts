import { Platform } from "react-native";
import GeneralManager from "./general";

class Recorder {
    audioRecorderPlayer: any;
    rnfs: any;

    recordSecs: number = 0;
    recordTime: string = "";
    currentPositionSec: number = 0;
    currentDurationSec: number = 0;
    playTime: string = "";
    duration: string = "";

    constructor(_audioRecordPlayer: any, _rnfs: any) {
        this.audioRecorderPlayer = new _audioRecordPlayer();
        this.rnfs = _rnfs;
    }

    onStartRecord = async () => {
        const dirs = this.rnfs.fs.dirs.CacheDir;
        console.log(dirs);
        const path = Platform.select({
            ios: GeneralManager.createUUID() + '.m4a',
            android: `${dirs}/${GeneralManager.createUUID()}.mp3`,
        });
        await this.audioRecorderPlayer.startRecorder(path);
        this.audioRecorderPlayer.addRecordBackListener((e: any) => {
            this.recordSecs = e.currentPosition;
            this.recordTime = this.audioRecorderPlayer.mmssss(Math.floor(e.currentPosition));
            return;
        });
    };

    onStopRecord = async () => {
        const result = await this.audioRecorderPlayer.stopRecorder();
        this.audioRecorderPlayer.removeRecordBackListener();
        this.recordSecs = 0;
        const dirFile = result.split('/');
        const data = this.rnfs.fs.dirs.CacheDir + '/' + dirFile[dirFile.length - 1];
        console.log(data)
        return { url: result, data: await this.rnfs.fs.readFile(data, "base64") };
    };

    onStartPlay = async (url?: string) => {
        console.log('onStartPlay');
        const msg = await this.audioRecorderPlayer.startPlayer(url);
        console.log(msg);
        this.audioRecorderPlayer.addPlayBackListener((e: any) => {
            this.currentPositionSec = e.currentPosition;
            this.currentDurationSec = e.duration;
            this.playTime = this.audioRecorderPlayer.mmssss(Math.floor(e.currentPosition));
            this.duration = this.audioRecorderPlayer.mmssss(Math.floor(e.duration));
            return;
        });
    };

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