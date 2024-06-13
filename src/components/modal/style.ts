import { Platform, StyleSheet } from 'react-native';
import { GeneralManager } from '../../services';

export const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
  },
  header: {
    height: Platform.OS === 'android' ? 45 : GeneralManager.getStatusBarHeight() +45,
    width: '100%',
    paddingTop:
      Platform.OS === 'android' ? 0 : GeneralManager.getStatusBarHeight(),
  },
  body: {},
  footer: {
    height: Platform.OS === 'android' ? 67 : 80,
    backgroundColor: GeneralManager.getColorAndText().backgroundColor,
    padding: 10,
    paddingBottom: Platform.OS === 'android' ? 10 : 25,
  },
  imageBackground: {
    width: '100%',
    height: '100%',
  },
});
