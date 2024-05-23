import React, { FC, useContext } from 'react';
import { View } from 'react-native';
import type { PropsAvatar } from '../../../types/';
import styles from '../style';
import { RobotIcon } from '../../../image';
import RenderImage from '../../renderImage';
import { CustomizeConfigurationContext } from '../../../context/CustomizeContext';

const Avatar: FC<PropsAvatar> = (props) => {
  const context  = useContext(CustomizeConfigurationContext)
  const {customizeConfiguration} = context
  return (
    <View style={styles.messageBoxAvatarTitleContainer}>
      <RenderImage
        type={customizeConfiguration?.chatBotMessageIcon?.type}
        value={customizeConfiguration?.chatBotMessageIcon?.value}
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
