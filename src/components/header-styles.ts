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
    width: 15,
    height: 15,
    marginRight: 15,
  },
  hideDefaultIcon: {
    width: 15,
    height: 15,
    marginRight: 15,
  },
  closeDefaultIcon: {
    width: 15,
    height: 15,
    marginRight: 15,
  },
});

export { styles };
