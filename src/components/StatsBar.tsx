/**
 * نوار نمایش آمار بازیکن (شرافت، شجاعت، خرد، شهرت)
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
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

const StatItem: React.FC<StatItemProps> = ({ icon, label, value, color, compact }) => (
  <View style={compact ? styles.statItemCompact : styles.statItem}>
    <View style={styles.statHeader}>
      <MaterialCommunityIcons name={icon} size={compact ? 16 : 20} color={color} />
      {!compact && (
        <Text style={styles.statLabel}>{label}</Text>
      )}
    </View>
    <View style={styles.statBarContainer}>
      <LinearGradient
        colors={[color + '33', color + '66']}
        style={styles.statBarBackground}
      >
        <LinearGradient
          colors={[color, color + 'CC']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.statBarFill, { width: `${value}%` }]}
        />
      </LinearGradient>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  </View>
);

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
              name="chart-bar"
              size={20}
              color={theme.colors.gold.main}
            />
            <Text style={styles.title}>آمار شخصیت</Text>
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
    gap: theme.spacing.md,
  },
  statsGridCompact: {
    gap: theme.spacing.xs,
  },
  statItem: {
    marginBottom: theme.spacing.sm,
  },
  statItemCompact: {
    marginBottom: theme.spacing.xs,
  },
  statHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
    gap: theme.spacing.sm,
  },
  statLabel: {
    fontSize: theme.typography.size.md,
    fontWeight: theme.typography.weight.semibold,
    color: theme.colors.text.primary,
  },
  statBarContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  statBarBackground: {
    flex: 1,
    height: 24,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(243, 156, 18, 0.3)',
  },
  statBarFill: {
    height: '100%',
    borderRadius: theme.borderRadius.md,
    minWidth: 2,
  },
  statValue: {
    fontSize: theme.typography.size.sm,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.text.primary,
    minWidth: 30,
    textAlign: 'left',
  },
});

export default StatsBar;
