/**
 * صفحه تنظیمات AI
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { theme } from '../theme';
import { aiService, AIConfig } from '../services/AIService';

type AISettingsNavigationProp = StackNavigationProp<RootStackParamList, 'Settings'>;

interface Props {
  navigation: AISettingsNavigationProp;
}

const AISettingsScreen: React.FC<Props> = ({ navigation }) => {
  const [config, setConfig] = useState<AIConfig>({
    apiKey: '',
    apiUrl: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-3.5-turbo',
    enabled: false,
  });
  const [showApiKey, setShowApiKey] = useState(false);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    const loaded = await aiService.loadConfig();
    setConfig(loaded);
  };

  const handleSave = async () => {
    try {
      await aiService.saveConfig(config);
      Alert.alert('✅ موفق', 'تنظیمات AI ذخیره شد');
    } catch (error) {
      Alert.alert('❌ خطا', 'خطا در ذخیره تنظیمات');
    }
  };

  const handleTest = async () => {
    if (!config.apiKey) {
      Alert.alert('⚠️ هشدار', 'لطفاً ابتدا API Key را وارد کنید');
      return;
    }

    setTesting(true);
    try {
      await aiService.saveConfig({ ...config, enabled: true });
      const response = await aiService.callAI([
        {
          role: 'user',
          content: 'سلام! لطفاً یک جمله کوتاه فارسی بنویس.',
        },
      ]);

      Alert.alert('✅ موفق', `اتصال به AI برقرار شد!\n\nپاسخ: ${response}`);
    } catch (error: any) {
      Alert.alert('❌ خطا', `خطا در اتصال:\n${error.message}`);
    } finally {
      setTesting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['rgba(10, 14, 39, 0.95)', 'rgba(16, 33, 62, 0.95)']}
        style={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialCommunityIcons name="arrow-right" size={24} color={theme.colors.gold.main} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>تنظیمات هوش مصنوعی</Text>
          <View style={styles.backButton} />
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <MaterialCommunityIcons
            name="robot"
            size={40}
            color={theme.colors.gold.main}
          />
          <Text style={styles.infoTitle}>قابلیت‌های AI</Text>
          <Text style={styles.infoText}>
            با فعال کردن AI، می‌توانید از قابلیت‌های زیر استفاده کنید:
          </Text>
          <View style={styles.featuresList}>
            <Text style={styles.featureItem}>🎮 تولید داستان پویا</Text>
            <Text style={styles.featureItem}>💬 دیالوگ‌های هوشمند</Text>
            <Text style={styles.featureItem}>💡 راهنما و پیشنهاد</Text>
            <Text style={styles.featureItem}>📖 خلاصه داستان</Text>
            <Text style={styles.featureItem}>🎭 شخصیت‌سازی جدید</Text>
          </View>
        </View>

        {/* Enable AI */}
        <View style={styles.section}>
          <View style={styles.switchRow}>
            <View style={styles.switchInfo}>
              <Text style={styles.switchLabel}>فعال‌سازی AI</Text>
              <Text style={styles.switchDescription}>
                برای استفاده از قابلیت‌های هوش مصنوعی
              </Text>
            </View>
            <Switch
              value={config.enabled}
              onValueChange={(value) => setConfig({ ...config, enabled: value })}
              trackColor={{ false: '#767577', true: theme.colors.gold.main }}
              thumbColor={config.enabled ? theme.colors.gold.light : '#f4f3f4'}
            />
          </View>
        </View>

        {/* API Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>تنظیمات API</Text>

          {/* API Key */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>API Key</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={[styles.input, styles.inputWithIcon]}
                value={config.apiKey}
                onChangeText={(text) => setConfig({ ...config, apiKey: text })}
                placeholder="sk-..."
                placeholderTextColor={theme.colors.text.disabled}
                secureTextEntry={!showApiKey}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowApiKey(!showApiKey)}
              >
                <MaterialCommunityIcons
                  name={showApiKey ? 'eye-off' : 'eye'}
                  size={24}
                  color={theme.colors.text.secondary}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.inputHint}>
              برای دریافت API Key به openai.com مراجعه کنید
            </Text>
          </View>

          {/* API URL */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>API URL</Text>
            <TextInput
              style={styles.input}
              value={config.apiUrl}
              onChangeText={(text) => setConfig({ ...config, apiUrl: text })}
              placeholder="https://api.openai.com/v1/chat/completions"
              placeholderTextColor={theme.colors.text.disabled}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Text style={styles.inputHint}>
              می‌توانید از APIهای سازگار با OpenAI استفاده کنید
            </Text>
          </View>

          {/* Model */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>مدل</Text>
            <TextInput
              style={styles.input}
              value={config.model}
              onChangeText={(text) => setConfig({ ...config, model: text })}
              placeholder="gpt-3.5-turbo"
              placeholderTextColor={theme.colors.text.disabled}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Text style={styles.inputHint}>
              مثال: gpt-3.5-turbo, gpt-4, claude-3-sonnet
            </Text>
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.button, styles.testButton]}
            onPress={handleTest}
            disabled={testing}
          >
            <LinearGradient
              colors={['#3498DB', '#2980B9']}
              style={styles.buttonGradient}
            >
              <MaterialCommunityIcons
                name="test-tube"
                size={20}
                color="#fff"
              />
              <Text style={styles.buttonText}>
                {testing ? 'در حال تست...' : 'تست اتصال'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <LinearGradient
              colors={[theme.colors.status.success, '#27AE60']}
              style={styles.buttonGradient}
            >
              <MaterialCommunityIcons name="content-save" size={20} color="#fff" />
              <Text style={styles.buttonText}>ذخیره تنظیمات</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Help Text */}
        <View style={styles.helpBox}>
          <MaterialCommunityIcons
            name="information"
            size={20}
            color={theme.colors.text.secondary}
          />
          <Text style={styles.helpText}>
            برای استفاده از قابلیت‌های AI، ابتدا API Key خود را وارد کنید و تنظیمات را ذخیره کنید.
            سپس می‌توانید در حین بازی از دکمه‌های AI در صفحه داستان استفاده کنید.
          </Text>
        </View>
      </LinearGradient>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  header: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: theme.borderRadius.md,
    backgroundColor: 'rgba(26, 26, 46, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: theme.typography.size.xxl,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.gold.main,
  },
  infoBox: {
    backgroundColor: 'rgba(26, 26, 46, 0.8)',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    borderColor: theme.colors.gold.dark,
    marginBottom: theme.spacing.lg,
    alignItems: 'center',
  },
  infoTitle: {
    fontSize: theme.typography.size.xl,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  infoText: {
    fontSize: theme.typography.size.md,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  featuresList: {
    width: '100%',
    gap: theme.spacing.xs,
  },
  featureItem: {
    fontSize: theme.typography.size.md,
    color: theme.colors.text.primary,
    textAlign: 'right',
    paddingVertical: theme.spacing.xs,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.size.lg,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.gold.main,
    marginBottom: theme.spacing.md,
    textAlign: 'right',
  },
  switchRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(26, 26, 46, 0.6)',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.gold.dark,
  },
  switchInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  switchLabel: {
    fontSize: theme.typography.size.lg,
    fontWeight: theme.typography.weight.semibold,
    color: theme.colors.text.primary,
    textAlign: 'right',
  },
  switchDescription: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.text.secondary,
    textAlign: 'right',
    marginTop: theme.spacing.xs,
  },
  inputGroup: {
    marginBottom: theme.spacing.md,
  },
  inputLabel: {
    fontSize: theme.typography.size.md,
    fontWeight: theme.typography.weight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
    textAlign: 'right',
  },
  inputRow: {
    position: 'relative',
  },
  input: {
    backgroundColor: 'rgba(26, 26, 46, 0.6)',
    borderWidth: 1,
    borderColor: theme.colors.gold.dark,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.typography.size.md,
    color: theme.colors.text.primary,
    textAlign: 'left',
  },
  inputWithIcon: {
    paddingRight: 50,
  },
  eyeButton: {
    position: 'absolute',
    right: theme.spacing.md,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  inputHint: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.text.tertiary,
    marginTop: theme.spacing.xs,
    textAlign: 'right',
  },
  buttonsContainer: {
    gap: theme.spacing.md,
    marginVertical: theme.spacing.lg,
  },
  button: {
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  testButton: {
    // Specific styles for test button if needed
  },
  buttonGradient: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  buttonText: {
    fontSize: theme.typography.size.lg,
    fontWeight: theme.typography.weight.bold,
    color: '#fff',
  },
  helpBox: {
    flexDirection: 'row-reverse',
    backgroundColor: 'rgba(52, 152, 219, 0.1)',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(52, 152, 219, 0.3)',
    gap: theme.spacing.sm,
  },
  helpText: {
    flex: 1,
    fontSize: theme.typography.size.sm,
    color: theme.colors.text.secondary,
    textAlign: 'right',
    lineHeight: theme.typography.size.sm * 1.5,
  },
});

export default AISettingsScreen;
