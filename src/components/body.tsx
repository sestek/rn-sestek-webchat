import React, { FC } from 'react';
import { ScrollView, TextInput, View } from 'react-native';
import type { PropsBodyComponent } from 'src/types';
import { styles } from './body-style';
import MessageBox from './messageBox';

const BodyComponent: FC<PropsBodyComponent> = (props) => {

    return (
        <ScrollView style={styles.container}>
            {props.messageList.map(x => <MessageBox
                position={'left'}
                type={'text'}
                text={'dwqgdıwqgıdqwguıdgqwgudıqwguıdgqıudgıuqwdguıwqduıasdguısagudıasguıuudgıqwgıudgıuqwdguqguıdqgıwudguıqwdguıqwguıdqugıwdguıqwdwqıudgqwuıdguıqwgduwqgu'}
                status={null}
                avatar={undefined}
                renderAddCmp={undefined}
            />)}
            {props.messageList.map(x => <MessageBox
                position={'left'}
                type={'text'}
                text={'dawdawdwad'}
                status={null}
                avatar={undefined}
                renderAddCmp={undefined}
            />)}
            {props.messageList.map(x => <MessageBox
                position={'right'}
                type={'text'}
                text={''}
                status={null}
                avatar={{uri:'https://www.pngitem.com/pimgs/m/122-1223088_one-bot-discord-avatar-hd-png-download.png'}}
                renderAddCmp={undefined}
            />)}
            <MessageBox
                position={'right'}
                type={'text'}
                text={''}
                status={null}
                avatar={{uri:'https://www.pngitem.com/pimgs/m/122-1223088_one-bot-discord-avatar-hd-png-download.png'}}
                renderAddCmp={undefined}
            />
        </ScrollView>
    )
}

export default BodyComponent;