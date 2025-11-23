/**
 * صفحه داستان با طراحی حرفه‌ای و dialog box
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ImageBackground,
  I18nManager,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { theme } from '../theme';
import { useStory } from '../context/StoryContext';

// فعال‌سازی RTL
I18nManager.forceRTL(true);
I18nManager.allowRTL(true);

const { width, height } = Dimensions.get('window');

type StoryScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Story'>;

interface Props {
  navigation: StoryScreenNavigationProp;
}

const StoryScreen: React.FC<Props> = ({ navigation }) => {
  const { currentNode, makeChoice, resetStory, gameState } = useStory();
  const [showText, setShowText] = useState(false);
  const [showChoices, setShowChoices] = useState(false);

  useEffect(() => {
    setShowText(false);
    setShowChoices(false);

    const textTimer = setTimeout(() => setShowText(true), 300);
    const choicesTimer = setTimeout(() => setShowChoices(true), 800);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(choicesTimer);
    };
  }, [currentNode.id]);

  const handleChoice = (choiceId: string, nextNodeId: string) => {
    setShowChoices(false);
    makeChoice(choiceId, nextNodeId);
  };

  const handleBackToMenu = () => {
    navigation.navigate('MainMenu');
  };

  const handleRestart = () => {
    resetStory();
  };

  return (
    <View style={styles.container}>
      {/* Background Image */}
      <ImageBackground
        source={{ uri: 'https://via.placeholder.com/800x1200/1a1a2e/f39c12?text=Background' }}
        style={styles.background}
        blurRadius={3}
      >
        <LinearGradient
          colors={['rgba(10, 14, 39, 0.7)', 'rgba(22, 33, 62, 0.9)']}
          style={styles.overlay}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={handleBackToMenu}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name="menu"
                size={28}
                color={theme.colors.gold.main}
              />
            </TouchableOpacity>

            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle}>{currentNode.title}</Text>
              <Text style={styles.progressText}>
                گره {gameState.visitedNodes.length}
              </Text>
            </View>

            <View style={styles.menuButton} />
          </View>

          {/* Dialog Box */}
          <View style={styles.dialogContainer}>
            {showText && (
              <Animatable.View
                animation="fadeInUp"
                duration={600}
                style={styles.dialogBox}
              >
                <LinearGradient
                  colors={['rgba(26, 26, 46, 0.95)', 'rgba(31, 43, 77, 0.95)']}
                  style={styles.dialogGradient}
                >
                  {/* Decorative Corner */}
                  <View style={styles.dialogDecoration}>
                    <MaterialCommunityIcons
                      name="star-four-points"
                      size={20}
                      color={theme.colors.gold.main}
                    />
                  </View>

                  <ScrollView
                    style={styles.textScrollView}
                    contentContainerStyle={styles.textScrollContent}
                    showsVerticalScrollIndicator={false}
                  >
                    <Text style={styles.storyText}>{currentNode.text}</Text>
                  </ScrollView>

                  {/* Ending Badge */}
                  {currentNode.isEnding && (
                    <Animatable.View
                      animation="bounceIn"
                      delay={400}
                      style={[
                        styles.endingBadge,
                        { backgroundColor: theme.colors.ending[currentNode.endingType || 'neutral'] }
                      ]}
                    >
                      <MaterialCommunityIcons
                        name={
                          currentNode.endingType === 'good' ? 'star' :
                          currentNode.endingType === 'bad' ? 'heart-broken' :
                          'circle-outline'
                        }
                        size={20}
                        color="#fff"
                      />
                      <Text style={styles.endingText}>
                        {currentNode.endingType === 'good' ? 'پایان خوش' :
                         currentNode.endingType === 'bad' ? 'پایان تلخ' :
                         'پایان'}
                      </Text>
                    </Animatable.View>
                  )}
                </LinearGradient>
              </Animatable.View>
            )}
          </View>

          {/* Choices Container */}
          <View style={styles.choicesContainer}>
            {showChoices && currentNode.choices.length > 0 && (
              <ScrollView
                style={styles.choicesScrollView}
                contentContainerStyle={styles.choicesContent}
                showsVerticalScrollIndicator={false}
              >
                {currentNode.choices.map((choice, index) => (
                  <Animatable.View
                    key={choice.id}
                    animation="fadeInRight"
                    delay={index * 150}
                    duration={600}
                  >
                    <TouchableOpacity
                      style={styles.choiceButton}
                      onPress={() => handleChoice(choice.id, choice.nextNodeId)}
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={[theme.colors.primary.lighter, theme.colors.primary.light]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.choiceGradient}
                      >
                        <View style={styles.choiceNumber}>
                          <Text style={styles.choiceNumberText}>{index + 1}</Text>
                        </View>
                        <View style={styles.choiceTextContainer}>
                          <Text style={styles.choiceText}>{choice.text}</Text>
                          {choice.consequence && (
                            <Text style={styles.consequenceText}>
                              💭 {choice.consequence}
                            </Text>
                          )}
                        </View>
                      </LinearGradient>
                    </TouchableOpacity>
                  </Animatable.View>
                ))}
              </ScrollView>
            )}

            {/* Restart Button for Endings */}
            {showChoices && currentNode.isEnding && (
              <Animatable.View
                animation="fadeInUp"
                delay={400}
              >
                <TouchableOpacity
                  style={styles.restartButton}
                  onPress={handleRestart}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={[theme.colors.status.warning, theme.colors.gold.dark]}
                    style={styles.restartGradient}
                  >
                    <MaterialCommunityIcons
                      name="restart"
                      size={24}
                      color="#fff"
                    />
                    <Text style={styles.restartText}>شروع دوباره داستان</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Animatable.View>
            )}
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
  },
  header: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.xxl,
    paddingBottom: theme.spacing.md,
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: theme.borderRadius.md,
    backgroundColor: 'rgba(26, 26, 46, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: theme.typography.size.xl,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.gold.main,
    textAlign: 'center',
  },
  progressText: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.text.tertiary,
    marginTop: theme.spacing.xs,
  },
  dialogContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
  },
  dialogBox: {
    maxHeight: height * 0.5,
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    ...theme.shadows.xl,
  },
  dialogGradient: {
    padding: theme.spacing.lg,
    borderWidth: 2,
    borderColor: theme.colors.gold.dark,
    borderRadius: theme.borderRadius.xl,
  },
  dialogDecoration: {
    position: 'absolute',
    top: theme.spacing.md,
    left: theme.spacing.md,
    zIndex: 1,
  },
  textScrollView: {
    maxHeight: height * 0.4,
  },
  textScrollContent: {
    paddingTop: theme.spacing.sm,
  },
  storyText: {
    fontSize: theme.typography.size.lg,
    lineHeight: theme.typography.size.lg * theme.typography.lineHeight.relaxed,
    color: theme.colors.text.primary,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  endingBadge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing.sm,
  },
  endingText: {
    fontSize: theme.typography.size.lg,
    fontWeight: theme.typography.weight.bold,
    color: '#fff',
  },
  choicesContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  choicesScrollView: {
    maxHeight: height * 0.35,
  },
  choicesContent: {
    paddingVertical: theme.spacing.sm,
  },
  choiceButton: {
    marginVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  choiceGradient: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderWidth: 2,
    borderColor: theme.colors.gold.dark,
    borderRadius: theme.borderRadius.lg,
  },
  choiceNumber: {
    width: 36,
    height: 36,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.gold.main,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing.md,
  },
  choiceNumberText: {
    fontSize: theme.typography.size.lg,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.primary.dark,
  },
  choiceTextContainer: {
    flex: 1,
  },
  choiceText: {
    fontSize: theme.typography.size.md,
    fontWeight: theme.typography.weight.semibold,
    color: theme.colors.text.primary,
    textAlign: 'right',
    writingDirection: 'rtl',
    lineHeight: theme.typography.size.md * theme.typography.lineHeight.normal,
  },
  consequenceText: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.text.tertiary,
    textAlign: 'right',
    writingDirection: 'rtl',
    marginTop: theme.spacing.xs,
    fontStyle: 'italic',
  },
  restartButton: {
    marginTop: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    ...theme.shadows.lg,
  },
  restartGradient: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  restartText: {
    fontSize: theme.typography.size.lg,
    fontWeight: theme.typography.weight.bold,
    color: '#fff',
  },
});

export default StoryScreen;
