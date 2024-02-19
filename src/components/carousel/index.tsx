import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
interface CarouselItem {
  key: number;
  title: string;
  subtitle?: string;
  text: string;
  url: any;
}

const MAX_TEXT_LENGTH = 100;

interface CarouselProps {
  data: CarouselItem[];
}

const CarouselPage: React.FC<CarouselProps> = ({ data }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const windowWidth = Dimensions.get('window').width * 0.65;
  const containerWidth= windowWidth - 20
  const imageWidth= containerWidth -15
  const padding =0;
  const scrollToIndex = (index: number) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: index * (windowWidth + padding),
        animated: true,
      });
    }
  };
  const [showFullText, setShowFullText] = useState(false);
  // Metni 100 karaktere kadar kısaltan fonksiyon
  const shortenText = (text) => {
    if (text.length <= MAX_TEXT_LENGTH) {
      return text;
    } else {
      return text.slice(0, MAX_TEXT_LENGTH) + '...'; // Metni kısalt ve "..." ekle
    }
  };

  // "Read More" düğmesine basıldığında tam metni gösteren fonksiyon
  const handleReadMore = () => {
    setShowFullText(true);
  };
  const handleToggleText = () => {
    setShowFullText(!showFullText);
  };
  const renderItem = ({ item }: { item: CarouselItem }) => (
    <View
      style={{
        padding: 15,
        borderColor: 'red',
        borderWidth: 1,
        borderRadius: 20,
        maxWidth:containerWidth
      }}
    >
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Image
          source={{ uri: item.url }}
          style={{ width: imageWidth, height: imageWidth, borderRadius: 5 }}
        />
      </View>
      <View
        style={{
          alignItems: 'flex-start',
          paddingTop: 10,
          maxWidth: 200,
        }}
      >
        <Text style={{ fontWeight: 'bold' }}>{item.title}</Text>
        <Text>{showFullText ? item.text : shortenText(item.text)}</Text>
       { showFullText && <TouchableOpacity onPress={handleToggleText}>
          <Text style={{ color: 'blue', marginTop: 5 }}>Close</Text>
        </TouchableOpacity>}
        {!showFullText && item.text.length > MAX_TEXT_LENGTH && (
          <TouchableOpacity onPress={handleReadMore}>
            <Text style={{ color: 'blue', marginTop: 5 }}>Read More</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1}}>
      <ScrollView
        scrollEventThrottle={100}
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={(event) => {
          const index = Math.round(
            event.nativeEvent.contentOffset.x / (windowWidth + padding)
          );
          setCurrentIndex(index);
        }}
        
      >
        {data.map((item, index) => (
          <View
            key={item.key}
            style={{
              width: windowWidth - padding,
              backgroundColor: 'transparent',
              display: 'flex',
              alignItems: 'center',
              alignContent: 'center',
              borderColor: '#ccd9eb',
              borderWidth: 1,
              marginLeft: index === 0 ? 20 : 0,
            margin:padding
              //   borderRadius: 20,
              //   paddingVertical: 20,
            }}
          >
            {renderItem({ item })}
          </View>
        ))}
      </ScrollView>

      <View
        style={{
          position: 'absolute',
          zIndex:1,
          top: '50%',
          left: 0,
          right: 0,
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 5,
          backgroundColor:"blue",
        }}
      >
        <TouchableOpacity
          onPress={() => scrollToIndex(currentIndex - 1)}
          style={{ backgroundColor: 'pink' }}
        >
          <Text>{'<'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => scrollToIndex(currentIndex + 1)}
          style={{ backgroundColor: 'pink' }}
        >
          <Text>{'>'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CarouselPage;
