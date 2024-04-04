import React, { useContext, useRef, useState } from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { StyleContext } from '../../../context/StyleContext';

const Index = ({ data, onPressButton }: { data: any; onPressButton: any }) => {
  const CARD_WIDTH = 220;
  const MARGINLEFT = 10;
  const SNAP_INTERVAL = CARD_WIDTH + (MARGINLEFT - 4.8) * 2;
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const onScroll = (event) => {
    const newIndex = Math.round(
      event.nativeEvent.contentOffset.x / SNAP_INTERVAL
    );
    console.log(event.nativeEvent.contentOffset.x);
    setCurrentIndex(newIndex);
  };

  const handleScrollLeft = () => {
    // az
    if (currentIndex > 0) {
      const newOffset = (currentIndex - 1) * SNAP_INTERVAL + MARGINLEFT - 62;
      scrollViewRef.current.scrollTo({ x: newOffset, animated: true });
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleScrollRight = () => {
    // falza
    if (currentIndex < data.length - 1) {
      const newOffset = (currentIndex + 1) * SNAP_INTERVAL - MARGINLEFT - 55;
      scrollViewRef.current.scrollTo({ x: newOffset, animated: true });
      setCurrentIndex(currentIndex + 1);
    }
  };
  const { appStyle } = useContext(StyleContext);
  // sağ sol icon ve arka plan
  // carousel buton border buton text color buton background
  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        onPress={handleScrollLeft}
        style={{
          position: 'absolute',
          left: -40,
          top: 150,
          zIndex: 1,
          height: 30,
          width: 30,
          borderRadius: 16,
          backgroundColor: '#414141',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Image
          source={require('../../../image/back.png')}
          style={{ height: 14, width: 14, marginRight: 3 }}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleScrollRight}
        style={{
          position: 'absolute',
          right: 0,
          top: 150,
          zIndex: 1,
          height: 30,
          width: 30,
          borderRadius: 16,
          backgroundColor: '#414141',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Image
          source={require('../../../image/next.png')}
          style={{ height: 14, width: 14, marginLeft: 3 }}
        />
      </TouchableOpacity>
      <ScrollView
        ref={scrollViewRef}
        horizontal={true}
        pagingEnabled={true}
        decelerationRate={0}
        snapToInterval={SNAP_INTERVAL}
        snapToAlignment="center"
        showsHorizontalScrollIndicator={false}
        style={{
          flexGrow: 0,
          marginTop: 16,
        }}
        onScroll={onScroll}
      >
        {data.map((item: any, idx: number) => {
          return (
            <View
              key={idx}
              style={{
                marginLeft: idx !== 0 ? 10 : 0,
                backgroundColor: '#F5F5F5',
                borderRadius: 10,
                width: CARD_WIDTH,
                marginBottom: 8,
              }}
            >
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Image
                  source={{ uri: item.url }}
                  style={{
                    width: '90%',
                    height: 170,
                    borderRadius: 5,
                    marginTop: 10,
                  }}
                />
              </View>
              <Text
                style={{
                  paddingHorizontal: 12,
                  marginTop: 10,
                  fontSize: 16,
                  fontWeight: '500',
                  color: '#000000',
                }}
              >
                {item?.title && item.title.length > 46
                  ? item.title.substring(0, 43) + '...'
                  : item.title}
              </Text>
              <Text
                style={{
                  paddingHorizontal: 12,
                  marginTop: 8,
                  fontSize: 14,
                  fontWeight: '400',
                  color: '#00000088',
                  opacity: 0.5,
                }}
              >
                {/* {item?.subtitle && item.subtitle.length > 70
                  ? item.subtitle.substring(0, 65) + '...'
                  : item.subtitle} */}
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam
                eum reprehenderit saepe, neque tenetur
              </Text>
              {item?.buttons &&
                item.buttons.map((btn: any, idx: number) => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        onPressButton(btn?.value, btn?.title);
                      }}
                      style={{
                        marginTop: 10,
                        marginHorizontal: 12,
                        flex: 1,
                        // borderColor:
                        //   appStyle.chatBotMessageBoxButtonBorderColor,
                        borderColor: '#E2E2E4',
                        borderRadius: 8,
                        borderWidth: 1.5,
                        padding: 10,
                        backgroundColor: 'white',
                        marginBottom:
                          item?.buttons?.length - 1 === idx ? 15 : 0,
                      }}
                    >
                      <Text
                        style={{
                          color: appStyle.chatBotMessageBoxButtonTextColor,
                        }}
                      >
                        {btn?.title}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default Index;
