import React, { FC, useCallback, useEffect, useState } from 'react';

import {
  View,
  Text,
  Image,
  Dimensions,
  useWindowDimensions,
} from 'react-native';
import type PropsMessageBoxComponent from 'src/types/propsMessageBoxComponent.js';
import TypingMessage from './typingMessage';
import AudioMessage from './auidoMessage';
import GeneralMessage from './generalMessage';
import OutsideButton from './outsideButtonMessageBox';
import Avatar from './avatar';
import styles from './style';
import CarouselPage from './carousel';
import { useCustomizeConfiguration } from '../../context/CustomizeContext';
import { specialMessageTypes } from '../../constant/ChatModalConstant';
import FileMessages from './fileMessage';

const MessageBox: FC<PropsMessageBoxComponent> = (props) => {
  const messageType = props.type ? props.type : '';
  const messageBoxPosition = props.position === 'right' ? 'right' : 'left';
  const attachmentsData = props?.activity?.attachments;
  const carouselType =
    props?.activity?.attachmentLayout === 'carousel' ? true : false;

  const [imageList, setImageList] = useState<any>([]);
  const [cardList, setCardList] = useState<any>([]);

  const { customizeConfiguration } = useCustomizeConfiguration();

  const {
    chatBodyMessageBoxGap,
    chatBotMessageBoxBackground,
    chatBotMessageBoxTextColor,
    userMessageBoxBackground,
    userMessageBoxTextColor,
  } = customizeConfiguration;

  var positionCls = [
    styles.messageBox,
    messageBoxPosition === 'right' && styles.messageBoxRight,
    {
      marginBottom: chatBodyMessageBoxGap ?? 20,
    },
  ];

  const disablePreviousButtons =
    props.defaultConfiguration?.disablePreviousButtons !== false;

  const [clicked, setClicked] = useState(false);
  const buttonsDisabled =
    disablePreviousButtons && (props.isLastMessage === false || clicked);

  const onPressButton = (value?: string, title?: string) => {
    if (buttonsDisabled) {
      return;
    }
    if (disablePreviousButtons) {
      setClicked(true);
    }
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
    if (!Array.isArray(attachmentsData)) {
      return;
    }

    let cancelled = false;
    const timers: any[] = [];
    setImageList([]);
    setCardList([]);

    if (attachmentsData.length === 1) {
      attachmentsData[0]?.content?.images?.forEach((image: any) => {
        Image.getSize(
          image.url,
          (width: number, height: number) => {
            if (cancelled) return;
            setImageList((prev: any) => [
              ...prev,
              { url: image.url, width, height },
            ]);
          },
          (error) => {
            console.warn('image size could not be read', error);
          }
        );
      });
    }

    if (attachmentsData.length > 1) {
      attachmentsData.forEach((attach: any, key: number) => {
        calculateHeight({
          title: attach?.content?.title,
          subtitle: attach?.content?.subtitle,
          text: attach?.content?.text,
          images: attach?.content?.images?.[0]?.url,
          buttons: attach?.content?.buttons,
        });

        const imageUrl = attach?.content?.images?.[0]?.url;
        const card = {
          key,
          title: attach?.content?.title,
          subtitle: attach?.content?.subtitle,
          text: attach?.content?.text,
          url: imageUrl,
          buttons: attach?.content?.buttons,
        };

        timers.push(
          setTimeout(() => {
            if (cancelled) return;
            if (!imageUrl) {
              setCardList((prev: any) => [
                ...prev,
                { ...card, width: 0, height: 0 },
              ]);
              return;
            }
            Image.getSize(
              imageUrl,
              (width: number, height: number) => {
                if (cancelled) return;
                setCardList((prev: any) => [...prev, { ...card, width, height }]);
              },
              (error) => {
                console.warn('image size could not be read', error);
              }
            );
          }, key * 400)
        );
      });
    }

    return () => {
      cancelled = true;
      timers.forEach((t) => clearTimeout(t));
    };
  }, [attachmentsData]);

  const getTimeGenerate = (props: any) => {
    const date = new Date(props?.timestamp);
    return `${date.getHours()}:${
      date.getMinutes() < 10 ? '0' : ''
    }${date.getMinutes()}`;
  };

  const isSpecialMessageType = (type: string) => {
    return specialMessageTypes.includes(type);
  };
  const renderEndOfConversation = () => {
    if (!props?.activity?.text) {
      return null;
    }

    return (
      <View
        style={{
          ...styles.endOfConversationContainer,
          backgroundColor: chatBotMessageBoxBackground,
        }}
      >
        <Text
          style={{
            ...styles.endOfConversationText,
            color: chatBotMessageBoxTextColor,
          }}
        >
          {props?.activity?.text}
        </Text>
      </View>
    );
  };
  return (
    <View style={{ ...styles.messageBoxContainer }}>
      {messageType === 'system' ? null : isSpecialMessageType(messageType) ? (
        renderEndOfConversation()
      ) : (
        <View
          style={{
            ...styles.messageBoxInContainer,
            flexDirection:
              messageBoxPosition === 'right' ? 'row' : 'row-reverse',
          }}
        >
          <Avatar position={messageBoxPosition} />
          <View style={[positionCls]}>
            {carouselType && cardList.length > 1 && (
              <CarouselPage
                data={cardList}
                onPressButton={onPressButton}
                disabled={buttonsDisabled}
              />
            )}
            <View
              style={[
                styles.messageBoxBody,
                {
                  backgroundColor:
                    messageBoxPosition != 'right'
                      ? userMessageBoxBackground
                      : chatBotMessageBoxBackground,
                  width: carouselType
                    ? Dimensions.get('screen').width * 0.8
                    : 'auto',
                  display: carouselType ? 'none' : undefined,
                },
              ]}
            >
              {!carouselType && (
                <GeneralMessage imageList={imageList} generalProps={props} />
              )}
              {(messageType === 'audio' || audioMesType === 'audio/base64') && (
                <AudioMessage
                  key={props.activity.id}
                  activity={props.activity}
                  userMessageBoxTextColor={props.userMessageBoxTextColor}
                  inlineText={true}
                />
              )}
              {audioMesType === 'file/minio' && (
                <FileMessages
                  url={props.url}
                  activity={props.activity}
                  defaultConfiguration={props.defaultConfiguration}
                />
              )}

              {props.activity.type === 'typing' ? <TypingMessage /> : null}

              <View style={styles.messageBoxTimeBlock}>
                <Text
                  style={{
                    ...styles.messageBoxTimeBlockText,
                    color:
                      messageBoxPosition != 'right'
                        ? userMessageBoxTextColor
                        : chatBotMessageBoxTextColor,
                    fontSize:
                      customizeConfiguration?.fontSettings?.descriptionFontSize,
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
                  disabled={buttonsDisabled}
                />
              )}
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
  date: new Date(),
  data: {},
  forwarded: false,
  dateString: '',
  notch: true,
  renderAddCmp: null,
};

const ACTIVITY_KEYS = [
  'id',
  'type',
  'text',
  'message',
  'displayOverride',
  'channel',
  'attachmentLayout',
  'local',
];

const sameTimestamp = (a: any, b: any) => {
  const ta = a instanceof Date ? a.getTime() : a;
  const tb = b instanceof Date ? b.getTime() : b;
  return ta === tb;
};

const sameButtons = (a: any, b: any) => {
  if (a === b) return true;
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i]?.title !== b[i]?.title || a[i]?.value !== b[i]?.value) {
      return false;
    }
  }
  return true;
};

