import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface ButtonProps {
  value: string;
  title: string;
}

interface Props {
  attachmentsData: any;
  onPressButton: (value: string, title: string) => void;
  appStyle: any;
}

const OutsideButton: React.FC<Props> = ({
  attachmentsData,
  onPressButton,
  appStyle,
}) => {
  return (
    <View
      style={{
        flexDirection: 'column',
        justifyContent: 'center',
        paddingTop: 10,
      }}
    >
      {attachmentsData[0]?.content?.buttons?.map(
        (button: ButtonProps, index: number) => (
          <TouchableOpacity
            key={index}
            onPress={() => onPressButton(button?.value, button?.title)}
            style={{
              padding: 5,
              margin: 3,
              paddingHorizontal: 10,
              alignSelf: 'flex-start',
              borderRadius: 8,
              borderColor: appStyle.chatBotMessageBoxButtonBorderColor,
              borderWidth: 1.5,
            }}
          >
            <Text style={{ color: appStyle.chatBotMessageBoxButtonTextColor }}>
              {button?.title}
            </Text>
          </TouchableOpacity>
        )
      )}
    </View>
  );
};

export default OutsideButton;
