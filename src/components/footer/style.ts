import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    backgroundColor: 'white',
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderColor: '#d3d3d3',
  },
  textInput: {
    flex: 1,
    paddingVertical: 8,
  },

  iconContainer: {
    paddingHorizontal: 2,
  },
  icon: {
    width: 24,
    height: 24,
  },
  sendButton: {
    backgroundColor: '#0066cc',
    padding: 10,
    borderRadius: 10,
    marginLeft: 10,
  },
  sendIcon: {
    width: 24,
    height: 24,
  },
});
