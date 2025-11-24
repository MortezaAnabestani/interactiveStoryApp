/**
 * Modal گفتگو با فردوسی - نسخه بازنویسی شده
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../theme';
import { aiService } from '../services/AIService';

interface Message {
  id: string;
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
      id: '0',
      role: 'assistant',
      content: 'سلام! من فردوسی هستم، نویسنده شاهنامه. از من در مورد داستان رستم و سهراب، مفاهیم شاهنامه، یا جهان‌بینی من بپرس. 📜',
      timestamp: Date.now(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // Auto-scroll to bottom when new message arrives
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  const sendMessage = async () => {
    const trimmedText = inputText.trim();

    if (!trimmedText || isLoading) {
      return;
    }

    // Create user message
    const userMsg: Message = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: trimmedText,
      timestamp: Date.now(),
    };

    // Add user message to chat
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      // Prepare conversation history (exclude the welcome message)
      const history = messages
        .filter(msg => msg.id !== '0')
        .map(msg => ({
          role: msg.role === 'user' ? ('user' as const) : ('assistant' as const),
          content: msg.content,
        }));

      // Call AI
      const response = await aiService.askFerdowsi(trimmedText, history);

      if (!response || response.trim().length === 0) {
        throw new Error('پاسخ دریافتی خالی است');
      }

      // Create assistant message
      const assistantMsg: Message = {
        id: `assistant_${Date.now()}`,
        role: 'assistant',
        content: response.trim(),
        timestamp: Date.now(),
      };

      // Add assistant message to chat
      setMessages(prev => [...prev, assistantMsg]);

    } catch (error: any) {
      console.error('❌ خطا در ارسال پیام:', error);

      // Show error message in chat
      const errorMsg: Message = {
        id: `error_${Date.now()}`,
        role: 'assistant',
        content: `⚠️ متأسفانه خطایی رخ داد:\n${error.message || 'خطای ناشناخته'}`,
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, errorMsg]);
      Alert.alert('خطا', error.message || 'خطا در ارتباط با AI');
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: '0',
        role: 'assistant',
        content: 'گفتگو پاک شد. سوال جدیدت را بپرس! 📜',
        timestamp: Date.now(),
      },
    ]);
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.role === 'user';

    return (
      <View style={[styles.messageRow, isUser ? styles.userRow : styles.assistantRow]}>
        {/* Avatar for assistant */}
        {!isUser && (
          <View style={styles.avatar}>
            <Text style={styles.avatarEmoji}>👨🏼‍🦳</Text>
          </View>
        )}

        {/* Message bubble */}
        <View style={[styles.bubble, isUser ? styles.userBubble : styles.assistantBubble]}>
          <Text style={styles.messageText}>{item.content}</Text>
        </View>

        {/* Spacer for user messages */}
        {isUser && <View style={styles.avatarSpacer} />}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <LinearGradient colors={['#0A0E27', '#16213E']} style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardView}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.headerButton} onPress={onClose}>
              <MaterialCommunityIcons name="close" size={24} color="#fff" />
            </TouchableOpacity>

            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle}>📜 از فردوسی بپرس</Text>
              <Text style={styles.headerSubtitle}>مشاور هوشمند شاهنامه</Text>
            </View>

            <TouchableOpacity style={styles.headerButton} onPress={clearChat}>
              <MaterialCommunityIcons name="broom" size={22} color={theme.colors.text.secondary} />
            </TouchableOpacity>
          </View>

          {/* Messages List */}
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={item => item.id}
            style={styles.messagesList}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
          />

          {/* Loading indicator */}
          {isLoading && (
            <View style={styles.loadingRow}>
              <ActivityIndicator size="small" color={theme.colors.gold.main} />
              <Text style={styles.loadingText}>فردوسی در حال پاسخ...</Text>
            </View>
          )}

          {/* Input area */}
          <View style={styles.inputArea}>
            <TouchableOpacity
              style={[styles.sendButton, (!inputText.trim() || isLoading) && styles.sendButtonDisabled]}
              onPress={sendMessage}
              disabled={!inputText.trim() || isLoading}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name="send"
                size={22}
                color={!inputText.trim() || isLoading ? '#666' : theme.colors.gold.main}
              />
            </TouchableOpacity>

            <TextInput
              style={styles.textInput}
              placeholder="سوالت را بپرس..."
              placeholderTextColor="#666"
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={sendMessage}
              multiline
              maxLength={500}
              editable={!isLoading}
              returnKeyType="send"
              blurOnSubmit={false}
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
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gold.dark,
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.gold.main,
  },
  headerSubtitle: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 12,
    gap: 8,
  },
  messageRow: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-end',
    marginVertical: 4,
  },
  userRow: {
    justifyContent: 'flex-start',
  },
  assistantRow: {
    justifyContent: 'flex-end',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.gold.dark,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  avatarEmoji: {
    fontSize: 20,
  },
  avatarSpacer: {
    width: 36,
    marginRight: 8,
  },
  bubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: 'rgba(52, 152, 219, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(52, 152, 219, 0.4)',
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: 'rgba(183, 148, 82, 0.2)',
    borderWidth: 1,
    borderColor: theme.colors.gold.dark,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
    color: theme.colors.text.primary,
    textAlign: 'right',
  },
  loadingRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  loadingText: {
    fontSize: 13,
    color: theme.colors.text.secondary,
    fontStyle: 'italic',
  },
  inputArea: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-end',
    gap: 8,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: theme.colors.gold.dark,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  textInput: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: theme.colors.gold.dark,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: '#fff',
    textAlign: 'right',
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(183, 148, 82, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.gold.dark,
  },
  sendButtonDisabled: {
    opacity: 0.4,
  },
});

export default AskFerdowsiModal;
