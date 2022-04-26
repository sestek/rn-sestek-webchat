import { Dimensions, StyleSheet } from 'react-native';

const width = Dimensions.get('window').width;

export default StyleSheet.create({
  rceContainerMbox: {
    display: 'flex',
    flexDirection: 'column',
    width: width,
    overflow: 'hidden',
  },

  rceMButton: {
    elevation: 8,
    backgroundColor: '#ff6600',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 6,
  },
  rceMButtonText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
    alignSelf: 'center',
    textTransform: 'uppercase',
  },

  rceMbox: {
    backgroundColor: 'white',
    borderRadius: 10,
    borderTopRightRadius: 0,
    marginLeft: 20,
    marginRight: 5,
    marginTop: 3,
    flexDirection: 'column',
    paddingTop: 7,
    paddingLeft: 9,
    paddingBottom: 16,
    paddingRight: 9,
    maxWidth: width - 50,
    alignSelf: 'flex-end',
    shadowColor: '#000',
    shadowOffset: {
      width: -5,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 10,
    marginBottom: 20,
  },

  rceMboxBody: {
    margin: 0,
    padding: 0,
    position: 'relative',
  },

  rceMboxRight: {
    alignSelf: 'flex-start',
    marginLeft: 5,
    marginRight: 20,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 0,
    shadowOffset: {
      width: 5,
      height: 5,
    },
  },

  rceMboxText: {
    fontSize: 13.6,
    marginBottom: 6,
  },

  rceMboxTime: {
    position: 'absolute',
    right: -4,
    bottom: -14,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
  },

  rceMboxTimeText: {
    textAlign: 'right',
    color: '#777',
    fontSize: 12,
  },

  rceMboxTimeBlock: {
    /*position: relative,*/
    right: 0,
    bottom: 0,
    left: 0,
    marginRight: -6,
    marginLeft: -6,
    paddingTop: 5,
    paddingRight: 3,
    paddingBottom: 2,
    // backgroundColor: linear-gradient(to top, rgba(0,0,0,0.33), transparent),
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },

  rceMboxClearPadding: {
    paddingBottom: 3,
  },

  rceMboxRceMboxClearNotch: {
    borderRadius: 5,
  },

  rceMboxTitle: {
    margin: 0,
    marginBottom: 8,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },

  rceMboxTitleAvatar: {
    display: 'flex',
    marginRight: 5,
  },

  rceMboxTitleText: {
    fontWeight: '500',
    fontSize: 13,
    color: '#4f81a1',
  },

  rceMboxTitleClear: {
    marginBottom: 5,
  },

  rceMboxStatus: {
    textAlign: 'right',
    marginLeft: 3,
    color: '#999',
  },

  rceMboxTitleRceAvatarContainer: {
    marginRight: 5,
  },
});
