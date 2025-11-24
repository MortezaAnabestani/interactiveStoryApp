/**
 * نوار نمایش آمار بازیکن - نسخه ساده برای تست
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PlayerStats } from '../types';

interface Props {
  stats: PlayerStats;
  compact?: boolean;
}

const StatsBar: React.FC<Props> = ({ stats }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>آمار بازیکن</Text>
      <Text style={styles.stat}>شرافت: {stats.honor}</Text>
      <Text style={styles.stat}>شجاعت: {stats.courage}</Text>
      <Text style={styles.stat}>خرد: {stats.wisdom}</Text>
      <Text style={styles.stat}>شهرت: {stats.fame}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(26, 26, 46, 0.9)',
    padding: 16,
    borderRadius: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#b79452',
    marginBottom: 12,
    textAlign: 'center',
  },
  stat: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 8,
    textAlign: 'right',
  },
});

export default StatsBar;
