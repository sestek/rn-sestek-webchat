import { StyleSheet } from 'react-native';
import { GeneralManager } from '../services';

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'column',
    zIndex: 2,
    flex: 1,
    position: 'absolute',
    alignSelf: 'flex-end',
    bottom: 10,
    right: 10,
  },
  floatBottomRight: {
    backgroundColor: GeneralManager.getColorAndText().backgroundColor,
    padding: 0,
    borderRadius: 50,
  },
});

export { styles };
