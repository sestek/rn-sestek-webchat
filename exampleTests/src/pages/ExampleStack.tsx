// src/pages/example/index.tsx
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ExampleHome from './example';
import RemoteWebChat from './RemoteWebChat';
import InlineWebChat from './InlineWebChat';

export type ExampleStackParamList = {
  Example: undefined;
  RemoteWebChat: undefined;
  InlineWebChat: undefined;
};

const Stack = createNativeStackNavigator<ExampleStackParamList>();

export default function ExampleStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Example"
        component={ExampleHome}
        options={{title: 'Example'}}
      />
      <Stack.Screen
        name="RemoteWebChat"
        component={RemoteWebChat}
        options={{title: 'Hosted WebChat'}}
      />
      <Stack.Screen
        name="InlineWebChat"
        component={InlineWebChat}
        options={{title: 'Inline WebChat'}}
      />
    </Stack.Navigator>
  );
}
