import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
  Image,
} from 'react-native';

interface AttachmentDropdownProps {
  isVisible: boolean;
  onSelect: (option: string) => void;
  onClose: () => void;
  options: Array<{ key: string; label: string; icon: any }>; 
}

const AttachmentDropdown: React.FC<AttachmentDropdownProps> = ({
  isVisible,
  onSelect,
  onClose,
  options, 

}) => {
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible]);

  const dropdownStyle = {
    transform: [
      {
        scale: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0.8, 1],
        }),
      },
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [20, 0],
        }),
      },
    ],
    opacity: animation,
  };

  if (!isVisible) return null;
  return (
    <TouchableWithoutFeedback onPress={onClose}>
      <View>
        <Animated.View style={[styles.dropdownContainer, dropdownStyle]}>
          {options.map((option) => (
            <TouchableOpacity
              key={option.key}
              style={styles.option}
              onPress={() => {
                onSelect(option.key);
                onClose();
              }}
            >
              <View style={styles.optionContent}>
                <Text style={styles.optionText}>{option.label}</Text>
                <Image source={option.icon} style={styles.icon} />
              </View>
            </TouchableOpacity>
          ))}
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
  
};
const styles = StyleSheet.create({
  dropdownContainer: {
    position: 'absolute',
    bottom: 30,
    right: 10,
    borderRadius: 8,
    paddingVertical: 2,
    paddingHorizontal: 5,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 10,
    zIndex: 9999,
  },
  option: {
    paddingVertical: 8,
    paddingHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    flex: 1, 
    textAlign: 'left', 
  },
  icon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
    marginLeft: 20,
  },
});

export default AttachmentDropdown;
