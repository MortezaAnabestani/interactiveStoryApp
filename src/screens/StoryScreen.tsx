/**
 * صفحه داستان - نسخه بازی‌وار با گفتگوها و آمار
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ImageBackground,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { theme } from '../theme';
import { useStory } from '../context/StoryContext';
import { images } from '../assets/images';
import { soundManager } from '../assets/sounds';
import DialogueBox from '../components/DialogueBox';
import StatsBar from '../components/StatsBar';
import RelationshipBar from '../components/RelationshipBar';
import AskFerdowsiModal from '../components/AskFerdowsiModal';
import { characters } from '../data/storyData';
import { aiService } from '../services/AIService';

const { width, height } = Dimensions.get('window');

type StoryScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Story'>;

interface Props {
  navigation: StoryScreenNavigationProp;
}

const StoryScreen: React.FC<Props> = ({ navigation }) => {
  const { currentNode, makeChoice, resetStory, gameState, addDynamicNode } = useStory();
  const [showDialogues, setShowDialogues] = useState(false);
  const [showChoices, setShowChoices] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(false);
  const [showFerdowsiModal, setShowFerdowsiModal] = useState(false);

  useEffect(() => {
    setShowDialogues(false);
    setShowChoices(false);

    const dialogueTimer = setTimeout(() => setShowDialogues(true), 300);
    const choicesTimer = setTimeout(() => setShowChoices(true), 1200);

    return () => {
      clearTimeout(dialogueTimer);
      clearTimeout(choicesTimer);
    };
  }, [currentNode.id]);

  // بررسی وضعیت AI هر بار که صفحه focus می‌شود
  useFocusEffect(
    useCallback(() => {
      checkAIEnabled();
    }, [])
  );

  const checkAIEnabled = async () => {
    const config = await aiService.loadConfig();
    setAiEnabled(config.enabled);
  };

  const handleChoice = (choiceId: string, nextNodeId: string) => {
    soundManager.playSfx('choice');
    setShowChoices(false);
    setShowDialogues(false);
    makeChoice(choiceId, nextNodeId);
  };

  const handleBackToMenu = () => {
    navigation.navigate('MainMenu');
  };

  const handleRestart = () => {
    resetStory();
  };

  const handleGetHint = async () => {
    if (!aiEnabled) {
      Alert.alert(
        '⚠️ AI غیرفعال است',
        'برای استفاده از قابلیت‌های AI، ابتدا از منوی تنظیمات آن را فعال کنید.',
        [
          { text: 'باشه', style: 'cancel' },
          { text: 'برو به تنظیمات', onPress: () => navigation.navigate('AISettings') },
        ]
      );
      return;
    }

    setAiLoading(true);
    try {
      const currentStory = currentNode.text || currentNode.dialogue?.map(d => d.text).join('\n') || '';
      const choices = currentNode.choices || [];
      const stats = gameState?.stats || { honor: 0, courage: 0, wisdom: 0, fame: 0 };

      const hint = await aiService.getHint({
        currentSituation: currentStory,
        availableChoices: choices.map(c => c.text),
        playerStats: stats,
      });

      Alert.alert('💡 راهنمایی', hint, [{ text: 'متوجه شدم', style: 'default' }]);
    } catch (error: any) {
      Alert.alert('❌ خطا', `خطا در دریافت راهنمایی:\n${error.message}`);
    } finally {
      setAiLoading(false);
    }
  };

  const handleGetSummary = async () => {
    if (!aiEnabled) {
      Alert.alert(
        '⚠️ AI غیرفعال است',
        'برای استفاده از قابلیت‌های AI، ابتدا از منوی تنظیمات آن را فعال کنید.',
        [
          { text: 'باشه', style: 'cancel' },
          { text: 'برو به تنظیمات', onPress: () => navigation.navigate('AISettings') },
        ]
      );
      return;
    }

    setAiLoading(true);
    try {
      const choicesHistory = gameState?.choices || [];
      const stats = gameState?.stats?.playerStats || { honor: 0, courage: 0, wisdom: 0, fame: 0 };
      const visitedNodes = gameState?.visitedNodes || [];
      const choicesText = choicesHistory.map(c => c.choice);

      const summary = await aiService.summarizeStory({
        visitedNodes: visitedNodes,
        choices: choicesText,
        currentStats: stats,
      });

      Alert.alert('📖 خلاصه داستان تا اینجا', summary, [{ text: 'باشه', style: 'default' }]);
    } catch (error: any) {
      Alert.alert('❌ خطا', `خطا در دریافت خلاصه:\n${error.message}`);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSuggestBranch = async () => {
    if (!aiEnabled) {
      Alert.alert(
        '⚠️ AI غیرفعال است',
        'برای استفاده از قابلیت‌های AI، ابتدا از منوی تنظیمات آن را فعال کنید.',
        [
          { text: 'باشه', style: 'cancel' },
          { text: 'برو به تنظیمات', onPress: () => navigation.navigate('AISettings') },
        ]
      );
      return;
    }

    setAiLoading(true);
    try {
      const currentStory = currentNode.text || currentNode.dialogue?.map(d => d.text).join('\n') || '';
      const stats = gameState?.stats?.playerStats || { honor: 0, courage: 0, wisdom: 0, fame: 0 };

      const result = await aiService.suggestNewBranch({
        currentNode: currentStory,
        playerStats: stats,
        storyTheme: 'رستم و سهراب',
      });

      // ساخت dynamic node با metadata کامل
      const dynamicNode: any = {
        id: '', // این در addDynamicNode تنظیم می‌شود
        isDynamic: true,
        parentNodeId: currentNode.id,
        returnNodeId: currentNode.id,
        depth: 0,
        maxDepth: 2,
        title: result.title,
        text: result.description,
        background: currentNode.background,
        isEnding: false,
        dialogue: [], // برای جلوگیری از خطا
        choices: result.choices.map((choiceText, i) => ({
          id: `choice_${i}`,
          text: choiceText,
          nextNodeId: currentNode.id,
        })),
      };

      // اضافه کردن choice برگشت
      dynamicNode.choices.push({
        id: 'return',
        text: '🔙 بازگشت به داستان اصلی',
        nextNodeId: currentNode.id,
      });

      const newNodeId = addDynamicNode(dynamicNode);

      // پرسیدن از بازیکن
      const message = `${result.title}\n\n${result.description}\n\nمی‌خوای الان این مسیر رو تجربه کنی؟`;

      Alert.alert(
        '🎮 شاخه جدید ساخته شد!',
        message,
        [
          { text: 'بعداً', style: 'cancel' },
          {
            text: 'آره، بریم!',
            onPress: () => {
              handleChoice('ai_branch', newNodeId);
            },
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('❌ خطا', `خطا در دریافت پیشنهاد:\n${error.message}`);
    } finally {
      setAiLoading(false);
    }
  };

  // انتخاب عکس پس‌زمینه
  const getBackgroundImage = () => {
    if (currentNode.background) {
      // @ts-ignore
      return images.backgrounds[currentNode.background] || images.backgrounds.default;
    }
    return images.backgrounds.default;
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={getBackgroundImage()}
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
                size={24}
                color={theme.colors.gold.main}
              />
            </TouchableOpacity>

            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle}>{currentNode.title}</Text>
              <Text style={styles.progressText}>
                گره {gameState.visitedNodes.length}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => setShowStats(!showStats)}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name="chart-bar"
                size={24}
                color={theme.colors.gold.main}
              />
            </TouchableOpacity>
          </View>

          {/* Stats Panel (Collapsible) */}
          {showStats && (
            <Animatable.View
              animation="fadeInDown"
              duration={400}
              style={styles.statsPanel}
            >
              <ScrollView
                style={styles.statsPanelScroll}
                showsVerticalScrollIndicator={false}
              >
                <StatsBar stats={gameState.stats.playerStats} compact />
                <RelationshipBar
                  relationships={gameState.stats.relationships}
                  characters={characters}
                  compact
                />
              </ScrollView>
            </Animatable.View>
          )}

          {/* Dialogue Container */}
          <ScrollView
            style={styles.dialogueContainer}
            contentContainerStyle={styles.dialogueContent}
            showsVerticalScrollIndicator={false}
          >
            {showDialogues && currentNode.dialogue && currentNode.dialogue.map((dialogue, index) => (
              <DialogueBox
                key={index}
                dialogue={dialogue}
                characterName={characters[dialogue.speaker]?.name || dialogue.speaker}
                delay={index * 400}
              />
            ))}

            {/* متن روایت (اگر وجود داشته باشد) */}
            {showDialogues && currentNode.text && (
              <Animatable.View
                animation="fadeIn"
                delay={currentNode.dialogue ? currentNode.dialogue.length * 400 : 0}
                duration={600}
                style={styles.narrativeBox}
              >
                <LinearGradient
                  colors={['rgba(26, 26, 46, 0.9)', 'rgba(31, 43, 77, 0.9)']}
                  style={styles.narrativeGradient}
                >
                  <Text style={styles.narrativeText}>{currentNode.text}</Text>
                </LinearGradient>
              </Animatable.View>
            )}

            {/* Ending Badge */}
            {currentNode.isEnding && showDialogues && (
              <Animatable.View
                animation="bounceIn"
                delay={800}
                style={[
                  styles.endingBadge,
                  {
                    backgroundColor: theme.colors.ending[currentNode.endingType || 'neutral'],
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name={
                    currentNode.endingType === 'good'
                      ? 'star'
                      : currentNode.endingType === 'bad'
                      ? 'heart-broken'
                      : 'circle-outline'
                  }
                  size={24}
                  color="#fff"
                />
                <Text style={styles.endingText}>
                  {currentNode.endingType === 'good'
                    ? 'پایان خوش'
                    : currentNode.endingType === 'bad'
                    ? 'پایان تلخ'
                    : 'پایان'}
                </Text>
              </Animatable.View>
            )}

            {/* AI Tools Section */}
            {!currentNode.isEnding && showDialogues && (
              <Animatable.View
                animation="fadeInUp"
                delay={600}
                style={styles.aiToolsContainer}
              >
                <Text style={styles.aiToolsTitle}>
                  🤖 ابزارهای AI {!aiEnabled && '(غیرفعال)'}
                </Text>
                <View style={styles.aiButtonsRow}>
                  <TouchableOpacity
                    style={styles.aiButton}
                    onPress={handleGetHint}
                    disabled={aiLoading}
                    activeOpacity={0.7}
                  >
                    <LinearGradient
                      colors={['#3498DB', '#2980B9']}
                      style={styles.aiButtonGradient}
                    >
                      {aiLoading ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        <>
                          <MaterialCommunityIcons name="lightbulb-on" size={20} color="#fff" />
                          <Text style={styles.aiButtonText}>راهنمایی</Text>
                        </>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.aiButton}
                    onPress={handleGetSummary}
                    disabled={aiLoading}
                    activeOpacity={0.7}
                  >
                    <LinearGradient
                      colors={['#9B59B6', '#8E44AD']}
                      style={styles.aiButtonGradient}
                    >
                      {aiLoading ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        <>
                          <MaterialCommunityIcons name="book-open-variant" size={20} color="#fff" />
                          <Text style={styles.aiButtonText}>خلاصه</Text>
                        </>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.aiButton}
                    onPress={handleSuggestBranch}
                    disabled={aiLoading}
                    activeOpacity={0.7}
                  >
                    <LinearGradient
                      colors={['#E67E22', '#D35400']}
                      style={styles.aiButtonGradient}
                    >
                      {aiLoading ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        <>
                          <MaterialCommunityIcons name="creation" size={20} color="#fff" />
                          <Text style={styles.aiButtonText}>ایده جدید</Text>
                        </>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </Animatable.View>
            )}
          </ScrollView>

          {/* Choices Container */}
          <View style={styles.choicesContainer}>
            {showChoices && currentNode.choices.length > 0 && (
              <ScrollView
                style={styles.choicesScrollView}
                contentContainerStyle={styles.choicesContent}
                showsVerticalScrollIndicator={false}
              >
                {currentNode.choices.map((choice, index) => {
                  // بررسی شرایط فعال بودن انتخاب
                  const isDisabled = false; // می‌توانید شرایط را بررسی کنید

                  return (
                    <Animatable.View
                      key={choice.id}
                      animation="fadeInUp"
                      delay={index * 150}
                      duration={600}
                    >
                      <TouchableOpacity
                        style={[
                          styles.choiceButton,
                          isDisabled && styles.choiceButtonDisabled,
                        ]}
                        onPress={() => handleChoice(choice.id, choice.nextNodeId)}
                        activeOpacity={0.8}
                        disabled={isDisabled}
                      >
                        <LinearGradient
                          colors={
                            isDisabled
                              ? ['#2d3561', '#1f2b4d']
                              : [theme.colors.primary.lighter, theme.colors.primary.light]
                          }
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={styles.choiceGradient}
                        >
                          <View style={styles.choiceTextContainer}>
                            <Text
                              style={[
                                styles.choiceText,
                                isDisabled && styles.choiceTextDisabled,
                              ]}
                            >
                              {choice.text}
                            </Text>
                            {choice.consequence && (
                              <Text style={styles.consequenceText}>
                                💭 {choice.consequence}
                              </Text>
                            )}

                            {/* نمایش تأثیرات */}
                            {(choice.statChanges || choice.relationshipChanges) && (
                              <View style={styles.effectsContainer}>
                                {choice.statChanges && (
                                  <View style={styles.effectRow}>
                                    {Object.entries(choice.statChanges).map(
                                      ([stat, change]) =>
                                        change !== 0 && (
                                          <View key={stat} style={styles.effectBadge}>
                                            <Text style={styles.effectText}>
                                              {stat === 'honor'
                                                ? '🛡️'
                                                : stat === 'courage'
                                                ? '⚔️'
                                                : stat === 'wisdom'
                                                ? '🧠'
                                                : '🏆'}{' '}
                                              {change > 0 ? '+' : ''}
                                              {change}
                                            </Text>
                                          </View>
                                        )
                                    )}
                                  </View>
                                )}
                                {choice.relationshipChanges && (
                                  <View style={styles.effectRow}>
                                    {Object.entries(choice.relationshipChanges).map(
                                      ([charId, change]) =>
                                        change !== 0 && (
                                          <View key={charId} style={styles.effectBadge}>
                                            <Text style={styles.effectText}>
                                              ❤️ {characters[charId]?.name}: {change > 0 ? '+' : ''}
                                              {change}
                                            </Text>
                                          </View>
                                        )
                                    )}
                                  </View>
                                )}
                              </View>
                            )}
                          </View>
                        </LinearGradient>
                      </TouchableOpacity>
                    </Animatable.View>
                  );
                })}
              </ScrollView>
            )}

            {/* Restart Button for Endings */}
            {showChoices && currentNode.isEnding && (
              <Animatable.View animation="fadeInUp" delay={400}>
                <TouchableOpacity
                  style={styles.restartButton}
                  onPress={handleRestart}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={[theme.colors.status.warning, theme.colors.gold.dark]}
                    style={styles.restartGradient}
                  >
                    <MaterialCommunityIcons name="restart" size={24} color="#fff" />
                    <Text style={styles.restartText}>شروع دوباره داستان</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Animatable.View>
            )}
          </View>

          {/* Floating Button - از فردوسی بپرس */}
          <TouchableOpacity
            style={styles.ferdowsiButton}
            onPress={() => setShowFerdowsiModal(true)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#B79452', '#8B6F47']}
              style={styles.ferdowsiButtonGradient}
            >
              <Text style={styles.ferdowsiButtonIcon}>📜</Text>
              <Text style={styles.ferdowsiButtonText}>از فردوسی بپرس</Text>
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>
      </ImageBackground>

      {/* Modal گفتگو با فردوسی */}
      <AskFerdowsiModal
        visible={showFerdowsiModal}
        onClose={() => setShowFerdowsiModal(false)}
      />
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
    paddingBottom: theme.spacing.sm,
    backgroundColor: 'rgba(10, 14, 39, 0.8)',
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: theme.borderRadius.md,
    backgroundColor: 'rgba(26, 26, 46, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.gold.dark,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: theme.typography.size.lg,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.gold.main,
    textAlign: 'center',
  },
  progressText: {
    fontSize: theme.typography.size.xs,
    color: theme.colors.text.tertiary,
    marginTop: theme.spacing.xs,
  },
  statsPanel: {
    maxHeight: height * 0.3,
    backgroundColor: 'rgba(10, 14, 39, 0.95)',
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.gold.dark,
  },
  statsPanelScroll: {
    maxHeight: height * 0.3,
  },
  dialogueContainer: {
    flex: 1,
  },
  dialogueContent: {
    paddingVertical: theme.spacing.md,
  },
  narrativeBox: {
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  narrativeGradient: {
    padding: theme.spacing.md,
    borderWidth: 2,
    borderColor: theme.colors.gold.dark,
    borderRadius: theme.borderRadius.lg,
  },
  narrativeText: {
    fontSize: theme.typography.size.md,
    lineHeight: theme.typography.size.md * theme.typography.lineHeight.relaxed,
    color: theme.colors.text.secondary,
    textAlign: 'right',
    writingDirection: 'rtl',
    fontStyle: 'italic',
  },
  endingBadge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.xl,
    gap: theme.spacing.md,
    ...theme.shadows.xl,
  },
  endingText: {
    fontSize: theme.typography.size.xxl,
    fontWeight: theme.typography.weight.extrabold,
    color: '#fff',
  },
  choicesContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    backgroundColor: 'rgba(10, 14, 39, 0.8)',
  },
  choicesScrollView: {
    maxHeight: height * 0.28,
  },
  choicesContent: {
    paddingVertical: theme.spacing.sm,
  },
  choiceButton: {
    marginVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  choiceButtonDisabled: {
    opacity: 0.5,
  },
  choiceGradient: {
    padding: theme.spacing.md,
    borderWidth: 2,
    borderColor: theme.colors.gold.dark,
    borderRadius: theme.borderRadius.lg,
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
  choiceTextDisabled: {
    color: theme.colors.text.disabled,
  },
  consequenceText: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.text.tertiary,
    textAlign: 'right',
    writingDirection: 'rtl',
    marginTop: theme.spacing.xs,
    fontStyle: 'italic',
  },
  effectsContainer: {
    marginTop: theme.spacing.sm,
    gap: theme.spacing.xs,
  },
  effectRow: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
  },
  effectBadge: {
    backgroundColor: 'rgba(243, 156, 18, 0.2)',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.gold.dark,
  },
  effectText: {
    fontSize: theme.typography.size.xs,
    color: theme.colors.gold.main,
    fontWeight: theme.typography.weight.semibold,
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
  aiToolsContainer: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
  aiToolsTitle: {
    fontSize: theme.typography.size.md,
    fontWeight: theme.typography.weight.semibold,
    color: theme.colors.gold.main,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  aiButtonsRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    flexWrap: 'wrap',
  },
  aiButton: {
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  aiButtonGradient: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.xs,
    minWidth: 100,
  },
  aiButtonText: {
    fontSize: theme.typography.size.sm,
    fontWeight: theme.typography.weight.semibold,
    color: '#fff',
  },
  ferdowsiButton: {
    position: 'absolute',
    bottom: theme.spacing.xl,
    left: theme.spacing.md,
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    ...theme.shadows.lg,
  },
  ferdowsiButtonGradient: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  ferdowsiButtonIcon: {
    fontSize: 24,
  },
  ferdowsiButtonText: {
    fontSize: theme.typography.size.md,
    fontWeight: theme.typography.weight.bold,
    color: '#fff',
  },
});

export default StoryScreen;
