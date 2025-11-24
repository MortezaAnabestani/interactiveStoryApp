/**
 * نوار نمایش آمار بازیکن (شرافت، شجاعت، خرد، شهرت) - نسخه کیفی و حرفه‌ای
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { PlayerStats } from '../types';

interface Props {
  stats: PlayerStats;
  compact?: boolean;
}

interface StatItemProps {
  icon: any;
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
              color="#b79452"
            />
            <Text style={styles.title}>ویژگی‌های شخصیت</Text>
          </View>
        )}

        <View style={compact ? styles.statsGridCompact : styles.statsGrid}>
          <StatItem
            icon="shield-star"
            label="شرافت"
            value={stats.honor}
            color="#b79452"
            compact={compact}
          />
          <StatItem
            icon="sword-cross"
            label="شجاعت"
            value={stats.courage}
            color="#E74C3C"
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
            color="#27AE60"
            compact={compact}
          />
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  containerCompact: {
    marginHorizontal: 8,
    marginVertical: 4,
    borderRadius: 8,
    overflow: 'hidden',
  },
  gradient: {
    padding: 16,
    borderWidth: 2,
    borderColor: '#b79452',
    borderRadius: 12,
  },
  gradientCompact: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#b79452',
    borderRadius: 8,
  },
  headerRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  statsGrid: {
    gap: 8,
  },
  statsGridCompact: {
    gap: 4,
  },
  statItem: {
    paddingVertical: 8,
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
    gap: 8,
  },
  statLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  statQuality: {
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});

export default StatsBar;
