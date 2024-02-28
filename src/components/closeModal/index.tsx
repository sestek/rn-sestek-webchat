import React, { forwardRef } from 'react';
import { Text, View, Modal, TouchableOpacity } from 'react-native';
import { PropsCloseModalSettings } from '../../types';
import { styles } from './closeModal-style';
export interface InProps {
  closeModal: boolean;
  setCloseModal: any;
  closeConversation: Function;
}

const CloseModal = forwardRef<InProps, PropsCloseModalSettings>(
  (props, ref) => {
    const { closeModal, setCloseModal, closeConversation, closeModalSettings } =
      props;
    return (
      <Modal animationType="slide" transparent={true} visible={closeModal}>
        <View style={styles(closeModalSettings)?.centeredView}>
          <View style={styles(closeModalSettings)?.modalView}>
            <Text style={styles(closeModalSettings)?.modalText}>
              {closeModalSettings?.text ||
                "Chat'ten çıkmak istediğinize emin misiniz ??"}
            </Text>
            <View style={styles(closeModalSettings).buttonContainer}>
              <TouchableOpacity
                onPress={() => {
                  setCloseModal(false);
                }}
                style={styles(closeModalSettings)?.noButton}
              >
                <Text style={styles(closeModalSettings)?.noButtonText}>
                  {closeModalSettings?.buttons?.noButton?.text || 'Hayır'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  closeConversation();
                  setCloseModal(false);
                }}
                style={styles(closeModalSettings)?.yesButton}
              >
                <Text style={styles(closeModalSettings)?.yesButtonText}>
                  {closeModalSettings?.buttons?.yesButton?.text || 'Evet'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
);

export default CloseModal;
