import React, { FC, useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Recorder } from '../../services';
import type { PropsAudio } from '../../types/';
import { PlayIcon } from '../../image';

const AudioComponent: FC<PropsAudio> = (props) => {
    const [stateRecord, setStateRecord] = useState<any>({ playTime: 0, duration: 0 });
    const [recorder] = useState<Recorder>(new Recorder(props.modules.AudioRecorderPlayer, props.modules.RNFS));
    const [start, setStart] = useState<boolean>(false);
    const triggerStart = () => setStart(old => !old);

    useEffect(() => {
        if (stateRecord.playTime === stateRecord.duration) {
            recorder.audioRecorderPlayer.stopPlayer();
            recorder.audioRecorderPlayer.removePlayBackListener();
        }
    }, [stateRecord])

    const onPlayPause = async () => {
        if (start) {
            await recorder.audioRecorderPlayer.pausePlayer();
            triggerStart();
            return;
        }
        await recorder.audioRecorderPlayer.startPlayer(props.url);
        //console.log(props.url);
        recorder.audioRecorderPlayer.addPlayBackListener((e: any, x: any) => {
            recorder.currentPositionSec = e.currentPosition;
            recorder.currentDurationSec = e.duration;
            console.log(e, x)
            setStateRecord({
                playTime: recorder.audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)),
                duration: recorder.audioRecorderPlayer.mmssss(Math.floor(e.duration))
            })
            return;
        });
        triggerStart();
    }
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ paddingRight: 5 }}>{stateRecord.playTime + ' / ' + stateRecord.duration}</Text>
            <TouchableOpacity onPress={onPlayPause}>
                <Image source={PlayIcon} style={{ width: 25, height: 25 }} />
            </TouchableOpacity>
        </View>
    );
}

AudioComponent.defaultProps = {
    url: '',
};

export default React.memo(AudioComponent);