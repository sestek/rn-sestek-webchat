import React ,{
    useContext,
  }  from 'react';
import { View, Text, Dimensions,TouchableOpacity,Image } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { checked } from '../../../constant/ChatModalConstant';
import Markdown from '../../../plugin/markdown/index';
import styles from '../style';
import { StyleContext } from '../../../context/StyleContext';

interface MyComponentProps {
  cardList: any[];
  activeSlide: number;
  changeActiveSlide: (index: number) => void;
  customizeProps: any;
  maxHeight: number;
}

const CarouselMessage: React.FC<MyComponentProps> = ({
  cardList,
  activeSlide,
  changeActiveSlide,
  customizeProps,
  maxHeight
}) => {
    const { appStyle } = useContext(StyleContext);
    const onPressButton = (value?: string, title?: string) => {
        customizeProps.sendMessage({ message: value, displayMessage: title });
        customizeProps.changeInputData('');
      };
    const renderItemCarousel = ({ item }: any) => {
        // ! background props ile aynı olmalı
    
        return (
          <View
            key={item.key}
            style={{
              backgroundColor:
              customizeProps?.customizeConfiguration?.chatBotMessageBoxBackground,
              height: maxHeight,
              flexDirection: 'column',
              width: '100%',
              borderTopWidth: 1,
              borderRightWidth: 1,
              borderRightColor: '#00000022',
              borderTopColor: '#00000022',
              borderBottomWidth: 1,
              borderBottomColor: '#00000022',
              paddingRight: 15,
              borderRadius: 10,
              borderLeftWidth: 1,
              paddingLeft: 15,
              borderLeftColor: '#00000022', 
            }}
          >
            {!checked.includes(item?.url) && (
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
            )}
    
            {!checked.includes(item?.title) && (
              <Markdown
                styles={styles.generalMessageBoxText}
                color={
                    customizeProps.position != 'right'
                    ? appStyle?.userMessageBoxTextColor
                    : appStyle?.chatBotMessageBoxTextColor
                }
              >
                {item.title}
              </Markdown>
            )}
            {!checked.includes(item?.subtitle) && (
              <Markdown
                styles={styles.generalMessageBoxText}
                color={
                    customizeProps.position != 'right'
                    ? appStyle?.userMessageBoxTextColor
                    : appStyle?.chatBotMessageBoxTextColor
                }
              >
                {item.subtitle}
              </Markdown>
            )}
            {!checked.includes(item?.text) && (
              <Markdown
                styles={styles.generalMessageBoxText}
                color={
                    customizeProps.position != 'right'
                    ? appStyle?.userMessageBoxTextColor
                    : appStyle?.chatBotMessageBoxTextColor
                }
              >
                {item.text}
              </Markdown>
            )}
            {!checked.includes(item?.buttons) &&
              item?.buttons?.map((button: any, index: number) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => onPressButton(button?.value, button?.title)}
                  style={[
                    styles.generalMessageBoxButton,
                    appStyle?.chatBotMessageBoxButtonBackground
                      ? {
                          backgroundColor:
                            appStyle?.chatBotMessageBoxButtonBackground,
                        }
                      : {},
                    {
                      borderWidth: 1,
                      borderColor: appStyle?.chatBotMessageBoxButtonBorderColor,
                    },
                  ]}
                >
                  <Text
                    style={{
                      ...styles.generalMessageBoxButtonText,
                      color: appStyle?.chatBotMessageBoxButtonTextColor,
                    }}
                  >
                    {button?.title}
                  </Text>
                </TouchableOpacity>
              ))}
          </View>
        );
      };
    
  return (
    <View style={{ flexDirection: 'column',alignItems:"flex-start" }}>
      {/* <View style={{ flexDirection: 'row', width: '100%' }}> */}
        <View style={{ width: '100%' ,backgroundColor:"yellow",  }}>
          <Carousel
            layout="stack"
            data={cardList}
            renderItem={renderItemCarousel}
            sliderWidth={Dimensions.get('screen').width * 0.8}
            itemWidth={Dimensions.get('screen').width * 0.7}
            inactiveSlideOpacity={0}
            onSnapToItem={(index) => changeActiveSlide(index)}
          />
          <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
            <View
              style={{
                width: 45,
                height: 25,
                backgroundColor: '#0000001c',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 12,
              }}
            >
              <Text style={{ fontSize: 10, color: 'black' }}>
                {activeSlide + 1} / {cardList?.length}
              </Text>
            </View>
          </View>
        </View>
      {/* </View> */}
    </View>
  );
};

export default CarouselMessage;
