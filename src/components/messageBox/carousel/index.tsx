import React, { useContext, useRef, useState } from 'react';
import { ScrollView, Text, View, TouchableOpacity, Image } from 'react-native';
import { StyleContext } from '../../../context/StyleContext';
import PropsCustomizeConfiguration from 'src/types/propsCustomizeConfiguration';
import Markdown from '../../../plugin/markdown';

const Index = ({
  data,
  onPressButton,
  customizeConfiguration,
}: {
  data: any;
  onPressButton: any;
  customizeConfiguration: PropsCustomizeConfiguration;
}) => {
  const CARD_WIDTH = 220;
  const MARGINLEFT = 10;
  const SNAP_INTERVAL = CARD_WIDTH + (MARGINLEFT - 4.8) * 2;
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const onScroll = (event: any) => {
    const newIndex = Math.round(
      event.nativeEvent.contentOffset.x / SNAP_INTERVAL
    );
    setCurrentIndex(newIndex);
  };

  const handleScrollLeft = () => {
    if (currentIndex > 0) {
      const newOffset = (currentIndex - 1) * SNAP_INTERVAL + MARGINLEFT - 62;
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ x: newOffset, animated: true });
      }
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleScrollRight = () => {
    if (currentIndex < data.length - 1) {
      const newOffset = (currentIndex + 1) * SNAP_INTERVAL - MARGINLEFT - 55;
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ x: newOffset, animated: true });
      }
      setCurrentIndex(currentIndex + 1);
    }
  };
  const { appStyle } = useContext(StyleContext);

  const carouselStyle = customizeConfiguration?.chatBotCarouselSettings;
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
          source={
            carouselStyle?.prevButtonIcon?.type === 'component'
              ? carouselStyle?.prevButtonIcon?.value ??
                require('../../../image/back.png')
              : carouselStyle?.prevButtonIcon?.value
              ? { uri: carouselStyle?.prevButtonIcon?.value }
              : require('../../../image/back.png')
          }
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
          source={
            carouselStyle?.nexButtonIcon?.type === 'component'
              ? carouselStyle?.nexButtonIcon?.value ??
                require('../../../image/next.png')
              : carouselStyle?.nexButtonIcon?.value
              ? { uri: carouselStyle?.nexButtonIcon?.value }
              : require('../../../image/next.png')
          }
          style={{ height: 14, width: 14, marginLeft: 3 }}
        />
      </TouchableOpacity>
      <ScrollView
        ref={scrollViewRef}
        horizontal={true}
        pagingEnabled={true}
        decelerationRate={0}
        scrollEventThrottle={16}
        snapToInterval={SNAP_INTERVAL}
        snapToAlignment="center"
        showsHorizontalScrollIndicator={false}
        style={{
          flexGrow: 0,
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
                paddingHorizontal: 12
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
              <Markdown
                fontSettings={appStyle?.fontSettings}
                color={appStyle?.chatBotMessageBoxTextColor}
                textType="title"
              >
                {item?.title && item.title.length > 46
                  ? item.title.substring(0, 43) + '...'
                  : item.title}
              </Markdown>
              <Markdown
              style={{opacity: 0.5}}
                fontSettings={appStyle?.fontSettings}
                color={appStyle?.chatBotMessageBoxTextColor}
                textType="text"
              >
               {item?.text && item.text.length > 70
                  ? item.subtitle.substring(0, 65) + '...'
                  : item.subtitle}
              </Markdown>
          
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
                        borderColor:
                          carouselStyle?.buttonGroup?.borderColor ?? '#E2E2E4',
                        borderRadius: 8,
                        borderWidth: 1.5,
                        padding: 10,
                        backgroundColor:
                          carouselStyle?.buttonGroup?.backgroundColor ??
                          'white',
                        marginBottom:
                          item?.buttons?.length - 1 === idx ? 15 : 0,
                      }}
                      key={idx}
                    >
                      <Text
                        style={{
                          color:
                            carouselStyle?.buttonGroup?.textColor ??
                            appStyle.chatBotMessageBoxButtonTextColor,
                            fontSize:appStyle?.fontSettings.descriptionFontSize
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
