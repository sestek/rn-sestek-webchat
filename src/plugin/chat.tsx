import React, { useState, useCallback, FC, useEffect } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import ModalComponent from '../components/modal';
import { ChatIcon } from '../image';

interface PropsChatModal {
  triggerModal?: () => void;
}

export const ChatModal: FC<PropsChatModal> = (props) => {

  const [visible, setVisible] = useState<boolean>(false);
  const triggerVisible = useCallback(() => {
    setVisible(old => !old);
  }, [visible]);

  useEffect(() => {
    if (props.triggerModal) {
      triggerVisible();
    }
  }, []);

  return (
    <>
      <View style={styles.mainContainer}>
        <TouchableOpacity
          style={styles.floatBottomRight}
          onPress={() => setVisible((old) => !old)}
        >
          <Image
            style={styles.imageStyle}
            source={ChatIcon}
          />
        </TouchableOpacity>
      </View>
      {visible && (
        <ModalComponent
          visible={visible}
          closeModal={triggerVisible}
        //...props} 
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'column',
    zIndex: 2,
    flex: 1,
    position: 'absolute',
    alignSelf: 'flex-end',
    bottom: 10,
    right: 10,
  },
  floatBottomRight: {
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 50,
  },
  imageStyle: {
    width: 50,
    height: 50,
  },
});
