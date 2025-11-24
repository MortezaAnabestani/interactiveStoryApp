/**
 * Navigation اصلی اپلیکیشن
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';

// صفحات
import SplashScreen from '../screens/SplashScreen';
import MainMenuScreen from '../screens/MainMenuScreen';
import StoryScreen from '../screens/StoryScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AISettingsScreen from '../screens/AISettingsScreen';
import GalleryScreen from '../screens/GalleryScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{
            animation: 'fade',
          }}
        />
        <Stack.Screen name="MainMenu" component={MainMenuScreen} />
        <Stack.Screen name="Story" component={StoryScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="AISettings" component={AISettingsScreen} />
        <Stack.Screen name="Gallery" component={GalleryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
