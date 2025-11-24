/**
 * نوار نمایش روابط با شخصیت‌ها - نسخه کیفی
 */

import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RelationshipStats, Character } from '../types';
import { images } from '../assets/images';
import { theme } from '../theme';

interface Props {
  relationships: RelationshipStats;
  characters: { [key: string]: Character };
  compact?: boolean;
}

interface RelationshipItemProps {
  character: Character;
  value: number;
  compact?: boolean;
}

const RelationshipItem: React.FC<RelationshipItemProps> = ({ character, value, compact }) => {
  // تعیین سطح رابطه به صورت کیفی
  const getRelationshipLevel = () => {
    if (value >= 80) return { label: 'صمیمی و نزدیک', icon: 'heart-multiple', color: '#E74C3C' };
    if (value >= 60) return { label: 'دوست خوب', icon: 'account-heart', color: '#E91E63' };
    if (value >= 40) return { label: 'رابطه خوب', icon: 'handshake', color: '#9C27B0' };
    if (value >= 20) return { label: 'آشنا', icon: 'account', color: '#607D8B' };
    if (value >= -20) return { label: 'بی‌تفاوت', icon: 'minus-circle', color: '#78909C' };
    return { label: 'رابطه بد', icon: 'close-circle', color: '#795548' };
  };

  const level = getRelationshipLevel();

  // @ts-ignore
  const characterImage = images.characters[character.avatar] || images.characters.default;

  return (
    <View style={compact ? styles.itemCompact : styles.item}>
      <View style={styles.itemRow}>
        <View style={styles.levelContainer}>
          <View style={[styles.levelBadge, { backgroundColor: level.color }]}>
            <MaterialCommunityIcons
              name={level.icon}
              size={compact ? 16 : 18}
              color="#fff"
            />
          </View>
          <Text style={[styles.levelText, { color: level.color }]}>
            {level.label}
          </Text>
        </View>

        <View style={styles.characterInfo}>
          <Text style={compact ? styles.nameCompact : styles.name}>{character.name}</Text>
          {character.title && !compact && (
            <Text style={styles.title}>{character.title}</Text>
          )}
        </View>

        <Image
          source={characterImage}
          style={compact ? styles.avatarCompact : styles.avatar}
          resizeMode="cover"
        />
      </View>
    </View>
  );
};

const RelationshipBar: React.FC<Props> = ({ relationships, characters, compact = false }) => {
  // فیلتر کردن شخصیت‌هایی که رابطه با آنها ذخیره شده
  const relevantCharacters = Object.keys(relationships)
    .filter(charId => characters[charId])
    .map(charId => ({
      character: characters[charId],
      value: relationships[charId],
    }));

  if (relevantCharacters.length === 0) {
    return null;
  }

  return (
    <View style={compact ? styles.containerCompact : styles.container}>
      <LinearGradient
        colors={['rgba(26, 26, 46, 0.9)', 'rgba(31, 43, 77, 0.9)']}
        style={compact ? styles.gradientCompact : styles.gradient}
      >
        {!compact && (
          <View style={styles.headerRow}>
            <MaterialCommunityIcons
              name="account-multiple"
              size={20}
              color={theme.colors.gold.main}
            />
            <Text style={styles.headerTitle}>روابط با شخصیت‌ها</Text>
          </View>
        )}

        <View style={styles.itemsContainer}>
          {relevantCharacters.map(({ character, value }) => (
            <RelationshipItem
              key={character.id}
              character={character}
              value={value}
              compact={compact}
            />
          ))}
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  containerCompact: {
    marginHorizontal: theme.spacing.sm,
    marginVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
  },
  gradient: {
    padding: theme.spacing.md,
    borderWidth: 2,
    borderColor: theme.colors.gold.dark,
    borderRadius: theme.borderRadius.lg,
  },
  gradientCompact: {
    padding: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.gold.dark,
    borderRadius: theme.borderRadius.md,
  },
  headerRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  headerTitle: {
    fontSize: theme.typography.size.lg,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.text.primary,
  },
  itemsContainer: {
    gap: theme.spacing.sm,
  },
  item: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  itemCompact: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  itemRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    borderWidth: 2,
    borderColor: theme.colors.gold.main,
    backgroundColor: theme.colors.background.secondary,
  },
  avatarCompact: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    borderWidth: 2,
    borderColor: theme.colors.gold.main,
    backgroundColor: theme.colors.background.secondary,
  },
  characterInfo: {
    flex: 1,
    alignItems: 'flex-end',
    paddingHorizontal: theme.spacing.sm,
  },
  name: {
    fontSize: 15,
    fontWeight: theme.typography.weight.semibold,
    color: theme.colors.text.primary,
    textAlign: 'right',
  },
  nameCompact: {
    fontSize: 14,
    fontWeight: theme.typography.weight.medium,
    color: theme.colors.text.primary,
    textAlign: 'right',
  },
  title: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    textAlign: 'right',
    marginTop: 2,
  },
  levelContainer: {
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  levelBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  levelText: {
    fontSize: 12,
    fontWeight: theme.typography.weight.semibold,
    textAlign: 'center',
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});

export default RelationshipBar;
