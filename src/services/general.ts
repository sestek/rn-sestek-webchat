import { Dimensions, Platform } from 'react-native';

const { height: SCREEN_HEIGHT} = Dimensions.get('window');

export default class GeneralManager {
  static getStatusBarHeight = () => {
    if (Platform.OS === 'ios') {
      console.log(SCREEN_HEIGHT);
      if (SCREEN_HEIGHT > 845) {
        return 45; 
      } else if (SCREEN_HEIGHT >= 670 && SCREEN_HEIGHT <= 845) {
        return 35; 
      } else {
        return 20; 
      }
    }
    return 0; 
  };

  static getWebchatHost() {
    return `http://${
      Platform.OS !== 'ios' ? '10.0.2.2' : '192.168.52.51'
    }:55020/chathub`;
  }

  static createUUID() {
    var s = [];
    var hexDigits =
      '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVXZ';
    for (var i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }

    s[8] = s[13] = s[18] = s[23] = '-';

    var uuid = s.join('');
    return uuid;
  }

  static getColorAndText() {
    return {
      backgroundColor: '#ff6600',
      textColor: '#fff',
    };
  }

  static returnIconData(
    type: 'component' | 'uri' | undefined,
    value?: string,
    defaultIcon?: any
  ) {
    switch (type) {
      case 'component':
        return value;
      case 'uri':
        return { uri: value };
      default:
        return defaultIcon;
    }
  }
}
