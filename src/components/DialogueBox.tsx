/**
 * کامپوننت نمایش گفتگو با تصویر شخصیت (مثل Scriptic)
 */

import React from "react";
import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Animatable from "react-native-animatable";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { DialogueLine, CharacterId } from "../types";
import { images } from "../assets/images";
import { theme } from "../theme";

const { width } = Dimensions.get("window");

interface Props {
  dialogue: DialogueLine;
  characterName: string;
  delay?: number;
}

const DialogueBox: React.FC<Props> = ({ dialogue, characterName, delay = 0 }) => {
  const isPlayer = dialogue.speaker === "player";
  const isNarrator = dialogue.speaker === "narrator";

  // انتخاب تصویر شخصیت
  const getCharacterImage = () => {
    if (isPlayer) {
      return null; // بازیکن تصویر ندارد
    }
    if (isNarrator) {
      return images.characters.narrator;
    }
    // @ts-ignore
    return images.characters[dialogue.speaker] || images.characters.default;
  };

  // انتخاب آیکون احساس
  const getEmotionIcon = () => {
    switch (dialogue.emotion) {
      case "happy":
        return "emoticon-happy";
      case "sad":
        return "emoticon-sad";
      case "angry":
        return "emoticon-angry";
      case "surprised":
        return "emoticon-excited";
      case "worried":
        return "emoticon-neutral";
      default:
        return "emoticon";
    }
  };

  // رنگ بر اساس احساس
  const getEmotionColor = () => {
    switch (dialogue.emotion) {
      case "happy":
        return theme.colors.status.success;
      case "sad":
        return "#5DADE2";
      case "angry":
        return theme.colors.status.error;
      case "surprised":
        return theme.colors.gold.main;
      case "worried":
        return theme.colors.status.warning;
      default:
        return theme.colors.text.secondary;
    }
  };

  const characterImage = getCharacterImage();

  if (isNarrator) {
    // استایل خاص برای راوی
    return (
      <Animatable.View animation="fadeIn" delay={delay} duration={600} style={styles.narratorContainer}>
        <LinearGradient
          colors={["rgba(26, 26, 46, 0.7)", "rgba(31, 43, 77, 0.7)"]}
          style={styles.narratorBox}
        >
          <MaterialCommunityIcons
            name="book-open-variant"
            size={20}
            color={theme.colors.gold.main}
            style={styles.narratorIcon}
          />
          <Text style={styles.narratorText}>{dialogue.text}</Text>
        </LinearGradient>
      </Animatable.View>
    );
  }

  return (
    <Animatable.View
      animation={isPlayer ? "fadeInLeft" : "fadeInRight"}
      delay={delay}
      duration={600}
      style={[styles.dialogueContainer, isPlayer ? styles.playerContainer : styles.npcContainer]}
    >
      {/* تصویر شخصیت */}
      {!isPlayer && characterImage && (
        <Animatable.View animation="bounceIn" delay={delay + 200} style={styles.avatarContainer}>
          <Image source={characterImage} style={styles.avatar} resizeMode="cover" />
          {dialogue.emotion && (
            <View style={[styles.emotionBadge, { backgroundColor: getEmotionColor() }]}>
              <MaterialCommunityIcons name={getEmotionIcon()} size={16} color="#fff" />
            </View>
          )}
        </Animatable.View>
      )}

      {/* باکس گفتگو */}
      <View style={styles.dialogueContent}>
        {/* نام شخصیت */}
        <Text style={[styles.characterName, isPlayer && styles.playerName]}>
          {isPlayer ? "شما" : characterName}
        </Text>

        {/* متن گفتگو */}
        <LinearGradient
          colors={
            isPlayer
              ? [theme.colors.primary.light, theme.colors.primary.main]
              : ["rgba(26, 26, 46, 0.95)", "rgba(31, 43, 77, 0.95)"]
          }
          style={styles.dialogueBubble}
        >
          <Text style={styles.dialogueText}>{dialogue.text}</Text>
        </LinearGradient>
      </View>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  dialogueContainer: {
    flexDirection: "row-reverse",
    marginVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    alignItems: "flex-end",
  },
  playerContainer: {
    flexDirection: "row",
  },
  npcContainer: {
    flexDirection: "row-reverse",
  },
  avatarContainer: {
    position: "relative",
    marginHorizontal: theme.spacing.sm,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: theme.colors.gold.main,
    backgroundColor: theme.colors.background.secondary,
  },
  emotionBadge: {
    position: "absolute",
    bottom: -5,
    right: -5,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  dialogueContent: {
    flex: 1,
    maxWidth: width * 0.7,
  },
  characterName: {
    fontSize: theme.typography.size.sm,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.gold.main,
    marginBottom: theme.spacing.xs,
    textAlign: "right",
  },
  playerName: {
    textAlign: "left",
    color: theme.colors.primary.lighter,
  },
  dialogueBubble: {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    borderColor: theme.colors.gold.dark,
    ...theme.shadows.md,
  },
  dialogueText: {
    direction: "rtl",
    fontSize: theme.typography.size.md,
    lineHeight: theme.typography.size.md * theme.typography.lineHeight.normal,
    color: theme.colors.text.primary,
    textAlign: "right",
    writingDirection: "rtl",
  },
  narratorContainer: {
    marginVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  narratorBox: {
    flexDirection: "row-reverse",
    alignItems: "center",
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.gold.main,
  },
  narratorIcon: {
    marginLeft: theme.spacing.sm,
  },
  narratorText: {
    flex: 1,
    fontSize: theme.typography.size.md,
    fontStyle: "italic",
    color: theme.colors.text.secondary,
    textAlign: "right",
    writingDirection: "rtl",
  },
});

export default DialogueBox;
