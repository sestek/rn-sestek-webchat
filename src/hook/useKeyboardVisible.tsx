import { useEffect, useState } from 'react';
import { Keyboard, Platform } from 'react-native';

const useKeyboardVisible = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const isIOS = Platform.OS === 'ios';
    const showEvent: any = isIOS ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent: any = isIOS ? 'keyboardWillHide' : 'keyboardDidHide';

    const show = Keyboard.addListener(showEvent, () => setVisible(true));
    const hide = Keyboard.addListener(hideEvent, () => setVisible(false));

    return () => {
      show?.remove?.();
      hide?.remove?.();
    };
  }, []);

  return visible;
};

export default useKeyboardVisible;
