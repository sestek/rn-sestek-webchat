import React, { FC } from 'react';
import { View } from 'react-native';
import type { PropsAvatar } from '../../../types/';
import styles from '../style';
import { RobotIcon } from '../../../image';
import RenderImage from '../../renderImage';

const Avatar: FC<PropsAvatar> = (props) => {
  return (
    <View style={styles.messageBoxAvatarTitleContainer}>
      <RenderImage
        type={props.chatBotMessageIcon.type}
        value={props.chatBotMessageIcon.value}
        style={{ width: props.width, height: props.height }}
      />
    </View>
  );
};

Avatar.defaultProps = {
  width: 28,
  height: 28,
  chatBotMessageIcon: { type: 'uri', value: RobotIcon },
};

export default Avatar;
