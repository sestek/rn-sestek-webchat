import React, { useRef } from 'react';
import {
  View,
  Dimensions,
  Linking,
  Image,
  TouchableOpacity,
} from 'react-native';
import styles from '../style';
import { useCustomizeConfiguration } from '../../../context/CustomizeContext';
import { useModules } from '../../../context/ModulesContext';
import useRenderContent from '../../../hook/useRenderContent';
interface Props {
  imageList: any[];
  generalProps: any;
}
const GeneralMessage: React.FC<Props> = (props) => {
  const { imageList, generalProps } = props;
  const webViewRef = useRef<any>();
  const { customizeConfiguration } = useCustomizeConfiguration();
  const { modules } = useModules();
  const WebView = modules?.RNWebView;
  const messageColor =
    generalProps?.position !== 'right'
      ? customizeConfiguration?.userMessageBoxTextColor
      : customizeConfiguration?.chatBotMessageBoxTextColor;
  const aspectRatioCorrection = 1.5;

  const messageType = generalProps?.type;
  const messageActivity = generalProps?.activity;
  const messageAttachments = messageActivity?.attachments;
  const messageAttachmentsContent = messageAttachments?.[0]?.content;
  const messageActivityEntities = messageActivity?.entities?.[0];

  const renderContent = (text: string, textType: string) =>
    useRenderContent(
      text,
      messageColor,
      customizeConfiguration?.fontSettings,
      textType,
      WebView
    );
  return (
    <>
      {imageList.map((image, index) => (
        <Image
          key={index}
          source={{ uri: image.url }}
          style={{
            resizeMode: 'contain',
            width:
              ((Dimensions.get('screen').width * 0.45 * image.width) /
                image.width) *
              aspectRatioCorrection,
            height:
              ((Dimensions.get('screen').width * 0.45 * image.height) /
                image.width) *
              aspectRatioCorrection,
            marginHorizontal: 8,
            marginVertical: 8,
          }}
        />
      ))}

      {messageType === 'message' &&
        messageAttachmentsContent?.title &&
        renderContent(messageAttachmentsContent?.title, 'title')}

      {messageType === 'message' &&
        messageAttachmentsContent?.subtitle &&
        renderContent(messageAttachmentsContent?.subtitle, 'subtitle')}

      {(messageType === 'text' || messageType === 'message') &&
        (messageActivity?.text || messageActivity?.message) &&
        renderContent(
          messageActivity?.text || messageActivity?.message,
          'text'
        )}

      {messageType === 'message' &&
        messageAttachmentsContent?.text &&
        renderContent(messageAttachmentsContent?.text, 'text')}

      {WebView &&
        Array.isArray(messageActivity?.entities) &&
        messageActivityEntities?.geo && (
          <View style={styles.generalMessageBoxWebviewContainer}>
            <TouchableOpacity
              style={styles.generalMessageBoxInWebviewInContainer}
              onPress={() => {
                Linking.openURL(
                  `https://maps.google.com/maps?q=${messageActivityEntities.geo.latitude},${messageActivityEntities.geo.longitude}&t=&z=15&ie=UTF8&iwloc`
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
                    webViewRef.current.stopLoading();
                  }
                }}
                source={{
                  html: `<iframe width="100%" height="100%" id="gmap_canvas" src="https://maps.google.com/maps?q=${messageActivityEntities.geo.latitude},${messageActivityEntities.geo.longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"></iframe>`,
                }}
              />
            </TouchableOpacity>

            {renderContent(messageActivityEntities?.geo?.name, 'title')}
            {renderContent(messageActivityEntities?.address, 'subtitle')}
            {renderContent(messageActivityEntities?.hasMap, 'text')}
          </View>
        )}
    </>
  );
};

export default GeneralMessage;
