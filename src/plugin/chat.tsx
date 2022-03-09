import React, { useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

export const ChatModal = () => {
  //const [messages, setMessages] = useState(props.messages || []);
  const [visible, setVisible] = useState(false);

  return (
    <>
      <View style={styles.mainContainer}>
        <TouchableOpacity
          style={styles.floatBottomRight}
          onPress={() => setVisible((old) => !old)}
        >
          <Image
            style={styles.imageStyle}
            source={require('../image/chat_icon.png')}
          />
        </TouchableOpacity>
      </View>
      {/*visible && (
                <ModalComponent visible={visible} closeModal={setVisible} {...props} />
            )*/}
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
