import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { I18nManager, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StoryProvider } from './src/context/StoryContext';
import { AppNavigator } from './src/navigation/AppNavigator';

// فعال‌سازی RTL برای کل اپلیکیشن
if (!I18nManager.isRTL) {
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(true);
  // در Android نیاز به ریلود دارد
  if (Platform.OS === 'android') {
    // در production این را غیرفعال کنید یا از Updates.reloadAsync استفاده کنید
    console.warn('RTL enabled - app needs reload on Android');
  }
}

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
