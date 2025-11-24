/**
 * نوار نمایش آمار بازیکن (شرافت، شجاعت، خرد، شهرت) - نسخه کیفی
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { PlayerStats } from '../types';
import { theme } from '../theme';

interface Props {
  stats: PlayerStats;
  compact?: boolean;
}

interface StatItemProps {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  value: number;
  color: string;
  compact?: boolean;
}

// تبدیل عدد به توصیف کیفی
const getQualitativeDescription = (value: number): { text: string; color: string } => {
  if (value >= 81) return { text: 'عالی', color: '#27AE60' };
  if (value >= 61) return { text: 'خوب', color: '#2ECC71' };
  if (value >= 41) return { text: 'متوسط', color: '#F39C12' };
  if (value >= 21) return { text: 'ضعیف', color: '#E67E22' };
  return { text: 'بسیار ضعیف', color: '#E74C3C' };
};

const StatItem: React.FC<StatItemProps> = ({ icon, label, value, color, compact }) => {
  const qualitative = getQualitativeDescription(value);

  return (
    <View style={compact ? styles.statItemCompact : styles.statItem}>
      <View style={styles.statRow}>
        <Text style={[styles.statQuality, { color: qualitative.color }]}>
          {qualitative.text}
        </Text>
        <View style={styles.statLabelRow}>
          <Text style={styles.statLabel}>{label}</Text>
          <MaterialCommunityIcons name={icon} size={18} color={color} />
        </View>
      </View>
    </View>
  );
};

const StatsBar: React.FC<Props> = ({ stats, compact = false }) => {
  return (
    <View style={compact ? styles.containerCompact : styles.container}>
      <LinearGradient
        colors={['rgba(26, 26, 46, 0.9)', 'rgba(31, 43, 77, 0.9)']}
        style={compact ? styles.gradientCompact : styles.gradient}
      >
        {!compact && (
          <View style={styles.headerRow}>
            <MaterialCommunityIcons
              name="account-star"
              size={20}
              color={theme.colors.gold.main}
            />
            <Text style={styles.title}>ویژگی‌های شخصیت</Text>
          </View>
        )}

        <View style={compact ? styles.statsGridCompact : styles.statsGrid}>
          <StatItem
            icon="shield-star"
            label="شرافت"
            value={stats.honor}
            color={theme.colors.gold.main}
            compact={compact}
          />
          <StatItem
            icon="sword-cross"
            label="شجاعت"
            value={stats.courage}
            color={theme.colors.status.error}
            compact={compact}
          />
          <StatItem
            icon="brain"
            label="خرد"
            value={stats.wisdom}
            color="#3498DB"
            compact={compact}
          />
          <StatItem
            icon="trophy"
            label="شهرت"
            value={stats.fame}
            color={theme.colors.status.success}
            compact={compact}
          />
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
  title: {
    fontSize: theme.typography.size.lg,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.text.primary,
  },
  statsGrid: {
    gap: theme.spacing.sm,
  },
  statsGridCompact: {
    gap: theme.spacing.xs,
  },
  statItem: {
    paddingVertical: theme.spacing.xs,
  },
  statItemCompact: {
    paddingVertical: 4,
  },
  statRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statLabelRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  statLabel: {
    fontSize: 15,
    fontWeight: theme.typography.weight.medium,
    color: theme.colors.text.primary,
  },
  statQuality: {
    fontSize: 14,
    fontWeight: theme.typography.weight.semibold,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});

export default StatsBar;
