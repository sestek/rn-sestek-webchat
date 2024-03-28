import React, { FC } from 'react';
import { View } from 'react-native';
import TypingAnimation from '../../../plugin/typing';

const TypingMessage: FC = () => {
  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <TypingAnimation></TypingAnimation>
    </View>
  );
};

export default TypingMessage;