const sameContent = (a: any, b: any) => {
  if (a === b) return true;
  if (typeof a === 'string' || typeof b === 'string') {
    return a === b;
  }
  if (!a || !b) return false;
  if (a.title !== b.title || a.subtitle !== b.subtitle || a.text !== b.text) {
    return false;
  }
  const ia = a.images;
  const ib = b.images;
  if (ia !== ib) {
    if (!Array.isArray(ia) || !Array.isArray(ib) || ia.length !== ib.length) {
      return false;
    }
    for (let i = 0; i < ia.length; i++) {
      if (ia[i]?.url !== ib[i]?.url) return false;
    }
  }
  return sameButtons(a.buttons, b.buttons);
};

const sameAttachments = (a: any, b: any) => {
  if (a === b) return true;
  if (!Array.isArray(a) || !Array.isArray(b)) return false;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    const x = a[i];
    const y = b[i];
    if (x === y) continue;
    if (!x || !y) return false;
    if (
      x.contentType !== y.contentType ||
      x.message !== y.message ||
      x.name !== y.name ||
      x.messageType !== y.messageType
    ) {
      return false;
    }
    if (!sameContent(x.content, y.content)) return false;
  }
  return true;
};

const sameActivity = (a: any, b: any) => {
  if (a === b) return true;
  if (!a || !b) return false;
  for (let i = 0; i < ACTIVITY_KEYS.length; i++) {
    const key = ACTIVITY_KEYS[i]!;
    if (a[key] !== b[key]) return false;
  }
  if (!sameTimestamp(a.timestamp, b.timestamp)) return false;
  return sameAttachments(a.attachments, b.attachments);
};

const customComparator = (
  prevProps: PropsMessageBoxComponent,
  nextProps: PropsMessageBoxComponent
) => {
  return (
    sameActivity(prevProps.activity, nextProps.activity) &&
    nextProps.isLastMessage === prevProps.isLastMessage
  );
};

export default React.memo(MessageBox, customComparator);
