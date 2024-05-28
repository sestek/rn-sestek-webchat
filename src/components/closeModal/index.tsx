import React, { forwardRef } from 'react';
import { Text, View, Modal, TouchableOpacity } from 'react-native';
import { PropsCloseModalSettings } from '../../types';
import { styles } from './style';
import { useCustomizeConfiguration } from '../../context/CustomizeContext';
export interface InProps {
  closeModal: boolean;
  setCloseModal: any;
  closeConversation: Function;
}

const CloseModal = forwardRef<InProps, PropsCloseModalSettings>(
  (props, ref) => {
    const {
      closeModal,
      setCloseModal,
      closeConversation,
      closeModalSettings,
    } = props;
    const { customizeConfiguration ,getTexts} = useCustomizeConfiguration();
    const texts = getTexts();
  
    return (
      <Modal animationType="slide" transparent={true} visible={closeModal}>
        <View style={styles(closeModalSettings)?.centeredView}>
          <View style={styles(closeModalSettings)?.modalView}>
            <Text
              style={[
                styles(closeModalSettings)?.modalText,
                { fontSize: customizeConfiguration?.fontSettings?.descriptionFontSize },
              ]}
            >
             {texts.closeModalText}
            </Text>
            <View style={styles(closeModalSettings).buttonContainer}>
              <TouchableOpacity
                onPress={() => {
                  setCloseModal(false);
                }}
                style={styles(closeModalSettings)?.noButton}
              >
                <Text
                  style={[
                    styles(closeModalSettings)?.noButtonText,
                    { fontSize: customizeConfiguration?.fontSettings?.descriptionFontSize },
                  ]}
                >
                  {texts.closeModalNoButtonText}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  closeConversation();
                  setCloseModal(false);
                }}
                style={styles(closeModalSettings)?.yesButton}
              >
                <Text
                  style={[
                    styles(closeModalSettings)?.yesButtonText,
                    { fontSize: customizeConfiguration?.fontSettings?.descriptionFontSize },
                  ]}
                >
                 {texts.closeModalYesButtonText}
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
