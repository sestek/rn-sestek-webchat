import React, { FC } from 'react';
import { Image, TextInput, TouchableOpacity, View } from 'react-native';
import type { PropsFooterComponent } from 'src/types';
import { styles } from './footer-style';

const FooterComponent: FC<PropsFooterComponent> = (props) => {

    return (
        <View style={styles.container}>
            <View style={{ flex: 1 }}>
                <TextInput
                    style={styles.textInput}
                    placeholder={props.placeholderText || "Please write a message"}
                    keyboardType="default"
                />
            </View>
            <TouchableOpacity onPress={() => { }}>
                <Image style={styles.icon} source={require('../image/voice.png')} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { }}>
                <Image style={styles.icon} source={require('../image/send.png')} />
            </TouchableOpacity>
        </View>
    )
}

export default FooterComponent;