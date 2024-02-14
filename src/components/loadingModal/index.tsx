import React from 'react';
import {
  View,
  Modal,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

const LoadingModal = ({ indicatorColor }: { indicatorColor: string }) => {
  return (
    <Modal transparent={true} visible={true}>
      <View style={styles.container}>
        <ActivityIndicator
          size="large"
          color={indicatorColor ? indicatorColor : 'gray'}
        />
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default LoadingModal;
