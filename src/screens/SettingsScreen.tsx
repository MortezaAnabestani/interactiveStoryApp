/**
 * صفحه تنظیمات
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { theme } from '../theme';

type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Settings'>;

interface Props {
  navigation: SettingsScreenNavigationProp;
}

const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <LinearGradient
      colors={[
        theme.colors.background.gradient.start,
        theme.colors.background.gradient.middle,
        theme.colors.background.gradient.end,
      ]}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons
            name="arrow-right"
            size={28}
            color={theme.colors.gold.main}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>تنظیمات</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>درباره اپلیکیشن</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>نام: رستم و سهراب</Text>
            <Text style={styles.infoText}>نسخه: 1.0.0</Text>
            <Text style={styles.infoText}>
              داستانی تعاملی بر اساس شاهنامه فردوسی
            </Text>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.xxl,
    paddingBottom: theme.spacing.lg,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: theme.typography.size.xxl,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.gold.main,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.typography.size.lg,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.gold.main,
    marginBottom: theme.spacing.md,
    textAlign: 'right',
  },
  infoCard: {
    backgroundColor: theme.colors.background.card,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.gold.dark,
  },
  infoText: {
    fontSize: theme.typography.size.md,
    color: theme.colors.text.secondary,
    marginVertical: theme.spacing.xs,
    textAlign: 'right',
  },
});

export default SettingsScreen;
