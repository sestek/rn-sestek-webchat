import React, { FC, useState } from 'react';
import { Alert, Modal, View, ImageBackground } from 'react-native';
import { useChat } from '../plugin/useChat';
import type { PropsModalComponent } from '../types';
import BodyComponent from './body';
import FooterComponent from './footer';
import HeaderComponent from './header';
import { styles } from './modal-style';

const ModalComponent: FC<PropsModalComponent> = (props) => {

    const [inputData, setInputData] = useState<string>("");
    const changeInputData = (text: string) => setInputData(text);


    const [messageList, sendMessage] = useChat({
        defaultConfiguration: props.defaultConfiguration,
        messages: [],
        sessionId: props.sessionId,
        client: props.client
    });

    //console.log(JSON.stringify(messageList));
    const { bodyColorOrImage, headerColor, headerText, bottomColor, bottomInputText } = props.customizeConfiguration;

    return (
        <Modal
            animationType={"slide"}
            transparent={true}
            visible={props.visible}
            onRequestClose={() => {
                Alert.alert('Modal has now been closed.');
            }}>
            <View style={styles.container}>
                <View style={[styles.header, headerColor ? { backgroundColor: headerColor } : {}]}>
                    <HeaderComponent {...props} headerText={headerText || undefined} />
                </View>
                <View style={{ flex: 1, backgroundColor: bodyColorOrImage?.type == "color" ? bodyColorOrImage.value : '#fff' }}>
                    {bodyColorOrImage?.type == "image" &&
                        <ImageBackground source={{ uri: bodyColorOrImage?.value }} style={{ width: '100%', height: '100%' }} resizeMode="stretch">
                            <BodyComponent
                                customizeConfiguration={props.customizeConfiguration}
                                messageList={messageList}
                                changeInputData={changeInputData}
                                sendMessage={sendMessage}
                            />
                        </ImageBackground>}
                    {bodyColorOrImage?.type != "image" &&
                        <BodyComponent
                            customizeConfiguration={props.customizeConfiguration}
                            messageList={messageList}
                            changeInputData={changeInputData}
                            sendMessage={sendMessage}
                        />}
                </View>
                <View style={[styles.footer, bottomColor ? { backgroundColor: bottomColor } : {}]}>
                    <FooterComponent
                        {...props}
                        inputData={inputData}
                        changeInputData={changeInputData}
                        sendMessage={sendMessage}
                        placeholderText={bottomInputText}
                    />
                </View>
            </View>
        </Modal >
    )
};

export default ModalComponent;