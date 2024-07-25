import React, { FC } from 'react';
import { View } from 'react-native';
import styles from '../style';
import RenderImage from '../../renderImage';
import { useCustomizeConfiguration } from '../../../context/CustomizeContext';

interface AvatarProps {
  position: string;
}

const Avatar: FC<AvatarProps> = (props) => {
  const { customizeConfiguration } = useCustomizeConfiguration();

  const isRightPosition = props.position === 'right';
  const messageIcon = isRightPosition
    ? customizeConfiguration?.chatBotMessageIcon
    : customizeConfiguration?.userMessageIcon;

  if (!messageIcon?.type || !messageIcon?.value) {
    return null;
  }

  return (
    <View
      style={{
        ...styles.messageBoxAvatarContainer,
        marginLeft: isRightPosition ? 8 : 0,
        marginRight: !isRightPosition ? 8 : 0,
      }}
    >
      <RenderImage
        type={messageIcon.type}
        value={messageIcon.value}
        style={{
          width: customizeConfiguration?.messageBoxAvatarIconSize,
          height: customizeConfiguration?.messageBoxAvatarIconSize,
        }}
      />
    </View>
  );
};

export default Avatar;
