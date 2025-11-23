/**
 * منوی اصلی با طراحی حرفه‌ای
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { theme } from '../theme';
import { useStory } from '../context/StoryContext';

const { width } = Dimensions.get('window');

type MainMenuNavigationProp = StackNavigationProp<RootStackParamList, 'MainMenu'>;

interface Props {
  navigation: MainMenuNavigationProp;
}

interface MenuButtonProps {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  onPress: () => void;
  delay: number;
  disabled?: boolean;
}

const MenuButton: React.FC<MenuButtonProps> = ({ icon, title, onPress, delay, disabled }) => (
  <Animatable.View
    animation="fadeInRight"
    delay={delay}
    duration={800}
  >
    <TouchableOpacity
      style={[styles.menuButton, disabled && styles.menuButtonDisabled]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={disabled ? ['#2d3561', '#1f2b4d'] : [theme.colors.primary.lighter, theme.colors.primary.light]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.buttonGradient}
      >
        <MaterialCommunityIcons
          name={icon}
          size={32}
          color={disabled ? theme.colors.text.disabled : theme.colors.gold.main}
          style={styles.buttonIcon}
        />
        <Text style={[styles.buttonText, disabled && styles.buttonTextDisabled]}>
          {title}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  </Animatable.View>
);

const MainMenuScreen: React.FC<Props> = ({ navigation }) => {
  const { loadProgress, gameState } = useStory();
  const hasSavedGame = gameState.visitedNodes.length > 1;

  const handleNewGame = () => {
    navigation.navigate('Story');
  };

  const handleContinue = async () => {
    await loadProgress();
    navigation.navigate('Story');
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1534330980-1bc0676fe2ee?w=1200&q=80' }}
      style={styles.backgroundImage}
      blurRadius={2}
    >
      <LinearGradient
        colors={[
          'rgba(10, 14, 39, 0.85)',
          'rgba(16, 33, 62, 0.9)',
          'rgba(31, 43, 77, 0.95)',
        ]}
        style={styles.container}
      >
      {/* Header */}
      <Animatable.View
        animation="fadeInDown"
        duration={1000}
        style={styles.header}
      >
        <Text style={styles.title}>رستم و سهراب</Text>
        <View style={styles.decorativeLine} />
        <Text style={styles.subtitle}>حماسه‌ای از شاهنامه فردوسی</Text>
      </Animatable.View>

      {/* Menu Buttons */}
      <View style={styles.menuContainer}>
        <MenuButton
          icon="play-circle"
          title="بازی جدید"
          onPress={handleNewGame}
          delay={200}
        />
        <MenuButton
          icon="progress-check"
          title="ادامه بازی"
          onPress={handleContinue}
          delay={400}
          disabled={!hasSavedGame}
        />
        <MenuButton
          icon="image-multiple"
          title="گالری تصاویر"
          onPress={() => navigation.navigate('Gallery')}
          delay={600}
        />
        <MenuButton
          icon="cog"
          title="تنظیمات"
          onPress={() => navigation.navigate('Settings')}
          delay={800}
        />
      </View>

      {/* Footer */}
      <Animatable.View
        animation="fadeIn"
        delay={1200}
        style={styles.footer}
      >
        <Text style={styles.footerText}>نسخه 1.0.0</Text>
        <Text style={styles.footerSubtext}>ساخته شده با ❤️ برای علاقه‌مندان به شاهنامه</Text>
      </Animatable.View>
    </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    paddingTop: theme.spacing.xxxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxxl,
  },
  title: {
    fontSize: theme.typography.size.huge,
    fontWeight: theme.typography.weight.extrabold,
    color: theme.colors.gold.main,
    textAlign: 'center',
    textShadowColor: 'rgba(243, 156, 18, 0.3)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
  },
  decorativeLine: {
    width: 150,
    height: 4,
    backgroundColor: theme.colors.gold.main,
    marginVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
  },
  subtitle: {
    fontSize: theme.typography.size.md,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  menuButton: {
    marginVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    ...theme.shadows.lg,
  },
  menuButtonDisabled: {
    opacity: 0.5,
  },
  buttonGradient: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderWidth: 2,
    borderColor: theme.colors.gold.dark,
    borderRadius: theme.borderRadius.lg,
  },
  buttonIcon: {
    marginLeft: theme.spacing.md,
  },
  buttonText: {
    flex: 1,
    fontSize: theme.typography.size.xl,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.text.primary,
    textAlign: 'right',
  },
  buttonTextDisabled: {
    color: theme.colors.text.disabled,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: theme.spacing.xl,
  },
  footerText: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.text.tertiary,
    marginBottom: theme.spacing.xs,
  },
  footerSubtext: {
    fontSize: theme.typography.size.xs,
    color: theme.colors.text.tertiary,
  },
});

export default MainMenuScreen;
