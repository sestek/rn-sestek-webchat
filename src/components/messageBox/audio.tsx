import React, { FC, useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Recorder } from '../../services';
import type { PropsAudio } from '../../types/';
import { PlayIcon, PauseIcon } from '../../image';

const AudioComponent: FC<PropsAudio> = (props) => {
    const [stateRecord, setStateRecord] = useState<any>({ playTime: "00:00:00", duration: "00:00:00" });
    const [recorder] = useState<Recorder>(new Recorder(props.modules.AudioRecorderPlayer, props.modules.RNFS));
    const [start, setStart] = useState<boolean>(false);
    const triggerStart = () => setStart(old => !old);

    //GET DURATION
    useEffect(() => {
        getDuration();
    }, []);

    const getDuration = async () => {
        await recorder.audioRecorderPlayer.startPlayer(props.url);
        recorder.audioRecorderPlayer.addPlayBackListener((e: any, x: any) => {
            recorder.currentDurationSec = e.duration;
            setStateRecord({
                playTime: "00:00:00",
                duration: recorder.audioRecorderPlayer.mmssss(Math.floor(e.duration))
            })
            recorder.audioRecorderPlayer.stopPlayer();
            recorder.audioRecorderPlayer.removePlayBackListener();
            return;
        });
    }

    useEffect(() => {
        if (stateRecord.playTime === stateRecord.duration && stateRecord.playTime !== "00:00:00") {
            recorder.audioRecorderPlayer.stopPlayer();
            recorder.audioRecorderPlayer.removePlayBackListener();
            setStateRecord({
                playTime: "00:00:00",
                duration: stateRecord.duration
            });
            triggerStart();
        }
    }, [stateRecord])

    const onPlayPlayer = async () => {
        if (stateRecord.playTime !== "00:00:00") {
            await recorder.audioRecorderPlayer.resumePlayer();
        }
        else {
            await recorder.audioRecorderPlayer.startPlayer(props.url);
        }
        recorder.audioRecorderPlayer.addPlayBackListener((e: any, x: any) => {
            recorder.currentPositionSec = e.currentPosition;
            recorder.currentDurationSec = e.duration;
            setStateRecord({
                playTime: recorder.audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)),
                duration: recorder.audioRecorderPlayer.mmssss(Math.floor(e.duration))
            })
            return;
        });
        triggerStart();
    }

    const onPausePlayer = async () => {
        recorder.audioRecorderPlayer.removePlayBackListener();
        await recorder.audioRecorderPlayer.pausePlayer();
        triggerStart();
    }
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ paddingRight: 5 }}>{stateRecord.playTime + ' / ' + stateRecord.duration}</Text>
            <TouchableOpacity onPress={() => !start ? onPlayPlayer() : onPausePlayer()}>
                <Image source={!start ? PlayIcon : PauseIcon} style={{ width: 25, height: 25 }} />
            </TouchableOpacity>
        </View>
    );
}

AudioComponent.defaultProps = {
    url: '',
};

export default React.memo(AudioComponent);