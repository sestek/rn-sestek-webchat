import React, { useRef } from 'react';
import {
  View,
  Dimensions,
  Linking,
  Image,
  TouchableOpacity,
} from 'react-native';
import Markdown from '../../../plugin/markdown/index';
import styles from '../style';

interface Props {
  imageList: any[];
  appStyle: any;
  generalProps: any;
}
const GeneralMessage: React.FC<Props> = (props) => {
  const { imageList, appStyle, generalProps } = props;
  const webViewRef = useRef<any>();
  const WebView = generalProps.modules.RNWebView;

  const messageColor =
    generalProps?.position != 'right'
      ? appStyle?.userMessageBoxTextColor
      : appStyle?.chatBotMessageBoxTextColor;

  return (
    <>
      {imageList.map((image, index) => (
        <Image
          key={index}
          source={{ uri: image.url }}
          style={{
            resizeMode: 'contain',
            width: image.width,
            maxHeight: Dimensions.get('screen').height * 0.45,
            height: image.height,
            maxWidth: Dimensions.get('screen').width * 0.8,
            marginBottom: 10,
          }}
        />
      ))}
      {generalProps.type === 'message' &&
        generalProps.activity?.attachments &&
        generalProps.activity?.attachments[0]?.content?.title && (
          <Markdown
            color={messageColor}
            fontSettings={appStyle?.fontSettings}
            textType="title"
          >
            {generalProps.activity?.attachments[0]?.content?.title}
          </Markdown>
        )}
      {generalProps.type === 'message' &&
        generalProps.activity?.attachments &&
        generalProps.activity?.attachments[0]?.content?.subtitle && (
          <Markdown
            color={messageColor}
            fontSettings={appStyle?.fontSettings}
            textType="subtitle"
          >
            {generalProps.activity?.attachments[0]?.content?.subtitle}
          </Markdown>
        )}
      {(generalProps.type === 'text' || generalProps.type === 'message') &&
        (generalProps.activity.text || generalProps.activity.message) && (
          <Markdown
            color={messageColor}
            fontSettings={appStyle?.fontSettings}
            textType="text"
          >
            {generalProps.activity.text || generalProps.activity.message}
          </Markdown>
        )}

      {generalProps.activity?.type === 'message' &&
        generalProps.activity?.attachments &&
        generalProps.activity?.attachments[0]?.content?.text && (
          <Markdown
            color={messageColor}
            fontSettings={appStyle?.fontSettings}
            textType="text"
          >
            {generalProps.activity?.attachments[0]?.content?.text}
          </Markdown>
        )}
      {WebView &&
        Array.isArray(generalProps?.activity?.entities) &&
        generalProps?.activity?.entities[0]?.geo && (
          <View style={[styles.generalMessageBoxWebviewContainer]}>
            <TouchableOpacity
              style={styles.generalMessageBoxInWebviewInContainer}
              onPress={() => {
                Linking.openURL(
                  `https://maps.google.com/maps?q=${generalProps.activity.entities[0]?.geo.latitude},${generalProps.activity.entities[0]?.geo.longitude}&t=&z=15&ie=UTF8&iwloc`
                );
              }}
            >
              <WebView
                ref={webViewRef}
                scrollEnabled={false}
                onNavigationStateChange={(event: any) => {
                  const uri = 'https://www.google.com/maps/dir';
                  if (
                    webViewRef?.current?.stopLoading &&
                    event.url?.includes(uri)
                  ) {
                    webViewRef?.current?.stopLoading();
                  }
                }}
                source={{
                  html: `<iframe width="100%" height="100%" id="gmap_canvas" src="https://maps.google.com/maps?q=${generalProps.activity.entities[0]?.geo.latitude},${generalProps.activity.entities[0]?.geo.longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"></iframe>`,
                }}
              />
            </TouchableOpacity>

            <Markdown
              color={messageColor}
              fontSettings={appStyle?.fontSettings}
              textType="title"
            >
              {generalProps.activity.entities[0]?.geo?.name}
            </Markdown>
            <Markdown
              color={messageColor}
              fontSettings={appStyle?.fontSettings}
              textType="subtitle"
            >
              {generalProps.activity.entities[0]?.address}
            </Markdown>
            <Markdown
              color={messageColor}
              fontSettings={appStyle?.fontSettings}
              textType="text"
            >
              {generalProps.activity.entities[0]?.hasMap}
            </Markdown>
          </View>
        )}
    </>
  );
};

export default GeneralMessage;
