import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

const useCheckBackground = () => {
  const [background, setbackground] = useState(false);
  useEffect(() => {
    const handleChange = (nextAppState: any) => {
      if (nextAppState === 'background') {
        setbackground(true);
      } else if (nextAppState === 'active') {
        setbackground(false);
      }
    };
    AppState?.addEventListener('change', handleChange);
  }, []);

  return {
    background,
  };
};

export default useCheckBackground;
