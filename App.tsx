import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { I18nManager, Platform, View } from 'react-native';
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
    <View style={{ flex: 1 }}>
      <StoryProvider>
        <AppNavigator />
        <StatusBar style="light" />
      </StoryProvider>
    </View>
  );
}
