import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
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
    backgroundColor: 'transparent',
    paddingTop:10
  },
  textSubContainer: {
    padding: 5,
    marginBottom: 10,
  },
  text: {
    textAlign: 'center',
    color: 'black',
    letterSpacing: 0.7,
  },
});
