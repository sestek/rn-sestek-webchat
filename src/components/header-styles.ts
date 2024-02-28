import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  headerContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems:"center"
  },
  headerText: {
    flex: 1,
    paddingTop: 8,
    paddingLeft: 10,
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
