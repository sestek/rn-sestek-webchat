import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  infoIconTouch: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  infoBadge: {
    position: 'absolute',
    top: -1, 
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#bd1717',
  },
  headerContainer: {
    width: '100%',
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },

  headerTextContainer: {
    flexShrink: 1,
  },

  headerTextLeft: {
    flexGrow: 1,
    alignItems: 'flex-start',
  },
  headerTextCenter: {
    flexGrow: 1,
    alignItems: 'center',
  },
  headerTextRight: {
    flexGrow: 1,
    alignItems: 'flex-end',
  },

  iconsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 16, 
  },

  iconTouch: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4, 
  },

  imageIcon: {
    width: 18,
    maxWidth: 18,
    maxHeight: 18,
    height: 18,
  },

  titleWrap: {
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleWrapReverse: {
    flexDirection: 'row-reverse',
  },

  infoIconTouchReverse: {
    marginLeft: 6,
    marginRight: 0,
  },

  infoIcon: { width: 16, height: 16 },
});

export { styles };
