import { Dimensions, StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
  heading1: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  heading2: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 8,
  },
  heading3: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 6,
  },
  heading4: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
    marginTop: 14,
    marginBottom: 4,
  },
  heading5: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 2,
  },
  heading6: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 2,
  },

  autolink: {
    color: 'blue',
    fontWeight: 'bold',
  },
  blockQuoteText: {
    color: 'grey',
  },
  blockQuoteSection: {
    flexDirection: 'row',
  },
  blockQuoteSectionBar: {
    width: 3,
    height: undefined,
    backgroundColor: '#DDDDDD',
    marginRight: 15,
  },
  bgImage: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bgImageView: {
    flex: 1,
    overflow: 'hidden',
  },
  view: {
    alignSelf: 'stretch',
  },
  codeBlock: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'Monospace',
    fontWeight: '500',
    backgroundColor: '#DDDDDD',
  },
  del: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },
  em: {
    fontStyle: 'italic',
  },

  hr: {
    backgroundColor: '#cccccc',
    height: 1,
    marginVertical: 12,
  },
  image: {
    height: 200, // Image maximum height
    width: Dimensions.get('window').width - 30, // Width based on the window width
    alignSelf: 'center',
    resizeMode: 'contain', // The image will scale uniformly (maintaining aspect ratio)
  },
  imageBox: {
    flex: 1,
    resizeMode: 'cover',
  },
  inlineCode: {
    backgroundColor: '#eeeeee',
    borderColor: '#dddddd',
    borderRadius: 3,
    borderWidth: 1,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'Monospace',
    fontWeight: 'bold',
  },
  list: { marginVertical: 4 },
  sublist: {
    paddingLeft: 20,
    width: Dimensions.get('window').width - 60,
  },
  listItemBullet: {
    width: 18,
    textAlign: 'center',
    fontSize: 18,
    lineHeight: 22,
    color: '#1a1a1a',
  },
  listItem: {
    
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 2,
  },
  listItemText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
    color: '#1a1a1a',
  },

  listItemNumber: {
    fontWeight: 'bold',
  },
  listRow: {
    flexDirection: 'row',
  },
  paragraph: {
    marginTop: 10,
    marginBottom: 10,
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  paragraphCenter: {
    marginTop: 10,
    marginBottom: 10,
    flexWrap: 'wrap',
    flexDirection: 'row',
    // textAlign: 'center',
    alignItems: 'flex-start',
    // justifyContent: 'center',
  },
  paragraphWithImage: {
    marginTop: 10,
    marginBottom: 10,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  noMargin: {
    marginTop: 0,
    marginBottom: 0,
  },
  strong: {
    fontWeight: 'bold',
  },
  table: {
    borderWidth: 1,
    borderColor: '#222222',
    borderRadius: 3,
  },
  tableHeader: {
    backgroundColor: '#e2e2de',
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderColor: 'black',
  },
  tableHeaderCell: {
    color: '#ffffff',
    fontWeight: 'bold',
    padding: 5,
  },
  tableRow: {
    //borderBottomWidth: 1,
    borderColor: '#222222',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  tableRowLast: {
    borderColor: 'transparent',
  },
  tableRowCell: {
    padding: 5,
  },
  text: {
    color: '#222222',
  },
  textRow: {
    flexDirection: 'row',
  },
  u: {
    borderColor: '#222222',
    borderBottomWidth: 1,
  },
});
