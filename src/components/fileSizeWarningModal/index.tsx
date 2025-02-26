import { useCustomizeConfiguration } from '../../context/CustomizeContext';
import { ColsexIcon, WarningIcon } from '../../image';
import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';

type Props = {
  visible: boolean;
  onClose: () => void;
};

const FileSizeWarningModal: React.FC<Props> = ({ visible, onClose }) => {
  const { getTexts } = useCustomizeConfiguration();
  const texts = getTexts();

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Image source={ColsexIcon} style={styles.closeIcon} />
          </TouchableOpacity>

          <View style={styles.titleContainer}>
            <Image source={WarningIcon} style={styles.warningIcon} />
          </View>

          <Text style={styles.modalMessage}>{texts.fileErrorText}</Text>
        </View>
      </View>
    </Modal>
  );
};

export default FileSizeWarningModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 12,
  },
  closeIcon: {
    width: 15,
    height: 15,
    tintColor: '#555',
    marginTop:5,
    marginRight:5
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  warningIcon: {
    width: 30,
    height: 30,
  
  },
  modalMessage: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 16,
  },


});
