

// import React, { useState, useRef, useEffect } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// import AudioRecorderPlayer from 'react-native-audio-recorder-player';

// const audioRecorderPlayer = new AudioRecorderPlayer();

// const HomeScreenPage: React.FC = () => {
//   const [isPlaying, setIsPlaying] = useState<boolean>(false);
//   const [currentTime, setCurrentTime] = useState<number>(0);
//   const [duration, setDuration] = useState<number>(0);
//   const [heights] = useState<number[]>(Array.from({ length: 50 }, () => 10 + Math.random() * 20)); // Rastgele sabitlenen yükseklikler
//   const [filledBars, setFilledBars] = useState<number>(0);

//   const audioUrl = 'https://onlinetestcase.com/wp-content/uploads/2023/06/500-KB-MP3.mp3'; // Ses dosyasının URL'si

//   useEffect(() => {
//     return () => {
//       audioRecorderPlayer.stopPlayer();
//       audioRecorderPlayer.removePlayBackListener();
//     };
//   }, []);

//   const playAudio = async () => {
//     if (isPlaying) {
//       await audioRecorderPlayer.pausePlayer();
//     } else {
//       await audioRecorderPlayer.startPlayer(audioUrl);
//       audioRecorderPlayer.addPlayBackListener((e) => {
//         setCurrentTime(e.currentPosition);
//         setDuration(e.duration);
//         const filled = Math.ceil((e.currentPosition / e.duration) * heights.length);
//         setFilledBars(Math.min(filled, heights.length)); // Doldurulacak çubuk sayısını ayarla ve sınırla
//         return;
//       });
//     }
//     setIsPlaying(!isPlaying);
//   };

//   const renderBars = () => {
//     return heights.map((height, index) => (
//       <View
//         key={index}
//         style={[
//           styles.bar,
//           {
//             height,
//             backgroundColor: index < filledBars ? '#6495ED' : '#C0C0C0', // Doldurulan çubuklar mavi, diğerleri gri
//           },
//         ]}
//       />
//     ));
//   };

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity onPress={playAudio} style={styles.playButton}>
//         <Text style={styles.playButtonText}>{isPlaying ? 'Pause' : 'Play'}</Text>
//       </TouchableOpacity>
//       <View style={styles.audioBar}>{renderBars()}</View>
//       <View style={styles.timerContainer}>
//         <Text style={styles.timer}>
//           {new Date(currentTime).toISOString().substr(14, 5)}
//         </Text>
//         <Text style={styles.timer}>
//           {new Date(duration).toISOString().substr(14, 5)}
//         </Text>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//     backgroundColor: '#F0F0F0', // Açık renk arka plan
//     borderRadius: 20,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   playButton: {
//     backgroundColor: '#6495ED', // Oynat/Duraklat düğmesi mavi
//     borderRadius: 50,
//     width: 50,
//     height: 50,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 20,
//   },
//   playButtonText: {
//     color: '#fff',
//     fontSize: 18,
//   },
//   audioBar: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     width: '100%',
//     marginVertical: 10,
//   },
//   bar: {
//     flex: 1,
//     marginHorizontal: 2,
//     borderRadius: 5,
//   },
//   timerContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: '100%',
//     paddingHorizontal: 10,
//   },
//   timer: {
//     color: '#6495ED', // Zaman göstergesi mavi renk
//     fontSize: 16,
//   },
// });

// export default HomeScreenPage;
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

const audioRecorderPlayer = new AudioRecorderPlayer();

const HomeScreenPage: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [heights] = useState<number[]>(Array.from({ length: 50 }, () => 10 + Math.random() * 20)); // Rastgele sabitlenen yükseklikler
  const [filledBars, setFilledBars] = useState<number>(0);

  const audioUrl = 'https://onlinetestcase.com/wp-content/uploads/2023/06/500-KB-MP3.mp3'; // Ses dosyasının URL'si

  useEffect(() => {
    return () => {
      audioRecorderPlayer.stopPlayer();
      audioRecorderPlayer.removePlayBackListener();
    };
  }, []);

  const playAudio = async () => {
    if (isPlaying) {
      await audioRecorderPlayer.pausePlayer();
    } else {
      await audioRecorderPlayer.startPlayer(audioUrl);
      audioRecorderPlayer.addPlayBackListener((e) => {
        setCurrentTime(e.currentPosition);
        setDuration(e.duration);
        const filled = Math.ceil((e.currentPosition / e.duration) * heights.length);
        setFilledBars(Math.min(filled, heights.length)); // Doldurulacak çubuk sayısını ayarla ve sınırla
        return;
      });
    }
    setIsPlaying(!isPlaying);
  };

  const renderBars = () => {
    return heights.map((height, index) => (
      <View
        key={index}
        style={[
          styles.bar,
          {
            height,
            backgroundColor: index < filledBars ? '#6495ED' : '#C0C0C0', // Doldurulan çubuklar mavi, diğerleri gri
          },
        ]}
      />
    ));
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={playAudio} style={styles.playButton} />
      <View style={styles.audioBar}>{renderBars()}</View>
      <Text style={styles.timer}>
        {new Date(currentTime).toISOString().substr(14, 5)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', // Elemanları yatayda hizalamak için
    padding: 20,
    backgroundColor: '#F0F0F0', // Açık renk arka plan
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  playButton: {
    backgroundColor: '#6495ED', // Oynat/Duraklat düğmesi mavi
    borderRadius: 50,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10, // Düğme ile çubuklar arasında boşluk
  },
  audioBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginRight: 10, // Çubuklar ile zaman göstergesi arasında boşluk
  },
  bar: {
    flex: 1,
    marginHorizontal: 1, // Çubuklar arası mesafe
    borderRadius: 5,
  },
  timer: {
    color: '#6495ED', // Zaman göstergesi mavi renk
    fontSize: 16,
    width: 50, // Sabit bir genişlik
    textAlign: 'right', // Zamanın sağa hizalanması
  },
});

export default HomeScreenPage;
