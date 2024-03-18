import React, {
  FC,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import styles from './style';
import Avatar from './avatar';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Linking,
  Dimensions,
  useWindowDimensions,
} from 'react-native';
import type PropsMessageBoxComponent from 'src/types/propsMessageBoxComponent.js';
import Markdown from '../../plugin/markdown/index';
import { StyleContext } from '../../context/StyleContext';
import CarouselPage from './carousel';
import { checked } from '../../constant/ChatModalConstant';
import TypingMessage from './typingMessage';
import AudioMessage from './auidoMessage';
import CarouselMessage from './carouselMessage';
const MessageBox: FC<PropsMessageBoxComponent> = (props) => {
  const WebView = props.modules.RNWebView;

  const webViewRef = useRef<any>();
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const changeActiveSlide = (number: number) => setActiveSlide(number);
  const { appStyle } = useContext(StyleContext);
  var positionCls = [
    styles.rceMbox,
    props.position === 'right' && styles.rceMboxRight,
  ];
  var thatAbsoluteTime =
    props.type !== 'text' &&
    props.type !== 'file' &&
    !(
      props.type === 'location' &&
      (props.activity.text || props.activity.message)
    );

  const onPressButton = (value?: string, title?: string) => {
    props.sendMessage({ message: value, displayMessage: title });
    props.changeInputData('');
  };

  const [maxHeight, setmaxHeight] = useState(0);
  const totalFont = useWindowDimensions().fontScale;
  const screenWidth = Dimensions.get('screen').width * (1 / (totalFont * 10));

  const getTotals = (text: string) => {
    return Math.ceil(text.length / screenWidth) * 20 * totalFont;
  };

  const calculateHeight = useCallback(
    (props: any) => {
      const { title, subtitle, text, images, buttons } = props;
      const IMAGESIZE = images ? 300 : 0;
      const BUTTONSIZE = 50 * totalFont;
      const textLineHeights = text?.length > 0 ? getTotals(text) : 0;
      const titleHeight = title?.length > 0 ? getTotals(title) : 0;
      const subTitleHeight = subtitle?.length > 0 ? getTotals(subtitle) : 0;
      const buttonsHeight =
        buttons?.length > 0 ? buttons?.length * BUTTONSIZE : 0;
      const totalHeight =
        titleHeight +
        subTitleHeight +
        textLineHeights +
        buttonsHeight +
        IMAGESIZE +
        80;
      setmaxHeight((prev) => {
        if (totalHeight > prev) {
          return totalHeight;
        } else {
          return prev;
        }
      });
    },
    [cardList]
  );

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
          calculateHeight({
            title: attach?.content?.title,
            subtitle: attach?.content?.subtitle,
            text: attach?.content?.text,
            images: attach?.content?.images[0]?.url,
            buttons: attach?.content?.buttons,
          });
          if (attach?.content?.images[0]?.url) {
            setTimeout(function () {
              Image.getSize(
                attach?.content?.images[0]?.url,
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
          } else {
            setTimeout(function () {
              setCardList((prev: any) => [
                ...prev,
                {
                  key,
                  title: attach?.content?.title,
                  subtitle: attach?.content?.subtitle,
                  text: attach?.content?.text,
                  url: attach?.content?.images[0].url,
                  width: 0,
                  height: 0,
                  buttons: attach?.content?.buttons,
                },
              ]);
            }, key * 400);
          }
        });
      }
    }
  }, []);

  const getTimeGenerate = (props: any) => {
    const date = new Date(props?.timestamp);
    return `${date.getHours()}:${date.getMinutes()}`;
  };

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
              maxHeight: Dimensions.get('screen').height * 0.45,
              height: image.height,
              maxWidth: Dimensions.get('screen').width * 0.8,
              marginBottom: 10,
            }}
          />
        ))}
        {props.type === 'message' &&
          props.activity?.attachments &&
          props.activity?.attachments[0]?.content?.title && (
            <Markdown
              styles={styles.rceMboxText}
              color={
                props.position != 'right'
                  ? appStyle?.userMessageBoxTextColor
                  : appStyle?.chatBotMessageBoxTextColor
              }
            >
              {props.activity?.attachments[0]?.content?.title}
            </Markdown>
          )}
        {props.type === 'message' &&
          props.activity?.attachments &&
          props.activity?.attachments[0]?.content?.subtitle && (
            <Markdown
              styles={styles.rceMboxText}
              color={
                props.position != 'right'
                  ? appStyle?.userMessageBoxTextColor
                  : appStyle?.chatBotMessageBoxTextColor
              }
            >
              {props.activity?.attachments[0]?.content?.subtitle}
            </Markdown>
          )}
        {(props.type === 'text' || props.type === 'message') &&
          (props.activity.text || props.activity.message) && (
            <Markdown
              styles={styles.rceMboxText}
              color={
                props.position != 'right'
                  ? appStyle?.userMessageBoxTextColor
                  : appStyle?.chatBotMessageBoxTextColor
              }
            >
              {props.activity.text || props.activity.message}
            </Markdown>
          )}

        {props.activity?.type === 'message' &&
          props.activity?.attachments &&
          props.activity?.attachments[0]?.content?.text && (
            <Markdown
              style={styles.rceMboxText}
              color={
                props.position != 'right'
                  ? appStyle?.userMessageBoxTextColor
                  : appStyle?.chatBotMessageBoxTextColor
              }
            >
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
              <Markdown
                style={styles.rceMboxText}
                color={
                  props.position != 'right'
                    ? appStyle?.userMessageBoxTextColor
                    : appStyle?.chatBotMessageBoxTextColor
                }
              >
                {props.activity.entities[0]?.geo?.name}
              </Markdown>
              <Markdown
                style={styles.rceMboxText}
                color={
                  props.position != 'right'
                    ? appStyle?.userMessageBoxTextColor
                    : appStyle?.chatBotMessageBoxTextColor
                }
              >
                {props.activity.entities[0]?.address}
              </Markdown>
              <Markdown
                style={styles.rceMboxText}
                color={
                  props.position != 'right'
                    ? appStyle?.userMessageBoxTextColor
                    : appStyle?.chatBotMessageBoxTextColor
                }
              >
                {props.activity.entities[0]?.hasMap}
              </Markdown>
            </View>
          )}
      </>
    );
  };


  return (
    <View style={{ ...styles.rceContainerMbox }}>
      {props.type === 'system' ? null : (
        <View
          style={{
            // flexDirection: props.position === 'right' ? 'row' : undefined,
            flexDirection: 'column',
          }}
        >
          <View
            style={{
              flexDirection: props.position === 'right' ? 'row' : undefined,
              // backgroundColor:"red", margin:5
            }}
          >
            {props.position === 'right' && props.avatar && (
              <View style={styles.rceMboxTitleAvatar}>
                <Avatar width={28} height={28} src={props.avatar} />
              </View>
            )}
            <View style={[positionCls]}>
              {props.activity?.attachmentLayout === 'carousel' &&
                cardList.length > 1 && (
                  <CarouselMessage
                    cardList={cardList}
                    activeSlide={activeSlide}
                    changeActiveSlide={changeActiveSlide}
                    customizeProps = {props}
                    maxHeight={maxHeight}
                  />
                  // <CarouselPage data={cardList}/>
                )}
              <View
                style={[
                  styles.rceMboxBody,
                  {
                    backgroundColor:
                      props.position != 'right'
                        ? appStyle?.userMessageBoxBackground
                        : appStyle?.chatBotMessageBoxBackground,
                    minWidth: 100,
                    width:
                      props?.activity?.attachmentLayout === 'carousel'
                        ? Dimensions.get('screen').width * 0.8
                        : 'auto',
                    padding: 8,
                    borderRadius: 15,
                    display:
                      props.activity?.attachmentLayout === 'carousel'
                        ? 'none'
                        : undefined,
                  },
                ]}
              >
                {(props.title || props.avatar) && props.position !== 'left' && (
                  <View
                    style={[
                      styles.rceMboxTitle,
                      (props.type === 'text' || props.type === 'message') &&
                        styles.rceMboxTitleClear,
                    ]}
                  ></View>
                )}

                {props.activity?.attachmentLayout !== 'carousel' &&
                  renderItemMessage()}

                {(props.type === 'audio' ||
                  props.activity?.channelData?.AudioFromTts) && (
                  <AudioMessage
                    modules={props.modules}
                    customizeConfiguration={props.customizeConfiguration}
                    activity={props.activity}
                    userMessageBoxTextColor={props.userMessageBoxTextColor}
                  />
                )}

                {props.activity.type === 'typing' ? <TypingMessage /> : null}

                <View style={[thatAbsoluteTime && styles.rceMboxTimeBlock]}>
                  <Text
                    style={{
                      ...styles.rceMboxTimeText,
                      color:
                        props.position != 'right'
                          ? appStyle?.userMessageBoxTextColor
                          : appStyle?.chatBotMessageBoxTextColor,
                    }}
                  >
                    {(props.activity?.timestamp || props.dateString) &&
                      getTimeGenerate({ timestamp: props.activity.timestamp })}
                  </Text>
                </View>
              </View>
              {props.activity?.attachmentLayout !== 'carousel' &&
                Array.isArray(props.activity?.attachments) &&
                props.activity?.attachments[0] && (
                  <View
                    style={{
                      flexDirection: 'column',
                      justifyContent: 'center',
                      paddingTop: 10,
                    }}
                  >
                    {props.activity?.attachments[0]?.content?.buttons?.map(
                      (button: any, index: number) => (
                        <TouchableOpacity
                          key={index}
                          onPress={() =>
                            onPressButton(button?.value, button?.title)
                          }
                          style={{
                            padding: 5,
                            margin: 3,
                            paddingHorizontal: 10,
                            alignSelf: 'flex-start',
                            borderRadius: 8,
                            borderColor: appStyle.chatBotMessageBoxBackground,
                            borderWidth: 1.5,
                          }}
                        >
                          <Text
                            style={{ color: appStyle.userMessageBoxBackground }}
                          >
                            {button?.title}
                          </Text>
                        </TouchableOpacity>
                      )
                    )}
                  </View>
                )}
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
