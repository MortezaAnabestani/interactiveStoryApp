/**
 * Modal گفتگو با فردوسی - مشاور هوشمند شاهنامه
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../theme';
import { aiService, AIMessage } from '../services/AIService';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface Props {
  visible: boolean;
  onClose: () => void;
}

const AskFerdowsiModal: React.FC<Props> = ({ visible, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'سلام! من فردوسی هستم، نویسنده شاهنامه. از من در مورد داستان رستم و سهراب، مفاهیم شاهنامه، یا جهان‌بینی من بپرس. در خدمت شما هستم! 📜',
      timestamp: Date.now(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSend = async () => {
    if (!inputText.trim() || loading) return;

    const userMessage: Message = {
      role: 'user',
      content: inputText.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setLoading(true);

    try {
      // تبدیل history به فرمت AI
      const conversationHistory: AIMessage[] = messages.map((msg) => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content,
      }));

      const response = await aiService.askFerdowsi(userMessage.content, conversationHistory);

      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Scroll to bottom
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error: any) {
      const errorMessage: Message = {
        role: 'assistant',
        content: `متأسفانه خطایی رخ داد: ${error.message}. لطفاً دوباره تلاش کنید.`,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        role: 'assistant',
        content: 'گفتگو پاک شد. سوال جدیدت را بپرس! 📜',
        timestamp: Date.now(),
      },
    ]);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <LinearGradient colors={['#0A0E27', '#16213E']} style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <MaterialCommunityIcons name="close" size={24} color={theme.colors.text.primary} />
            </TouchableOpacity>

            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle}>📜 از فردوسی بپرس</Text>
              <Text style={styles.headerSubtitle}>مشاور هوشمند شاهنامه</Text>
            </View>

            <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
              <MaterialCommunityIcons name="broom" size={20} color={theme.colors.text.secondary} />
            </TouchableOpacity>
          </View>

          {/* Messages */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((message, index) => (
              <Animatable.View
                key={index}
                animation="fadeInUp"
                delay={index * 100}
                style={[
                  styles.messageBubble,
                  message.role === 'user' ? styles.userBubble : styles.assistantBubble,
                ]}
              >
                {message.role === 'assistant' && (
                  <View style={styles.ferdowsiAvatar}>
                    <Text style={styles.avatarText}>👴</Text>
                  </View>
                )}
                <View style={styles.messageContent}>
                  <Text
                    style={[
                      styles.messageText,
                      message.role === 'user' ? styles.userText : styles.assistantText,
                    ]}
                  >
                    {message.content}
                  </Text>
                </View>
              </Animatable.View>
            ))}

            {loading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={theme.colors.gold.main} />
                <Text style={styles.loadingText}>فردوسی در حال نوشتن...</Text>
              </View>
            )}
          </ScrollView>

          {/* Input */}
          <View style={styles.inputContainer}>
            <TouchableOpacity
              style={[styles.sendButton, (!inputText.trim() || loading) && styles.sendButtonDisabled]}
              onPress={handleSend}
              disabled={!inputText.trim() || loading}
            >
              <MaterialCommunityIcons
                name="send"
                size={24}
                color={!inputText.trim() || loading ? theme.colors.text.tertiary : theme.colors.gold.main}
              />
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="سوالت را بپرس..."
              placeholderTextColor={theme.colors.text.tertiary}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
              editable={!loading}
            />
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.xxl,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gold.dark,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    backgroundColor: 'rgba(26, 26, 46, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: theme.typography.size.xl,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.gold.main,
  },
  headerSubtitle: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  clearButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
  messageBubble: {
    maxWidth: '85%',
    marginVertical: theme.spacing.xs,
  },
  userBubble: {
    alignSelf: 'flex-start',
  },
  assistantBubble: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
    gap: theme.spacing.sm,
  },
  ferdowsiAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.gold.dark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
  },
  messageContent: {
    flex: 1,
  },
  messageText: {
    fontSize: theme.typography.size.md,
    lineHeight: theme.typography.size.md * 1.6,
    textAlign: 'right',
  },
  userText: {
    backgroundColor: 'rgba(52, 152, 219, 0.2)',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(52, 152, 219, 0.3)',
    color: theme.colors.text.primary,
  },
  assistantText: {
    backgroundColor: 'rgba(183, 148, 82, 0.15)',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.gold.dark,
    color: theme.colors.text.primary,
  },
  loadingContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
  },
  loadingText: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.text.secondary,
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-end',
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.gold.dark,
    backgroundColor: 'rgba(26, 26, 46, 0.5)',
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(26, 26, 46, 0.7)',
    borderWidth: 1,
    borderColor: theme.colors.gold.dark,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    fontSize: theme.typography.size.md,
    color: theme.colors.text.primary,
    textAlign: 'right',
    maxHeight: 100,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: 'rgba(183, 148, 82, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.gold.dark,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});

export default AskFerdowsiModal;
