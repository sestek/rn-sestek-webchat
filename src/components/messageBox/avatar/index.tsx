import React, { FC, useState } from 'react';
import { Image, View } from 'react-native';
import type { PropsAvatar } from '../../../types/';
import styles from '../style';

const Avatar: FC<PropsAvatar> = (props) => {
  const [isUriValid, setIsUriValid] = useState(true);

  const handleImageError = () => {
    setIsUriValid(false);
  };

  const imageSource = isUriValid
    ? typeof props.src === 'object'
      ? { uri: props.src.uri }
      : props.src
    : require('../../../image/error.png');

    return (
    <View style={styles.messageBoxAvatarTitleContainer}>
      <Image
        style={[
          styles.messageBoxAvatarDefaultSize,
          { width: props.width, height: props.height },
        ]}
        source={imageSource}
        onError={handleImageError}
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
