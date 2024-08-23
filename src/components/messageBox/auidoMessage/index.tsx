// // import React from 'react';
// // import { Text } from 'react-native';
// // import AudioComponent from './audio';
// // import { Recorder } from '../../../services';
// // import { useCustomizeConfiguration } from '../../../context/CustomizeContext';
// // import { useModules } from '../../../context/ModulesContext';

// // interface AudioMessageProps {
// //   activity: any;
// //   userMessageBoxTextColor: string;
// //   inlineText?: boolean;
// // }

// // const AudioMessage = (props: AudioMessageProps) => {
// //   const { modules } = useModules();

// //   if (!modules?.AudioRecorderPlayer || !modules?.RNFS) {
// //     return null;
// //   }
// //   let url = props.activity?.message;
// //   let position = 'right';
// //   if (props?.activity?.attachments && props?.activity?.attachments[0]) {
// //     url = props?.activity?.attachments[0]?.content;
// //     position = 'left';
// //   }
// //   const { customizeConfiguration } = useCustomizeConfiguration();

// //   return (
// //     <>
// //       <AudioComponent
// //         url={
// //           url && url.length > 1000
// //             ? 'file://' +
// //               new Recorder(
// //                 modules?.AudioRecorderPlayer,
// //                 modules?.RNFS,
// //                 modules?.Record
// //               ).saveLocalFileAudio(url, props?.activity?.id)
// //             : url
// //         }
// //         position={position}
// //       />
// //       {position === 'right' && (
// //         <Text
// //           style={{
// //             marginVertical: props.activity?.text && 10,
// //             color: props?.userMessageBoxTextColor ?? 'white',
// //             paddingLeft: 10,
// //             fontSize: customizeConfiguration?.fontSettings?.subtitleFontSize,
// //           }}
// //         >
// //           {props.activity?.text}
// //         </Text>
// //       )}
// //     </>
// //   );
// // };

// // export default AudioMessage;


// import React, { useRef, useEffect } from 'react';
// import { Text } from 'react-native';
// import AudioComponent, { AudioComponentHandles } from './audio'; // AudioComponentHandles'i import edin
// import { Recorder } from '../../../services';
// import { useCustomizeConfiguration } from '../../../context/CustomizeContext';
// import { useModules } from '../../../context/ModulesContext';

// interface AudioMessageProps {
//   activity: any;
//   userMessageBoxTextColor: string;
//   inlineText?: boolean;
//   currentPlayingUrl: string | null;
//   setCurrentPlayingUrl: (url: string | null) => void;
// }

// const AudioMessage = (props: AudioMessageProps) => {
//   // AudioComponent için useRef kullanırken türünü belirtin
//   const audioComponentRef = useRef<AudioComponentHandles>(null);

//   useEffect(() => {
//     // Diğer ses çalarken bu ses oynatıcısını durdurun
//     if (props.currentPlayingUrl && props.currentPlayingUrl !== props.activity.message) {
//       audioComponentRef?.current?.onPausePlayer();
//       console.log("!!!!!! auido messs")
//     }
//   }, [props.currentPlayingUrl]);

//   const handlePlayPause = () => {
//     if (props.currentPlayingUrl === props.activity.message) {
//       props.setCurrentPlayingUrl(null);
//     } else {
//       props.setCurrentPlayingUrl(props.activity.message);
//     }
//   };

//   const { modules } = useModules();

//   if (!modules?.AudioRecorderPlayer || !modules?.RNFS) {
//     return null;
//   }

//   let url = props.activity?.message;
//   let position = 'right';
//   if (props?.activity?.attachments && props?.activity?.attachments[0]) {
//     url = props?.activity?.attachments[0]?.content;
//     position = 'left';
//   }

//   const { customizeConfiguration } = useCustomizeConfiguration();

//   return (
//     <>
//       <AudioComponent
//         ref={audioComponentRef} // ref'i AudioComponent'e geçiriyoruz
//         url={
//           url && url.length > 1000
//             ? 'file://' +
//               new Recorder(
//                 modules?.AudioRecorderPlayer,
//                 modules?.RNFS,
//                 modules?.Record
//               ).saveLocalFileAudio(url, props?.activity?.id)
//             : url
//         }
//         position={position}
//         onPlayPause={handlePlayPause}
//       />
//       {position === 'right' && (
//         <Text
//           style={{
//             marginVertical: props.activity?.text && 10,
//             color: props?.userMessageBoxTextColor ?? 'white',
//             paddingLeft: 10,
//             fontSize: customizeConfiguration?.fontSettings?.subtitleFontSize,
//           }}
//         >
//           {props.activity?.text}
//         </Text>
//       )}
//     </>
//   );
// };

// export default AudioMessage;
import React, { useRef, useEffect } from 'react';
import { Text } from 'react-native';
import AudioComponent, { AudioComponentHandles } from './audio';
import { Recorder } from '../../../services';
import { useCustomizeConfiguration } from '../../../context/CustomizeContext';
import { useModules } from '../../../context/ModulesContext';

interface AudioMessageProps {
  activity: any;
  userMessageBoxTextColor: string;
  inlineText?: boolean;
  currentPlayingUrl: string | null;
  setCurrentPlayingUrl: (url: string | null) => void;
  onAudioClick: (audioUrl: string) => void; // Yeni prop

}

const AudioMessage = (props: AudioMessageProps) => {
  const audioComponentRef = useRef<AudioComponentHandles>(null);

  useEffect(() => {
    if (props.currentPlayingUrl && props.currentPlayingUrl !== props.activity.message) {
      audioComponentRef?.current?.onPausePlayer();
    }
  }, [props.currentPlayingUrl]);

  const handlePlayPause = () => {
    if (props.onAudioClick) {
      props.onAudioClick(props.activity.message); // `onAudioClick` fonksiyonunu çağırıyoruz
    }
    
    if (props.currentPlayingUrl === props.activity.message) {
      props.setCurrentPlayingUrl(null);
    } else {
      props.setCurrentPlayingUrl(props.activity.message);
    }
  };

  const { modules } = useModules();

  if (!modules?.AudioRecorderPlayer || !modules?.RNFS) {
    return null;
  }

  let url = props.activity?.message;
  let position = 'right';
  if (props?.activity?.attachments && props?.activity?.attachments[0]) {
    url = props?.activity?.attachments[0]?.content;
    position = 'left';
  }

  console.log("currenttt", props.currentPlayingUrl)
  const { customizeConfiguration } = useCustomizeConfiguration();

  return (
    <>
      <AudioComponent
        ref={audioComponentRef}
        url={url && url.length > 1000
          ? 'file://' + new Recorder(
              modules?.AudioRecorderPlayer,
              modules?.RNFS,
              modules?.Record
            ).saveLocalFileAudio(url, props?.activity?.id)
          : url
        }
        position={position}
        onPlayPause={handlePlayPause}
        // activeUrl={props.currentPlayingUrl} // activeUrl prop'u geçiriliyor
      />
      {position === 'right' && (
        <Text
          style={{
            marginVertical: props.activity?.text && 10,
            color: props?.userMessageBoxTextColor ?? 'white',
            paddingLeft: 10,
            fontSize: customizeConfiguration?.fontSettings?.subtitleFontSize,
          }}
        >
          {props.activity?.text}
        </Text>
      )}
    </>
  );
};

export default AudioMessage;
