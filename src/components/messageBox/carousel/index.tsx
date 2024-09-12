import React, { useRef, useState } from 'react';
import { ScrollView, Text, View, TouchableOpacity, Image } from 'react-native';
import RenderImage from '../../renderImage';
import { useCustomizeConfiguration } from '../../../context/CustomizeContext';
import useRenderContent from '../../../hook/useRenderContent';

const Index = ({ data, onPressButton }: { data: any; onPressButton: any }) => {
  const CARD_WIDTH = 220;
  const MARGINLEFT = 10;
  const SNAP_INTERVAL = CARD_WIDTH + (MARGINLEFT - 4.8) * 2;
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { customizeConfiguration } = useCustomizeConfiguration();
  const [contentHeight, setContentHeight] = useState(0);
  const renderContent = (text: string, textType: string) =>
    useRenderContent(
      text,
      customizeConfiguration?.chatBotMessageBoxTextColor,
      customizeConfiguration?.fontSettings,
      textType
    );
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

  const carouselStyle = customizeConfiguration?.chatBotCarouselSettings;
  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        onPress={handleScrollLeft}
        style={{
          position: 'absolute',
          left: -40,
          top: contentHeight / 2 - 15,
          zIndex: 1,
          height: 30,
          width: 30,
          borderRadius: 16,
          backgroundColor: '#414141',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <RenderImage
          type={carouselStyle?.prevButtonIcon?.type}
          value={carouselStyle?.prevButtonIcon?.value}
          style={{ height: 14, width: 14 }}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleScrollRight}
        style={{
          position: 'absolute',
          right: 0,
          top: contentHeight / 2 - 15,
          zIndex: 1,
          height: 30,
          width: 30,
          borderRadius: 16,
          backgroundColor: '#414141',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <RenderImage
          type={carouselStyle?.nextButtonIcon?.type}
          value={carouselStyle?.nextButtonIcon?.value}
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
          const title =
            item?.title && item.title.length > 46
              ? item.title.substring(0, 43) + '...'
              : item.title;
          const subtitle =
            item?.text && item.text.length > 70
              ? item.subtitle.substring(0, 65) + '...'
              : item.subtitle;
          return (
            <View
              key={idx}
              onLayout={(event) => {
                const { height } = event.nativeEvent.layout;
                if (height > contentHeight) {
                  setContentHeight(height);
                }
              }}
              style={{
                marginLeft: idx !== 0 ? 10 : 0,
                backgroundColor: '#F5F5F5',
                borderRadius: 10,
                width: CARD_WIDTH,
                paddingHorizontal: 12,
              }}
            >
              {item?.url && (
                <View
                  style={{ alignItems: 'center', justifyContent: 'center' }}
                >
                  <Image
                    source={{ uri: item.url }}
                    style={{
                      width: '99%',
                      height: 170,
                      borderRadius: 5,
                      marginTop: 2,
                    }}
                    resizeMode="contain"
                  />
                </View>
              )}
              <View style={{paddingBottom: item.url ? 0 : 15, paddingTop: item.url? 0:15}}>
                {renderContent(title, 'title')}
                {renderContent(subtitle, 'subtitle')}
              </View>

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
                          carouselStyle?.buttonGroup?.borderColor ??
                          customizeConfiguration?.chatBotMessageBoxButtonBorderColor,
                        borderRadius: 8,
                        borderWidth: 1.5,
                        padding: 10,
                        backgroundColor:
                          carouselStyle?.buttonGroup?.backgroundColor ??
                          customizeConfiguration?.chatBotMessageBoxButtonBackground,
                        marginBottom:
                          item?.buttons?.length - 1 === idx ? 15 : 0,
                        maxHeight: 40,
                      }}
                      key={idx}
                    >
                      <Text
                        style={{
                          color:
                            carouselStyle?.buttonGroup?.textColor ??
                            customizeConfiguration?.chatBotMessageBoxButtonTextColor,
                          fontSize:
                            customizeConfiguration?.fontSettings
                              ?.descriptionFontSize,
                          fontWeight: '500',
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
