import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
  },
  textInput: {
    backgroundColor: 'white',
    height: '100%',
    padding: 5,
    borderRadius: 10,
  },
  icon: {
    width: 25,
    height: 25,
    margin: 5,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  textSubContainer: {
    backgroundColor: '#ff0000',
    padding: 5,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  text: {
    textAlign: 'center',
    color: 'black',
    letterSpacing: 0.7,
    fontSize: 11,
  },
});
