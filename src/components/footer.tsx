import React, { FC, useState } from 'react';
import { Image, TextInput, TouchableOpacity, View } from 'react-native';
import type { PropsFooterComponent } from 'src/types';
import { styles } from './footer-style';
import { RecordInIcon, RecordOutIcon, SendIcon } from '../image';
import { Recorder } from '../services';

const FooterComponent: FC<PropsFooterComponent> = (props) => {

    const recordEnabled = props.modules.AudioRecorderPlayer && props.modules.RNFS ? true : false;

    const [recorder] = useState<Recorder | undefined>(recordEnabled ? new Recorder(props.modules.AudioRecorderPlayer, props.modules.RNFS) : undefined);
    const [recordStart, setRecordStart] = useState<boolean>(false);
    const triggerRecord = async () => {
        if (recordStart) {
            var result = await recorder?.onStopRecord();
            const dirFile = result?.url.split('/');
            console.log('TEST', dirFile[dirFile.length - 1]);
            //const uri = props.modules.RNFS.fs.dirs.CacheDir + '/' + dirFile[dirFile.length - 1];
            props.sendAudio(result?.url, dirFile[dirFile.length - 1], result?.data);
        }
        else {
            recorder?.onStartRecord();
        }
        setRecordStart(old => !old);
    }

    const clickSendButton = () => {
        if (!props.inputData) return;
        props.sendMessage(props.inputData);
        props.changeInputData("");
    }

    return (
        <View style={styles.container}>
            <View style={{ flex: 1 }}>
                <TextInput
                    style={styles.textInput}
                    value={props.inputData}
                    onChangeText={(text: string) => props.changeInputData(text)}
                    placeholder={props.placeholderText || "Please write a message"}
                    keyboardType="default"
                />
            </View>
            {props.modules.AudioRecorderPlayer && props.modules.RNFS &&
                <TouchableOpacity onPress={() => { triggerRecord() }}>
                    <Image style={styles.icon} source={recordStart ? RecordInIcon : RecordOutIcon} />
                </TouchableOpacity>
            }
            <TouchableOpacity onPress={clickSendButton}>
                <Image style={styles.icon} source={SendIcon} />
            </TouchableOpacity>
        </View>
    )
}

export default FooterComponent;