import React, { FC, useEffect } from 'react';
import { Alert, Modal, View } from 'react-native';
import { useChat } from '../plugin/useChat';
import type { PropsModalComponent } from 'src/types';
import BodyComponent from './body';
import FooterComponent from './footer';
import HeaderComponent from './header';
import { styles } from './modal-style';

const ModalComponent: FC<PropsModalComponent> = (props) => {

    const [messageList, sendMessage] = useChat({
        defaultConfiguration: {
            sendConversationStart: true,
            tenant: 'AXA',
            projectName: 'AXAChatbot',
            channel: 'NdUi'
        },
        messages: []
    });

    useEffect(() => {
        if (messageList.length > 0) {
            //sendMessage("deneme");
        }
    }, [messageList])

    console.log(JSON.stringify(messageList));

    return (
        <Modal
            animationType={"slide"}
            transparent={true}
            visible={true}
            onRequestClose={() => {
                Alert.alert('Modal has now been closed.');
            }}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <HeaderComponent {...props} />
                </View>
                <View style={{ flex: 1, backgroundColor: 'gray' }}>
                    <BodyComponent messageList={messageList} />
                </View>
                <View style={styles.footer}>
                    <FooterComponent {...props} />
                </View>
            </View>
        </Modal>
    )
};

export default ModalComponent;