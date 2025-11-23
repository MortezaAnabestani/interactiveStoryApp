import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { I18nManager } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StoryProvider } from './src/context/StoryContext';
import { AppNavigator } from './src/navigation/AppNavigator';

// فعال‌سازی RTL برای کل اپلیکیشن
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

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
