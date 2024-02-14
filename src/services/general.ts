import { Platform } from 'react-native';

export default class GeneralManager {
  static getMobileTopBottom(type: 'bottom' | 'top') {
    if (Platform.OS === 'ios') {
      return type === 'bottom' ? 20 : 35;
    }
    return 0;
  }

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
