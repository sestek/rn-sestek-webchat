// src/pages/example/screens/RemoteWebChat.tsx
import React, {useMemo, useRef} from 'react';
import {View, Button} from 'react-native';
import {WebView} from 'react-native-webview';
import {Buffer} from 'buffer';
import {useNavigation} from '@react-navigation/native';

export default function RemoteWebChat() {
  const webRef = useRef<WebView>(null);
  const navigation = useNavigation();
  function toB64Json(obj: any) {
    const s = JSON.stringify(obj);
    return Buffer.from(s, 'utf8').toString('base64');
  }

  const settings = {
    isMobile: true,
    channel: 'webchat-sestek',
    customActionData: JSON.stringify({
      channel: 'webchatmobile-sestek',
      responseType: 'AudioBase64',
      showHistory: 'false',
      userId: 'rabia',
    }),
    endUser: {name: 'Rabia Vural', email: 'rabia', phone: '1111111'},
  };

  const url = `https://demo-app.sestek.com/examples/webviewMobile.html?settings=${encodeURIComponent(
    toB64Json(settings),
  )}`;

  console.log('WebChat URL:', url);
const handleMessage = (e: any) => {
    try {
      const data = JSON.parse(e.nativeEvent.data || '{}');
      if (data?.event === 'hideChat' || data?.event === 'closeChat') {
        console.log("Received event to close chat:", data.event);
      
        navigation.getParent()?.navigate('Home');
        
      }
    } catch {}
  };
  return (
    <View style={{flex: 1}}>
      <WebView
        ref={webRef}
        source={{uri: url}} 
        javaScriptEnabled
        originWhitelist={['*']}
        onMessage={handleMessage}
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
      />
    </View>
  );
}
