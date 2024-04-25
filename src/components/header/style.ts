import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  headerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  headerTextContainer: {
    alignItems: 'center',
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageIcon: {
    width: 18,
    height: 18,
    marginRight: 15,
  },
  hideDefaultIcon: {
    width: 18,
    height: 18,
    marginRight: 15,
  },
  closeDefaultIcon: {
    width: 18,
    height: 18,
    marginRight: 15,
  },
  closeTextToCenterIcon:{
    width: 18,
    height: 18,
  }
});

export { styles };
