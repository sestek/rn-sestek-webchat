import * as React from 'react';
import { useRef } from 'react';
import { StyleSheet, View, Text, Image, Pressable } from 'react-native';
import { ChatModal, ChatModalRef } from 'rn-sestek-webchat';
import FlashMessage, { showMessage } from "react-native-flash-message";

export default function App() {
  const modalRef = useRef<ChatModalRef>(null);

  const pressStartConversation = () => {
    modalRef.current?.startConversation();
  }

  const pressEndConversation = () => {
    if (!modalRef.current?.conversationStatus) {
      showMessage({
        backgroundColor: '#7f81ae',
        description: 'The conversation has already ended.',
        message: 'Warning'
      });
    }
    modalRef.current?.endConversation();
  }

  const pressTriggerVisible = () => {
    if (!modalRef.current?.conversationStatus) {
      showMessage({
        backgroundColor: '#7f81ae',
        description: 'First you need to start the conversation.',
        message: 'Warning'
      });
      return;
    }
    modalRef.current?.triggerVisible();
  }

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <Image
          style={{ height: 300 }}
          source={require('./images/knovvu_subtitle.png')}
          resizeMode="contain"
        />
      </View>

      <View style={{ flex: 1 }}>
        <Pressable style={styles.button} onPress={pressStartConversation}>
          <Text style={styles.text}>Start Conversation</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={pressEndConversation}>
          <Text style={styles.text}>End Conversation</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={pressTriggerVisible}>
          <Text style={styles.text}>Trigger Visible</Text>
        </Pressable>
      </View>
      <View style={{ flex: 0.5, justifyContent: 'center' }}>
        <Text style={{ margin: 20, fontSize: 12, fontWeight: '100' }}>
          Sestek is a global technology company helping organizations with
          Conversational Solutions to be data-driven, increase efficiency and deliver better experiences for their customers.
          Sestek’s AI-powered solutions are build on text-to-speech, speech recognition,
          natural language processing and voice biometrics technologies.
        </Text>
      </View>
      <FlashMessage position="top" />
      <ChatModal
        ref={modalRef}
        defaultConfiguration={{
          sendConversationStart: true,
          tenant: 'SAIB',
          projectName: 'SAIB',
          channel: 'NdaInfoBip'
        }}
        customizeConfiguration={{
          headerColor: '#7f81ae',
          headerText: 'Knovvu',
          bottomColor: '#7f81ae',
          bottomInputText: 'Bottom input text..',
          //bottomVoiceIcon: "<Cmp />",
          //bottomSendIcon: "<Cmp />",
          incomingIcon: { type: 'uri', value: 'https://upload.wikimedia.org/wikipedia/commons/7/70/User_icon_BLACK-01.png' },
          incomingText: '',
          incomingTextColor: '',
          outgoingIcon: { type: 'component', value: require('./images/knovvu_logo.png') },
          outgoingText: 'Knovvu',
          outgoingTextColor: '',
          messageColor: '',
          messageBoxColor: '',
          //bodyColorOrImage: { type: 'image', value: 'https://i.pinimg.com/550x/4a/6f/59/4a6f59296f90c11d77744720ca10d1af.jpg' },
          bodyColorOrImage: { type: 'color', value: '#7f81ae' },
          firsIcon: { type: 'component', value: require('./images/knovvu_logo.png') },
          firstColor: 'white',
          firstSize: 70,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#abaee6',
    //marginTop: Platform.OS === "ios" ? 33 : 0,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'white',
    marginBottom: 10
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: '#7f81ae',
  },
});
