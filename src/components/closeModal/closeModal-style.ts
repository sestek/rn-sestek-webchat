import { StyleSheet } from 'react-native';

export const styles = (props?: any) =>
  StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22,
      zIndex: 301,
    },
    modalView: {
      margin: 20,
      backgroundColor: props?.background || 'white',
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },

    modalText: {
      marginBottom: 15,
      textAlign: 'center',
      fontWeight: '400',
    },
    buttonContainer: { flexDirection: 'row', gap: 10 },
    yesButton: {
      height: 50,
      width: 100,
      backgroundColor: props?.buttons?.yesButton?.background || '#7f81ae',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 5,
      borderWidth: 1,
      borderColor: props?.buttons?.yesButton?.borderColor || 'transparent',
    },
    yesButtonText: { color: props?.buttons?.yesButton?.textColor || 'white' },
    noButton: {
      backgroundColor: props?.buttons?.noButton?.background || 'white',
      height: 50,
      width: 100,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 5,
      borderWidth: 1,
      borderColor: props?.buttons?.noButton?.borderColor,
    },
    noButtonText: { color: props?.buttons?.noButton?.textColor || 'black' },
  });
