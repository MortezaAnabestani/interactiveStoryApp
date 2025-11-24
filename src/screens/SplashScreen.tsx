/**
 * صفحه Splash با انیمیشن ورود
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { theme } from '../theme';

type SplashScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Splash'>;

interface Props {
  navigation: SplashScreenNavigationProp;
}

const SplashScreen: React.FC<Props> = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('MainMenu');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <LinearGradient
      colors={[
        theme.colors.background.gradient.start,
        theme.colors.background.gradient.middle,
        theme.colors.background.gradient.end,
      ]}
      style={styles.container}
    >
      <Animatable.View
        animation="fadeInDown"
        duration={1500}
        style={styles.content}
      >
        <Text style={styles.title}>رستم و سهراب</Text>
        <View style={styles.decorativeLine} />
        <Animatable.Text
          animation="fadeIn"
          delay={800}
          style={styles.subtitle}
        >
          داستانی از شاهنامه فردوسی
        </Animatable.Text>
      </Animatable.View>

      <Animatable.View
        animation="fadeIn"
        delay={1500}
        style={styles.footer}
      >
        <Text style={styles.footerText}>در حال بارگذاری...</Text>
      </Animatable.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: theme.typography.size.huge,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.gold.main,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  decorativeLine: {
    width: 120,
    height: 3,
    backgroundColor: theme.colors.gold.main,
    marginVertical: theme.spacing.md,
  },
  subtitle: {
    fontSize: theme.typography.size.lg,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: theme.spacing.xxl,
  },
  footerText: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.text.tertiary,
  },
});

export default SplashScreen;
