import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  I18nManager
} from 'react-native';
import { useStory } from '../context/StoryContext';
import { ChoiceButton } from './ChoiceButton';

// فعال‌سازی RTL
I18nManager.forceRTL(true);
I18nManager.allowRTL(true);

export const StoryScreen: React.FC = () => {
  const { currentNode, gameState, makeChoice, resetStory } = useStory();

  const renderEnding = () => {
    let endingColor = '#3498db';
    let endingIcon = '✨';
    let endingText = 'پایان';

    if (currentNode.endingType === 'good') {
      endingColor = '#27ae60';
      endingIcon = '🌟';
      endingText = 'پایان خوش';
    } else if (currentNode.endingType === 'bad') {
      endingColor = '#e74c3c';
      endingIcon = '💔';
      endingText = 'پایان تلخ';
    }

    return (
      <View style={[styles.endingBadge, { backgroundColor: endingColor }]}>
        <Text style={styles.endingText}>{endingIcon} {endingText}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>رستم و سهراب</Text>
        <Text style={styles.headerSubtitle}>داستان تعاملی شاهنامه</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.storyCard}>
          <Text style={styles.title}>{currentNode.title}</Text>

          <View style={styles.divider} />

          <Text style={styles.storyText}>{currentNode.text}</Text>

          {currentNode.isEnding && renderEnding()}
        </View>

        {currentNode.choices.length > 0 && (
          <View style={styles.choicesContainer}>
            <Text style={styles.choicesTitle}>انتخاب‌های شما:</Text>
            {currentNode.choices.map((choice, index) => (
              <ChoiceButton
                key={choice.id}
                choice={choice}
                index={index}
                onPress={() => makeChoice(choice.id, choice.nextNodeId)}
              />
            ))}
          </View>
        )}

        {currentNode.isEnding && (
          <TouchableOpacity style={styles.resetButton} onPress={resetStory}>
            <Text style={styles.resetButtonText}>🔄 شروع دوباره داستان</Text>
          </TouchableOpacity>
        )}

        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            گره‌های بازدید شده: {gameState.visitedNodes.length}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1e',
  },
  header: {
    backgroundColor: '#1a1a2e',
    padding: 20,
    borderBottomWidth: 3,
    borderBottomColor: '#f39c12',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#f39c12',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#bbb',
    marginTop: 4,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  storyCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#2d3561',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f39c12',
    textAlign: 'center',
    marginBottom: 12,
  },
  divider: {
    height: 2,
    backgroundColor: '#2d3561',
    marginVertical: 12,
  },
  storyText: {
    fontSize: 17,
    color: '#e0e0e0',
    textAlign: 'right',
    lineHeight: 30,
    fontFamily: 'System',
  },
  endingBadge: {
    marginTop: 20,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  endingText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  choicesContainer: {
    marginBottom: 20,
  },
  choicesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f39c12',
    textAlign: 'right',
    marginBottom: 12,
  },
  resetButton: {
    backgroundColor: '#e74c3c',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  progressText: {
    color: '#888',
    fontSize: 14,
  },
});
