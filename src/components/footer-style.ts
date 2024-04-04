import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
  textInput: {
    color: 'black',
    backgroundColor: 'white',
    height: '100%',
    padding: 5,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    paddingLeft: 10,
  },
  SendButtonIcon: {
    width: 25,
    height: 25,
  },
  MicButtonIcon: {
    width: 25,
    height: 25,
  },
  AttachmentIcon: {
    width: 25,
    height: 25,
  },
  audioButton: {
    height: '100%',
    width: 25,
    backgroundColor: 'transparent',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    paddingRight: 10,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderTopWidth: 1,
  },
  AttachmentButton: {
    height: '100%',
    width: 25,
    backgroundColor: 'transparent',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 15,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderTopWidth: 1,
  },
  sendButton: {
    height: '100%',
    width: 53,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    borderRadius: 10,
  },
});
