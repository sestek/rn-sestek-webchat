import { Dimensions, StyleSheet } from 'react-native';

const width = Dimensions.get('window').width;

export default StyleSheet.create({
  messageBox: {
    backgroundColor: 'transparent',
    borderRadius: 10,
    borderTopRightRadius: 10,
    marginLeft: 20,
    marginRight: 5,
    flexDirection: 'column',
    paddingLeft: 9,
    paddingRight: 9,
    maxWidth: width - 50,
    alignSelf: 'flex-end',
  },

  messageBoxRight: {
    alignSelf: 'flex-start',
    marginLeft: 0,
    marginRight: 20,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  messageBoxContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: width,
    overflow: 'hidden',
  },

  messageBoxInContainer: {
    flexDirection: 'column',
  },

  messageBoxBody: {
    margin: 0,
    position: 'relative',
    minWidth: 100,
    padding: 8,
    borderRadius: 15,
    maxWidth: Dimensions.get('screen').width * 0.8,
    justifyContent: 'center',
    alignItems: 'center', 
  },

  messageBoxTimeBlock: {
    width:'100%'
  },
  messageBoxTimeBlockText: {
    textAlign: 'right',
  },
  messageBoxTitle: {
    margin: 0,
    marginBottom: 8,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageBoxAvatarContainer: {
    display: 'flex',
    marginLeft: 15,
    paddingTop: 12,
  },

  messageBoxAvatarDefaultSize: {
    maxHeight: 50,
    maxWidth: 50,
    minHeight: 15,
    minWidth: 15,
    borderRadius: 25,
    overflow: 'hidden',
  },

  generalMessageBoxWebviewContainer: {
    flex: 1,
    maxWidth: Dimensions.get('screen').width * 0.7,
  },
  generalMessageBoxInWebviewInContainer: {
    height: Dimensions.get('screen').height * 0.3,
    width: Dimensions.get('screen').width * 0.7,
  },

  generalMessageBoxButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  messageBoxAvatarTitleContainer: {
    marginRight: 5,
  },

  generalMessageBoxButton: {
    backgroundColor: '#ff6600',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 6,
  },
});
