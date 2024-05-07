import React, { forwardRef } from 'react';
import { Text, View, Modal, TouchableOpacity } from 'react-native';
import { PropsCloseModalSettings } from '../../types';
import { styles } from './style';
import { useLanguage } from '../../context/LanguageContext';
export interface InProps {
  closeModal: boolean;
  setCloseModal: any;
  closeConversation: Function;
  appStyle: any;
}

const CloseModal = forwardRef<InProps, PropsCloseModalSettings>(
  (props, ref) => {
    const {
      closeModal,
      setCloseModal,
      closeConversation,
      closeModalSettings,
      appStyle,
    } = props;

    const { getTexts } = useLanguage();
    const texts = getTexts();
  
    return (
      <Modal animationType="slide" transparent={true} visible={closeModal}>
        <View style={styles(closeModalSettings)?.centeredView}>
          <View style={styles(closeModalSettings)?.modalView}>
            <Text
              style={[
                styles(closeModalSettings)?.modalText,
                { fontSize: appStyle?.fontSettings?.descriptionFontSize },
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
                    { fontSize: appStyle?.fontSettings?.descriptionFontSize },
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
                    { fontSize: appStyle?.fontSettings?.descriptionFontSize },
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
