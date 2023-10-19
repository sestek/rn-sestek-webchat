import React, { FC, useEffect, useRef, useState } from 'react';
import styles from './style';
import Avatar from './avatar';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Linking,
  Dimensions,
} from 'react-native';
import type PropsMessageBoxComponent from 'src/types/propsMessageBoxComponent.js';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import AudioComponent from './audio';
import Markdown from '../../plugin/markdown/index';
import { Recorder } from '../../services';
import TypingAnimation from '../../plugin/typing';

const MessageBox: FC<PropsMessageBoxComponent> = (props) => {
  const { messageBoxColor, messageColor } = props.customizeConfiguration;

  const WebView = props.modules.RNWebView;

  const webViewRef = useRef<any>();
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const changeActiveSlide = (number: number) => setActiveSlide(number);

  const leftMessageBoxColorValue =
    props.customizeConfiguration.leftMessageBoxColor;
  var positionCls = [
    styles.rceMbox,
    props.position === 'right' && styles.rceMboxRight,
    messageColor
      ? {
          backgroundColor:
            props.position === 'right'
              ? messageColor
              : leftMessageBoxColorValue,
        }
      : {},
  ];
  var thatAbsoluteTime =
    props.type !== 'text' &&
    props.type !== 'file' &&
    !(
      props.type === 'location' &&
      (props.activity.text || props.activity.message)
    );

  const onPressButton = (text?: string) => {
    props.sendMessage(text);
    props.changeInputData('');
  };

  const [imageList, setImageList] = useState<any>([]);
  const [cardList, setCardList] = useState<any>([]);
  useEffect(() => {
    if (Array.isArray(props.activity?.attachments)) {
      if (props.activity?.attachments.length === 1) {
        props.activity?.attachments[0]?.content?.images?.map((image: any) => {
          Image.getSize(
            image.url,
            (width: number, height: number) => {
              setImageList((prev: any) => [
                ...prev,
                { url: image.url, width, height },
              ]);
            },
            (error) => {
              console.log(error);
            }
          );
        });
      }
      if (props.activity.attachments.length > 1) {
        props.activity.attachments.map((attach: any, key: number) => {
          setTimeout(function () {
            console.log(key);
            Image.getSize(
              attach?.content?.images[0].url,
              (width: number, height: number) => {
                setCardList((prev: any) => [
                  ...prev,
                  {
                    key,
                    title: attach?.content?.title,
                    subtitle: attach?.content?.subtitle,
                    text: attach?.content?.text,
                    url: attach?.content?.images[0].url,
                    width,
                    height,
                    buttons: attach?.content?.buttons,
                  },
                ]);
              },
              (error) => {
                console.log(error);
              }
            );
          }, key * 400);
        });
      }
    }
  }, []);

  const renderItemMessage = () => {
    return (
      <>
        {imageList.map((image: any, index: number) => (
          <Image
            key={index}
            source={{ uri: image.url }}
            style={{
              resizeMode: 'contain',
              width: image.width,
              height: image.height,
              maxWidth: Dimensions.get('screen').width * 0.8,
              marginBottom: 10,
            }}
          />
        ))}
        {props.type === 'message' &&
          props.activity?.attachments &&
          props.activity?.attachments[0]?.content?.title && (
            <Markdown styles={styles.rceMboxText}>
              {props.activity?.attachments[0]?.content?.title}
            </Markdown>
          )}
        {props.type === 'message' &&
          props.activity?.attachments &&
          props.activity?.attachments[0]?.content?.subtitle && (
            <Markdown styles={styles.rceMboxText}>
              {props.activity?.attachments[0]?.content?.subtitle}
            </Markdown>
          )}
        {(props.type === 'text' || props.type === 'message') &&
          (props.activity.text || props.activity.message) && (
            <Markdown styles={styles.rceMboxText}>
              {props.activity.text || props.activity.message}
            </Markdown>
          )}

        {props.activity?.type === 'message' &&
          props.activity?.attachments &&
          props.activity?.attachments[0]?.content?.text && (
            <Markdown style={styles.rceMboxText}>
              {props.activity?.attachments[0]?.content?.text}
            </Markdown>
          )}
        {WebView &&
          Array.isArray(props.activity.entities) &&
          props.activity.entities[0]?.geo && (
            <View
              style={{
                flex: 1,
                maxHeight: Dimensions.get('screen').height * 0.5,
              }}
            >
              <WebView
                ref={webViewRef}
                style={{ height: 300, width: 300 }}
                onNavigationStateChange={(event: any) => {
                  const uri = 'https://www.google.com/maps/dir';
                  if (
                    webViewRef?.current?.stopLoading &&
                    event.url?.includes(uri)
                  ) {
                    webViewRef?.current?.stopLoading();
                  }
                  Linking.openURL(event.url);
                }}
                source={{
                  html: `<iframe width="100%" height="100%" id="gmap_canvas" src="https://maps.google.com/maps?q=${props.activity.entities[0]?.geo.latitude},${props.activity.entities[0]?.geo.longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"></iframe>`,
                }}
              />
              <Markdown style={styles.rceMboxText}>
                {props.activity.entities[0]?.geo?.name}
              </Markdown>
              <Markdown style={styles.rceMboxText}>
                {props.activity.entities[0]?.address}
              </Markdown>
              <Markdown style={styles.rceMboxText}>
                {props.activity.entities[0]?.hasMap}
              </Markdown>
            </View>
          )}

        {Array.isArray(props.activity?.attachments) &&
          props.activity?.attachments &&
          props.activity?.attachments[0]?.content?.buttons?.map(
            (button: any, index: number) => (
              <TouchableOpacity
                key={index}
                onPress={() => onPressButton(button?.value || button?.title)}
                style={[
                  styles.rceMButton,
                  messageBoxColor ? { backgroundColor: messageBoxColor } : {},
                ]}
              >
                <Text style={styles.rceMButtonText}>{button?.title}</Text>
              </TouchableOpacity>
            )
          )}
      </>
    );
  };

  const renderItemCarousel = ({ item }: any) => {
    return (
      <View key={item.key} style={{ backgroundColor: 'white' }}>
        <Image
          source={{ uri: item.url }}
          style={{
            resizeMode: 'contain',
            width: '100%',
            height: 300,
            maxWidth: Dimensions.get('screen').width * 0.8,
            marginBottom: 10,
          }}
        />

        {item.title && (
          <Markdown styles={styles.rceMboxText}>{item.title}</Markdown>
        )}
        {item.subtitle && (
          <Markdown styles={styles.rceMboxText}>{item.subtitle}</Markdown>
        )}
        {item.text && (
          <Markdown styles={styles.rceMboxText}>{item.text}</Markdown>
        )}

        {item?.buttons?.map((button: any, index: number) => (
          <TouchableOpacity
            key={index}
            onPress={() => onPressButton(button?.value || button?.title)}
            style={[
              styles.rceMButton,
              messageBoxColor ? { backgroundColor: messageBoxColor } : {},
            ]}
          >
            <Text style={styles.rceMButtonText}>{button?.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderItemAudio = () => {
    if (!props.modules.AudioRecorderPlayer || !props.modules.RNFS) {
      return null;
    }

    let url = props.activity?.message;
    if (props.activity?.channelData?.AudioFromTts?.Data)
      url = props.activity.channelData.AudioFromTts.Data;
    return (
      <>
        <AudioComponent
          url={
            url && url.length > 1000
              ? 'file://' +
                new Recorder(
                  props.modules.AudioRecorderPlayer,
                  props.modules.RNFS,
                  props.modules.Record
                ).saveLocalFileAudio(url)
              : url
          }
          modules={props.modules}
          customizeConfiguration={props.customizeConfiguration}
        />
        <Text style={{ marginVertical: props.activity.text && 10 }}>
          {props.activity.text}
        </Text>
      </>
    );
  };

  const renderCarouselPagination = () => {
    return (
      <Pagination
        dotsLength={props.activity?.attachments?.length || 0}
        activeDotIndex={activeSlide}
        containerStyle={{ paddingBottom: 8, paddingTop: 8 }}
        dotStyle={{
          width: 8,
          height: 8,
          borderRadius: 5,
          marginHorizontal: 8,
          backgroundColor: 'black',
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.8}
      />
    );
  };

  const renderTyping = () => {
    return <TypingAnimation></TypingAnimation>;
  };
  return (
    <View style={styles.rceContainerMbox}>
      {props.type === 'system' ? null : (
        <View style={[positionCls]}>
          <View style={styles.rceMboxBody}>
            {(props.title || props.avatar) && (
              <View
                style={[
                  styles.rceMboxTitle,
                  (props.type === 'text' || props.type === 'message') &&
                    styles.rceMboxTitleClear,
                ]}
              >
                {props.avatar && (
                  <View style={styles.rceMboxTitleAvatar}>
                    <Avatar width={30} height={30} src={props.avatar} />
                  </View>
                )}
                <View>
                  {props.title && (
                    <Text
                      style={[
                        styles.rceMboxTitleText,
                        { color: props.titleColor || 'black' },
                      ]}
                    >
                      {props.title}
                    </Text>
                  )}
                </View>
              </View>
            )}

            {props.activity?.attachmentLayout === 'carousel' &&
              cardList.length > 1 && (
                <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                  <View style={{ flexDirection: 'row' }}>
                    <View>
                      <Carousel
                        layout="tinder"
                        data={cardList}
                        renderItem={renderItemCarousel}
                        sliderWidth={250}
                        itemWidth={250}
                        inactiveSlideOpacity={0}
                        onSnapToItem={(index) => changeActiveSlide(index)}
                      />
                      {renderCarouselPagination()}
                    </View>
                  </View>
                </View>
              )}

            {props.activity?.attachmentLayout !== 'carousel' &&
              renderItemMessage()}

            {(props.type === 'audio' ||
              props.activity?.channelData?.AudioFromTts) &&
              renderItemAudio()}

            {props.activity.type === 'typing' ? renderTyping() : null}

            <View style={[thatAbsoluteTime && styles.rceMboxTimeBlock]}>
              <Text style={styles.rceMboxTimeText}>
                {props.activity?.timestamp &&
                  (props.dateString ||
                    `${new Date(
                      props.activity?.timestamp
                    ).toLocaleDateString()} ${new Date(
                      props.activity?.timestamp
                    ).toLocaleTimeString()}`)}
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

MessageBox.defaultProps = {
  position: 'left',
  type: 'message',
  activity: null,
  title: 'SYSTEM',
  titleColor: 'black',
  date: new Date(),
  data: {},
  forwarded: false,
  dateString: '',
  notch: true,
  avatar: null,
  renderAddCmp: null,
};

const customComparator = (
  prevProps: PropsMessageBoxComponent,
  nextProps: PropsMessageBoxComponent
) => {
  return (
    JSON.stringify(nextProps.activity) === JSON.stringify(prevProps.activity)
  );
};

export default React.memo(MessageBox, customComparator);
