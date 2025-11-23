import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StoryProvider } from './src/context/StoryContext';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StoryProvider>
        <AppNavigator />
        <StatusBar style="light" />
      </StoryProvider>
    </GestureHandlerRootView>
  );
}
