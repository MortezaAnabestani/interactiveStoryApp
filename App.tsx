import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StoryProvider } from './src/context/StoryContext';
import { StoryScreen } from './src/components/StoryScreen';

export default function App() {
  return (
    <StoryProvider>
      <StoryScreen />
      <StatusBar style="light" />
    </StoryProvider>
  );
}
