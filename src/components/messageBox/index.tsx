import React, { FC, useCallback, useContext, useEffect, useState } from 'react';

import {
  View,
  Text,
  Image,
  Dimensions,
  useWindowDimensions,
} from 'react-native';
import type PropsMessageBoxComponent from 'src/types/propsMessageBoxComponent.js';
// import CarouselPage from './carousel';
import TypingMessage from './typingMessage';
import AudioMessage from './auidoMessage';
import GeneralMessage from './generalMessage';
import OutsideButton from './outsideButtonMessageBox';
import Avatar from './avatar';
import { StyleContext } from '../../context/StyleContext';
import styles from './style';
import CarouselPage from './carousel';

const MessageBox: FC<PropsMessageBoxComponent> = (props) => {
  const messageType = props.type ? props.type : '';
  const messageBoxPosition = props.position === 'right' ? 'right' : 'left';
  const attachmentsData = props?.activity?.attachments;
  const carouselType =
    props?.activity?.attachmentLayout === 'carousel' ? true : false;

  const [imageList, setImageList] = useState<any>([]);
  const [cardList, setCardList] = useState<any>([]);

  const { appStyle } = useContext(StyleContext);
  var positionCls = [
    styles.messageBox,
    messageBoxPosition === 'right' && styles.messageBoxRight,
    {
      marginBottom: props?.customizeConfiguration?.chatBodyMessageBoxGap ?? 20,
    },
  ];

  const onPressButton = (value?: string, title?: string) => {
    props.sendMessage({ message: value, displayMessage: title });
    props.changeInputData('');
  };

  const [_, setmaxHeight] = useState(0);
  const totalFont = useWindowDimensions().fontScale;
  const screenWidth = Dimensions.get('screen').width * (1 / (totalFont * 10));

  const getTotals = (text: string) => {
    return Math.ceil(text.length / screenWidth) * 20 * totalFont;
  };

  var audioMesType = '';

  if (props?.activity?.attachments && props?.activity?.attachments[0]) {
    audioMesType = props?.activity?.attachments[0].contentType;
  }

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

  useEffect(() => {
    if (Array.isArray(attachmentsData)) {
      if (attachmentsData.length === 1) {
        
        attachmentsData[0]?.content?.images?.map((image: any) => {
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
      if (attachmentsData.length > 1) {
        attachmentsData.map((attach: any, key: number) => {
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
  }, [attachmentsData]);

  const getTimeGenerate = (props: any) => {
    const date = new Date(props?.timestamp);
    return `${date.getHours()}:${
      date.getMinutes() < 10 ? '0' : ''
    }${date.getMinutes()}`;
  };

  return (
    <View style={{ ...styles.messageBoxContainer }}>
      {messageType === 'system' ? null : (
        <View style={{ ...styles.messageBoxInContainer }}>
          <View
            style={{
              flexDirection: messageBoxPosition === 'right' ? 'row' : undefined,
            }}
          >
            {messageBoxPosition === 'right' && (
              <View style={styles.messageBoxAvatarContainer}>
                <Avatar
                  width={
                    props.customizeConfiguration.chatBotMessageBoxAvatarIconSize
                  }
                  height={
                    props.customizeConfiguration.chatBotMessageBoxAvatarIconSize
                  }
                  chatBotMessageIcon={
                    props.customizeConfiguration.chatBotMessageIcon
                  }
                />
              </View>
            )}
            <View style={[positionCls]}>
              {carouselType && cardList.length > 1 && (
                <CarouselPage
                  data={cardList}
                  onPressButton={onPressButton}
                  customizeConfiguration={props.customizeConfiguration}
                />
              )}
              <View
                style={[
                  styles.messageBoxBody,
                  {
                    backgroundColor:
                      messageBoxPosition != 'right'
                        ? appStyle?.userMessageBoxBackground
                        : appStyle?.chatBotMessageBoxBackground,
                    width: carouselType
                      ? Dimensions.get('screen').width * 0.8
                      : 'auto',
                    display: carouselType ? 'none' : undefined,
                  },
                ]}
              >
                {!carouselType && (
                  <GeneralMessage
                    imageList={imageList}
                    appStyle={appStyle}
                    generalProps={props}
                  />
                )}
                {(messageType === 'audio' ||
                  audioMesType === 'audio/base64') && (
                  <AudioMessage
                    modules={props.modules}
                    customizeConfiguration={props.customizeConfiguration}
                    activity={props.activity}
                    userMessageBoxTextColor={props.userMessageBoxTextColor}
                    inlineText={true}
                  />
                )}

                {props.activity.type === 'typing' ? <TypingMessage /> : null}

                <View style={styles.messageBoxTimeBlock}>
                  <Text
                    style={{
                      ...styles.messageBoxTimeBlockText,
                      color:
                        messageBoxPosition != 'right'
                          ? appStyle?.userMessageBoxTextColor
                          : appStyle?.chatBotMessageBoxTextColor,
                      fontSize: appStyle?.fontSettings?.descriptionFontSize,
                    }}
                  >
                    {(props.activity?.timestamp || props.dateString) &&
                      getTimeGenerate({ timestamp: props.activity.timestamp })}
                  </Text>
                </View>
              </View>
              {!carouselType &&
                Array.isArray(attachmentsData) &&
                attachmentsData[0] && (
                  <OutsideButton
                    attachmentsData={attachmentsData}
                    onPressButton={onPressButton}
                    appStyle={appStyle}
                  />
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
