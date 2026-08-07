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
  (props) => {
    const {
      closeModal,
      setCloseModal,
      closeConversation,
      closeModalSettings,
    } = props;
    const { customizeConfiguration, getTexts } = useCustomizeConfiguration();
    const texts = getTexts();

    const handleClose = () => {
      closeConversation().then((data: boolean) => {
        setCloseModal(false);
        if (data && customizeConfiguration?.closeModalSettings?.onClose) {
          customizeConfiguration.closeModalSettings.onClose();
        }
      });
    };

    return (
      <Modal animationType="slide" transparent={true} visible={closeModal}>
        <View style={styles(closeModalSettings)?.centeredView}>
          <View
            style={styles(closeModalSettings)?.modalView}
            testID={closeModalSettings?.testID}
            accessibilityLabel={closeModalSettings?.accessibilityLabel}
          >
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
                testID={closeModalSettings?.buttons?.noButton?.testID}
                accessibilityLabel={
                  closeModalSettings?.buttons?.noButton?.accessibilityLabel
                }
                accessibilityRole="button"
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
                  handleClose();
                }}
                style={styles(closeModalSettings)?.yesButton}
                testID={closeModalSettings?.buttons?.yesButton?.testID}
                accessibilityLabel={
                  closeModalSettings?.buttons?.yesButton?.accessibilityLabel
                }
                accessibilityRole="button"
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
