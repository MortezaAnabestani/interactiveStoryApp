/**
 * نوار نمایش روابط با شخصیت‌ها (مثل Scriptic)
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
  // تعیین سطح رابطه
  const getRelationshipLevel = () => {
    if (value >= 80) return { label: 'عشق', icon: 'heart', color: '#E74C3C' };
    if (value >= 60) return { label: 'دوستی', icon: 'account-heart', color: '#E91E63' };
    if (value >= 40) return { label: 'خوب', icon: 'emoticon-happy', color: '#9C27B0' };
    if (value >= 20) return { label: 'خنثی', icon: 'emoticon-neutral', color: '#607D8B' };
    return { label: 'بد', icon: 'emoticon-sad', color: '#546E7A' };
  };

  const level = getRelationshipLevel();

  // @ts-ignore
  const characterImage = images.characters[character.avatar] || images.characters.default;

  return (
    <View style={compact ? styles.itemCompact : styles.item}>
      <View style={styles.itemHeader}>
        <Image
          source={characterImage}
          style={compact ? styles.avatarCompact : styles.avatar}
          resizeMode="cover"
        />
        <View style={styles.itemInfo}>
          <Text style={compact ? styles.nameCompact : styles.name}>{character.name}</Text>
          {character.title && !compact && (
            <Text style={styles.title}>{character.title}</Text>
          )}
        </View>
        <View style={[styles.levelBadge, { backgroundColor: level.color }]}>
          <MaterialCommunityIcons
            name={level.icon}
            size={compact ? 14 : 16}
            color="#fff"
          />
        </View>
      </View>

      <View style={styles.progressContainer}>
        <LinearGradient
          colors={[level.color + '33', level.color + '66']}
          style={styles.progressBackground}
        >
          <LinearGradient
            colors={[level.color, level.color + 'CC']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.progressFill, { width: `${value}%` }]}
          />
        </LinearGradient>
        <Text style={styles.valueText}>{value}</Text>
      </View>

      {!compact && (
        <Text style={styles.levelText}>{level.label}</Text>
      )}
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
              name="account-multiple-outline"
              size={20}
              color={theme.colors.gold.main}
            />
            <Text style={styles.headerTitle}>روابط</Text>
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
    gap: theme.spacing.md,
  },
  item: {
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(243, 156, 18, 0.2)',
  },
  itemCompact: {
    paddingVertical: theme.spacing.xs,
  },
  itemHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
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
  itemInfo: {
    flex: 1,
  },
  name: {
    fontSize: theme.typography.size.md,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.text.primary,
    textAlign: 'right',
  },
  nameCompact: {
    fontSize: theme.typography.size.sm,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.text.primary,
    textAlign: 'right',
  },
  title: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.text.secondary,
    textAlign: 'right',
    marginTop: 2,
  },
  levelBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  progressContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.xs,
  },
  progressBackground: {
    flex: 1,
    height: 20,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(243, 156, 18, 0.3)',
  },
  progressFill: {
    height: '100%',
    borderRadius: theme.borderRadius.md,
    minWidth: 2,
  },
  valueText: {
    fontSize: theme.typography.size.sm,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.text.primary,
    minWidth: 30,
    textAlign: 'right',
  },
  levelText: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
    fontStyle: 'italic',
  },
});

export default RelationshipBar;
