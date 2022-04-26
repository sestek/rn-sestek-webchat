import React, { FC } from 'react';
import { Image, View } from 'react-native';
import type { PropsAvatar } from '../../../types/';
import styles from './style';

const Avatar: FC<PropsAvatar> = (props) => {
  return (
    <View style={styles.rceAvatarContainer}>
      <Image
        style={[
          styles.rceAvatarDefault,
          { width: props.width, height: props.height },
        ]}
        source={props.src}
      />
      {props.sideElement}
    </View>
  );
};

Avatar.defaultProps = {
  width: 20,
  height: 20,
  src: '',
  alt: '',
  sideElement: null,
};

export default Avatar;
