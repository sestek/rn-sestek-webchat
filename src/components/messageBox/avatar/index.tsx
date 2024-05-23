import React, { FC } from 'react';
import { View } from 'react-native';
import styles from '../style';
import RenderImage from '../../renderImage';
import { useCustomizeConfiguration } from '../../../context/CustomizeContext';

const Avatar: FC = () => {
  const { customizeConfiguration } = useCustomizeConfiguration();
  return (
    <View style={styles.messageBoxAvatarTitleContainer}>
      <RenderImage
        type={customizeConfiguration?.chatBotMessageIcon?.type}
        value={customizeConfiguration?.chatBotMessageIcon?.value}
        style={{ width: customizeConfiguration?.chatBotMessageBoxAvatarIconSize, height: customizeConfiguration?.chatBotMessageBoxAvatarIconSize}}
      />
    </View>
  );
};


export default Avatar;
