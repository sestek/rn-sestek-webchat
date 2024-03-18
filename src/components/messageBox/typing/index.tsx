import React, { FC } from 'react';
import { View } from 'react-native';
import TypingAnimation from "../../../plugin/typing"
const Typing: FC = (props) => {
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



export default Typing;