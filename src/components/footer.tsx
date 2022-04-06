import React, { FC } from 'react';
import { Image, TextInput, TouchableOpacity, View } from 'react-native';
import type { PropsFooterComponent } from 'src/types';
import { styles } from './footer-style';
import { VoiceIcon, SendIcon } from '../image';

const FooterComponent: FC<PropsFooterComponent> = (props) => {


    const clickSendButton = () => {
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
            <TouchableOpacity onPress={() => { }}>
                <Image style={styles.icon} source={VoiceIcon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={clickSendButton}>
                <Image style={styles.icon} source={SendIcon} />
            </TouchableOpacity>
        </View>
    )
}

export default FooterComponent;