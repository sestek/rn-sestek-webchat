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
    // Cleanup SART: eskiden dinleyici hic kaldirilmiyordu. Her mount bir
    // dinleyici birakiyor, uygulama arka plana her alindiginda hepsi birden
    // tetikleniyor ve buna bagli isler (history yenileme) katlanarak artiyordu.
    //
    // Iki RN nesli de destekleniyor: RN >= 0.65 addEventListener'dan
    // { remove() } donuyor, oncesinde removeEventListener kullaniliyordu.
    // (SDK RN 0.63 tiplerine karsi derlendigi icin cast gerekiyor.)
    const appState: any = AppState;
    const subscription: any = appState.addEventListener('change', handleChange);
    return () => {
      if (subscription?.remove) {
        subscription.remove();
      } else if (appState.removeEventListener) {
        appState.removeEventListener('change', handleChange);
      }
    };
  }, []);

  return {
    background,
  };
};

export default useCheckBackground;
