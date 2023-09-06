import React, { forwardRef, useEffect } from 'react';
import { Text, View, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { PropsCloseModalSettings } from "../../types"

export interface InProps {
    closeModal: boolean;
    setCloseModal: any;
    closeConversation: Function,
}

const CloseModal = forwardRef<InProps, PropsCloseModalSettings>((props, ref) => {
    const { closeModal, setCloseModal, closeConversation, closeModalSettings } = props;
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={closeModal}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>{closeModalSettings?.text || "Chat'ten çıkmak istediğinize emin misiniz ??"}</Text>
                    <View style={{ flexDirection: "row", gap: 10 }}>
                        <TouchableOpacity
                            onPress={() => {
                                closeConversation();
                                setCloseModal(false);
                            }}
                            style={{
                                height: 50, width: 100, backgroundColor: closeModalSettings?.buttons?.yesButton?.background || "#7f81ae",
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: 5,
                                borderWidth: 1,
                                borderColor: closeModalSettings?.buttons?.yesButton?.borderColor
                            }}>
                            <Text style={{ color: closeModalSettings?.buttons?.yesButton?.textColor || "white" }}>{closeModalSettings?.buttons?.yesButton?.text || "Evet"}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            setCloseModal(false);
                        }} style={{
                            backgroundColor: closeModalSettings?.buttons?.noButton?.background || "#7f81ae",
                            height: 50, width: 100,
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: 5,
                            borderWidth: 1,
                            borderColor: closeModalSettings?.buttons?.noButton?.borderColor
                        }}>
                            <Text style={{ color: closeModalSettings?.buttons?.noButton?.textColor || "black" }}>{closeModalSettings?.buttons?.noButton?.text || "Hayır"}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal >
    );
});

export default CloseModal;

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
        zIndex: 301,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontWeight: "400"
    },
});
