/**
 * صفحه داستان - نسخه بازی‌وار با گفتگوها و آمار
 */

import React, { useState, useEffect, useCallback } from "react";
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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Animatable from "react-native-animatable";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useFocusEffect } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/types";
import { theme } from "../theme";
import { useStory } from "../context/StoryContext";
import { images } from "../assets/images";
import { soundManager } from "../assets/sounds";
import { aiService } from "../services/AIService";
import StatsBar from "../components/StatsBar";
import RelationshipBar from "../components/RelationshipBar";
import AskFerdowsiModal from "../components/AskFerdowsiModal";

const { width, height } = Dimensions.get("window");

type StoryScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Story">;

interface Props {
  navigation: StoryScreenNavigationProp;
}

const StoryScreen: React.FC<Props> = ({ navigation }) => {
  const {
    currentNode,
    makeChoice,
    resetStory,
    gameState,
  } = useStory();

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

  useFocusEffect(
    useCallback(() => {
      checkAIEnabled();
    }, [])
  );

  const checkAIEnabled = async () => {
    const config = await aiService.loadConfig();
    setAiEnabled(config.enabled);
  };

  const handleChoice = async (choiceId: string, nextNodeId: string) => {
    soundManager.playSfx("choice");
    setShowChoices(false);
    setShowDialogues(false);
    makeChoice(choiceId, nextNodeId);
  };

  const handleRestart = () => {
    Alert.alert("شروع دوباره", "آیا می‌خواهید داستان را از ابتدا شروع کنید؟", [
      { text: "انصراف", style: "cancel" },
      {
        text: "بله",
        onPress: () => {
          resetStory();
          soundManager.playSfx("success");
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={images.storyBackground} style={styles.background} resizeMode="cover">
        <LinearGradient
          colors={["rgba(10, 14, 39, 0.85)", "rgba(22, 33, 62, 0.85)", "rgba(10, 14, 39, 0.85)"]}
          style={styles.overlay}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.menuButton} onPress={() => setShowStats(!showStats)}>
              <MaterialCommunityIcons name={showStats ? "close" : "menu"} size={24} color={theme.colors.gold.main} />
            </TouchableOpacity>
            <Text style={styles.chapterTitle}>{currentNode.chapter || "داستان رستم و سهراب"}</Text>
            <TouchableOpacity style={styles.menuButton} onPress={handleRestart}>
              <MaterialCommunityIcons name="restart" size={24} color={theme.colors.gold.main} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
            {/* Story Title */}
            {showDialogues && (
              <Animatable.View animation="fadeInDown" duration={800}>
                <Text style={styles.storyTitle}>{currentNode.title}</Text>
              </Animatable.View>
            )}

            {/* Dialogues - ساده شده */}
            {showDialogues && currentNode.dialogues && currentNode.dialogues.length > 0 && (
              <Animatable.View animation="fadeIn" delay={300}>
                {currentNode.dialogues.map((dialogue, index) => (
                  <View key={index} style={styles.dialogueBox}>
                    <Text style={styles.dialogueCharacter}>{dialogue.character}:</Text>
                    <Text style={styles.dialogueText}>{dialogue.text}</Text>
                  </View>
                ))}
              </Animatable.View>
            )}

            {/* Choices - ساده شده */}
            {showChoices && currentNode.choices && currentNode.choices.length > 0 && (
              <View style={styles.choicesContainer}>
                {currentNode.choices.map((choice, index) => (
                  <Animatable.View
                    key={choice.id}
                    animation="fadeInUp"
                    delay={index * 150}
                    duration={600}
                  >
                    <TouchableOpacity
                      style={styles.choiceButton}
                      onPress={() => handleChoice(choice.id, choice.nextNode)}
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={["rgba(26, 26, 46, 0.9)", "rgba(16, 16, 36, 0.9)"]}
                        style={styles.choiceGradient}
                      >
                        <View style={styles.choiceTextContainer}>
                          <Text style={styles.choiceText}>{choice.text}</Text>
                        </View>
                      </LinearGradient>
                    </TouchableOpacity>
                  </Animatable.View>
                ))}
              </View>
            )}

            {/* End Story */}
            {showChoices && (!currentNode.choices || currentNode.choices.length === 0) && (
              <Animatable.View animation="fadeInUp" duration={800} style={styles.endContainer}>
                <Text style={styles.endTitle}>پایان این بخش</Text>
                <TouchableOpacity style={styles.restartButton} onPress={handleRestart} activeOpacity={0.8}>
                  <LinearGradient
                    colors={[theme.colors.gold.light, theme.colors.gold.main, theme.colors.gold.dark]}
                    style={styles.restartGradient}
                  >
                    <MaterialCommunityIcons name="restart" size={24} color="#fff" />
                    <Text style={styles.restartText}>شروع دوباره داستان</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Animatable.View>
            )}
          </ScrollView>

          {/* Floating Button - از فردوسی بپرس (ساده و ثابت) */}
          <TouchableOpacity
            style={styles.ferdowsiButton}
            onPress={() => setShowFerdowsiModal(true)}
            activeOpacity={0.8}
          >
            <View style={styles.ferdowsiButtonGradient}>
              <Text style={styles.ferdowsiButtonIcon}>📜</Text>
              <Text style={styles.ferdowsiButtonText}>از فردوسی بپرس</Text>
            </View>
          </TouchableOpacity>
        </LinearGradient>
      </ImageBackground>

      {/* Stats Bar */}
      {showStats && (
        <Animatable.View animation="fadeInRight" duration={500} style={styles.statsPanel}>
          <StatsBar stats={gameState.stats} />
          <RelationshipBar relationships={gameState.relationships} />
        </Animatable.View>
      )}

      {/* Modal گفتگو با فردوسی */}
      <AskFerdowsiModal
        visible={showFerdowsiModal}
        onClose={() => setShowFerdowsiModal(false)}
      />

      {/* Loading Overlay */}
      {aiLoading && (
        <View style={styles.loadingOverlay}>
          <LinearGradient
            colors={["rgba(10, 14, 39, 0.95)", "rgba(22, 33, 62, 0.95)"]}
            style={styles.loadingOverlayGradient}
          >
            <Animatable.View
              animation="pulse"
              iterationCount="infinite"
              duration={1500}
              style={styles.loadingContent}
            >
              <ActivityIndicator size="large" color={theme.colors.gold.main} />
              <Text style={styles.loadingTitle}>🤖 هوش مصنوعی در حال کار است</Text>
              <Text style={styles.loadingSubtitle}>منتظر بمانید...</Text>
            </Animatable.View>
          </LinearGradient>
        </View>
      )}
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
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
  },
  header: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.xxl,
    paddingBottom: theme.spacing.sm,
    backgroundColor: "rgba(10, 14, 39, 0.8)",
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: theme.borderRadius.md,
    backgroundColor: "rgba(26, 26, 46, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.gold.dark,
  },
  chapterTitle: {
    fontSize: theme.typography.size.md,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.gold.main,
    textAlign: "center",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: theme.spacing.md,
  },
  storyTitle: {
    fontSize: theme.typography.size.xl,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.gold.light,
    textAlign: "center",
    marginBottom: theme.spacing.lg,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  dialogueBox: {
    backgroundColor: "rgba(26, 26, 46, 0.7)",
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderRightWidth: 3,
    borderRightColor: theme.colors.gold.main,
  },
  dialogueCharacter: {
    fontSize: theme.typography.size.md,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.gold.main,
    marginBottom: theme.spacing.xs,
  },
  dialogueText: {
    fontSize: theme.typography.size.md,
    color: "#e0e0e0",
    lineHeight: 24,
  },
  choicesContainer: {
    marginTop: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  choiceButton: {
    borderRadius: theme.borderRadius.lg,
    overflow: "hidden",
    ...theme.shadows.md,
  },
  choiceGradient: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.gold.dark,
  },
  choiceTextContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
  },
  choiceText: {
    fontSize: 14,
    fontWeight: theme.typography.weight.medium,
    color: "#fff",
    textAlign: "center",
    lineHeight: 20,
  },
  endContainer: {
    alignItems: "center",
    marginTop: theme.spacing.xxl,
    gap: theme.spacing.lg,
  },
  endTitle: {
    fontSize: theme.typography.size.xl,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.gold.main,
  },
  restartButton: {
    borderRadius: theme.borderRadius.xl,
    overflow: "hidden",
    ...theme.shadows.lg,
  },
  restartGradient: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    gap: theme.spacing.sm,
  },
  restartText: {
    fontSize: theme.typography.size.lg,
    fontWeight: theme.typography.weight.bold,
    color: "#fff",
  },
  ferdowsiButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    borderRadius: 20,
    overflow: "hidden",
    ...theme.shadows.md,
    elevation: 4,
  },
  ferdowsiButtonGradient: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 6,
    backgroundColor: "rgba(183, 148, 82, 0.35)",
    backdropFilter: "blur(10px)",
    borderWidth: 1,
    borderColor: "rgba(183, 148, 82, 0.5)",
  },
  ferdowsiButtonIcon: {
    fontSize: 18,
  },
  ferdowsiButtonText: {
    fontSize: 12,
    fontWeight: theme.typography.weight.semibold,
    color: "#fff",
  },
  statsPanel: {
    position: "absolute",
    top: 80,
    right: 0,
    width: width * 0.85,
    maxHeight: height * 0.7,
    backgroundColor: "rgba(10, 14, 39, 0.95)",
    borderTopLeftRadius: theme.borderRadius.xl,
    borderBottomLeftRadius: theme.borderRadius.xl,
    padding: theme.spacing.md,
    ...theme.shadows.xl,
    elevation: 10,
    zIndex: 100,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
  loadingOverlayGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContent: {
    alignItems: "center",
    gap: theme.spacing.md,
  },
  loadingTitle: {
    fontSize: theme.typography.size.lg,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.gold.main,
  },
  loadingSubtitle: {
    fontSize: theme.typography.size.sm,
    color: "#ccc",
  },
});

export default StoryScreen;
