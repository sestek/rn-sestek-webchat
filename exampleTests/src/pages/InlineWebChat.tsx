
import React, {useMemo} from 'react';
import {WebView} from 'react-native-webview';
import {useNavigation} from '@react-navigation/native';

export default function InlineWebChat() {
  const navigation = useNavigation();

  const html = useMemo(() => {
    const settings = {
      customActionData: JSON.stringify({
        channel: 'webchatmobile-sestek',
        responseType: 'AudioBase64',
        showHistory: 'false',
        userRef: 'usr_5678:zzzzz',
      }),
      endUser: { name: 'Rabia Vural', email: 'rabia', phone: '1111111' },
      isMobile: true,
      channel: 'webchat-sestek',
    };

    const settingsStr = JSON.stringify(settings).replace(/</g, '\\u003c');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Inline WebChat</title>
  <style>
    .wc-hidden body { display: none !important; }
  </style>
  <script>
    // 1) Settings earliest
    window.WebChatSettings = ${settingsStr};
  </script>

  <script>
    // 2) Load plugin after settings
     !(function () {
    var t = document.createElement('script');
    t.setAttribute('id','webChatPlugin');
    t.setAttribute('src', 'https://va.uae.knovvu.com/webchat-plugin/chat.min.js');
    t.setAttribute('async', '');
    t.setAttribute('data-integrationId', '9b9eaaf8-bbde-a05a-1fc7-3a1a8ee283c9');
    t.setAttribute('data-integrationSettingsUrl', 'https://va.uae.knovvu.com/webchat/');
    document.head.appendChild(t);
  })();
  </script>

<script>
  (function () {
    const IS_IFRAME = window !== window.parent;
    const IOS = window.webkit?.messageHandlers?.callbackHandler;
    const ANDROID = window.Android;

    function postToRN(payload) {
      if (window.ReactNativeWebView && typeof window.ReactNativeWebView.postMessage === 'function') {

        try { window.ReactNativeWebView.postMessage(JSON.stringify(payload)); } catch {}
      }
    }

    function notifyNative(event) {
      // RN

      postToRN({ event });

      // Native köprüler (opsiyonel)
      if (IOS) { try { IOS.postMessage({ event }); } catch {} }
      if (ANDROID) {
        try {
          if (event === 'hideChat' && typeof ANDROID.getHideChatEvent === 'function') ANDROID.getHideChatEvent('from-web');
          if (event === 'closeChat' && typeof ANDROID.getCloseChatEvent === 'function') ANDROID.getCloseChatEvent('from-web');
        } catch (err) {}
      }

      if (IS_IFRAME) window.parent.postMessage({ event, __relay: true }, '*');
    }

    // 👇 GÜNCEL: Hem string hem object'i destekle
    window.addEventListener('message', function (e) {
      let data = e.data;
      try {
        if (typeof data === 'string') data = JSON.parse(data);
      } catch (_) { /* string ama json değilse */ }

      if (!data || typeof data !== 'object') return;

      const { event, __relay } = data;
      // Debug için:
      // console.log('[bridge] received', data);

      if (event === 'hideChat' || event === 'closeChat') {
        notifyNative(event);

        // iframe ise relay et
        if (IS_IFRAME && !__relay) {
          window.parent.postMessage({ event, __relay: true }, '*');
        }
      }
    }, false);

    // Test amaçlı global kısayollar
    window.__webchat_hide = () => notifyNative('hideChat');
    window.__webchat_close = () => notifyNative('closeChat');
  })();
</script>

</head>
<body>
  <div id="app">Inline WebChat Loading…</div>
</body>
</html>`;
  }, []);

  const handleMessage = (e: any) => {
    // Web -> RN
    try {
      let data: any = e.nativeEvent.data;
      if (typeof data === 'string') data = JSON.parse(data);
      if (data?.event === 'hideChat' || data?.event === 'closeChat') {
        console.log("Received event to close chat 222222:", data.event);
        navigation.getParent()?.navigate('Home'); 
      }
    } catch {}
  };

  return (
    <WebView
      source={{ html: html, baseUrl: 'https://demop.sestek.com' }}
      originWhitelist={['*']}
      javaScriptEnabled
      onMessage={handleMessage}
      allowsInlineMediaPlayback
      mediaPlaybackRequiresUserAction={false}
    />
  );
}
