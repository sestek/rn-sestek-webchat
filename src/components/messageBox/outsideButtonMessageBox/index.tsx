import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useCustomizeConfiguration } from '../../../context/CustomizeContext';

interface ButtonProps {
  value: string;
  title: string;
}

interface Props {
  attachmentsData: any;
  onPressButton: (value: string, title: string) => void;
  disabled?: boolean;
}

const OutsideButton: React.FC<Props> = ({
  attachmentsData,
  onPressButton,
  disabled = false,
}) => {
  const { customizeConfiguration } = useCustomizeConfiguration();
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
            disabled={disabled}
            onPress={() => onPressButton(button?.value, button?.title)}
            style={{
              padding: 5,
              margin: 3,
              paddingHorizontal: 10,
              alignSelf: 'flex-start',
              borderRadius: 8,
              borderColor: customizeConfiguration?.chatBotMessageBoxButtonBorderColor,
              borderWidth: 1.5,
              backgroundColor:customizeConfiguration?.chatBotMessageBoxButtonBackground,
              opacity: disabled ? 0.5 : 1
            }}
          >
            <Text style={{ color: customizeConfiguration?.chatBotMessageBoxButtonTextColor, fontSize:customizeConfiguration?.fontSettings?.descriptionFontSize, fontWeight:'500' }}>
              {button?.title}
            </Text>
          </TouchableOpacity>
        )
      )}
    </View>
  );
};

export default OutsideButton;
