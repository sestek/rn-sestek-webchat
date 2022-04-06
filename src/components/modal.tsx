import React, { FC, useEffect, useState } from 'react';
import { Alert, Modal, View } from 'react-native';
import { useChat } from '../plugin/useChat';
import type { PropsModalComponent } from 'src/types';
import BodyComponent from './body';
import FooterComponent from './footer';
import HeaderComponent from './header';
import { styles } from './modal-style';

const ModalComponent: FC<PropsModalComponent> = (props) => {

    const [inputData, setInputData] = useState<string>("");
    const changeInputData = (text: string) => setInputData(text);

    const [messageList, sendMessage] = useChat({
        defaultConfiguration: {
            sendConversationStart: true,
            tenant: 'Hakan',
            projectName: 'ChatBotMessages',
            channel: 'NdaInfoBip'
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
                    <BodyComponent
                        messageList={messageList}
                        changeInputData={changeInputData}
                        sendMessage={sendMessage}
                    />
                </View>
                <View style={styles.footer}>
                    <FooterComponent
                        {...props}
                        inputData={inputData}
                        changeInputData={changeInputData}
                        sendMessage={sendMessage}
                    />
                </View>
            </View>
        </Modal>
    )
};

export default ModalComponent;