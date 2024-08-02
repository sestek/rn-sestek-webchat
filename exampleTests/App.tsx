import React from 'react';
import {Image, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from './src/pages/example';
import ChatbotScreen from './src/pages/chatBot';
import ChatPage from './src/pages/chatPage';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="ChatPage"
        screenOptions={({route}) => ({
          tabBarIcon: ({focused, color, size}) => {
            let value;
            if (route.name === 'Example') {
              value = require('./src/images/shape.png');
            } else if (route.name === 'Chatbot') {
              value = require('./src/images/chat.png');
            } else if (route.name === 'Home') {
              value = require('./src/images/home.png');
            }

            return <Image source={value} style={{width: size, height: size}} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}>
        <Tab.Screen
          name="Home"
          component={ChatPage}
          options={{headerShown: false}}
        />
        <Tab.Screen
          name="Example"
          options={{headerShown: false}}
          component={HomeScreen}
        />

        <Tab.Screen
          name="Chatbot"
          component={ChatbotScreen}
          options={{headerShown: false}}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}


