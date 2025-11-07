// src/pages/example/screens/ExampleHome.tsx
import React from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ExampleStackParamList} from './ExampleStack';

type Props = NativeStackScreenProps<ExampleStackParamList, 'Example'>;

export default function ExampleHome({navigation}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Example Screen</Text>

      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate('RemoteWebChat')}>
        <Text style={styles.buttonText}>
          Open Remote Script (Hosted URL)
        </Text>
      </Pressable>

      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate('InlineWebChat')}>
        <Text style={styles.buttonText}>
          Open Inline Script (Embedded HTML)
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#b796e7', paddingHorizontal: 20,
  },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 40, color: '#fff' },
  button: {
    backgroundColor: '#4a1ea1', paddingVertical: 14, paddingHorizontal: 24,
    borderRadius: 12, marginVertical: 10, width: '100%',
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600', textAlign: 'center' },
});
