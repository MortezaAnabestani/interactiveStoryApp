import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GameState, StoryNode, GameStats, PlayerStats } from "../types";
import { rostamSohrabStory } from "../data/storyData";

interface StoryContextType {
  currentNode: StoryNode;
  gameState: GameState;
  makeChoice: (choiceId: string, nextNodeId: string) => void;
  resetStory: () => void;
  saveProgress: () => Promise<void>;
  loadProgress: () => Promise<void>;
  updateStats: (statChanges: Partial<PlayerStats>) => void;
  updateRelationship: (characterId: string, change: number) => void;
}

const StoryContext = createContext<StoryContextType | undefined>(undefined);

// مقادیر اولیه آمار بازیکن
const initialPlayerStats: PlayerStats = {
  honor: 50,
  courage: 50,
  wisdom: 50,
  fame: 50,
};

// مقادیر اولیه روابط
const initialRelationships = {
  rostam: 50,
  sohrab: 50,
  tahmineh: 50,
  kavoos: 50,
};

const initialGameStats: GameStats = {
  relationships: initialRelationships,
  playerStats: initialPlayerStats,
  achievements: [],
  itemsCollected: [],
};

export const StoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>({
    currentNodeId: rostamSohrabStory.startNodeId,
    visitedNodes: [rostamSohrabStory.startNodeId],
    choices: [],
    stats: initialGameStats,
  });

  const currentNode = rostamSohrabStory.nodes[gameState.currentNodeId];

  // به‌روزرسانی آمار
  const updateStats = (statChanges: Partial<PlayerStats>) => {
    setGameState((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        playerStats: {
          ...prev.stats.playerStats,
          honor: Math.max(0, Math.min(100, (prev.stats.playerStats.honor || 0) + (statChanges.honor || 0))),
          courage: Math.max(0, Math.min(100, (prev.stats.playerStats.courage || 0) + (statChanges.courage || 0))),
          wisdom: Math.max(0, Math.min(100, (prev.stats.playerStats.wisdom || 0) + (statChanges.wisdom || 0))),
          fame: Math.max(0, Math.min(100, (prev.stats.playerStats.fame || 0) + (statChanges.fame || 0))),
        },
      },
    }));
  };

  // به‌روزرسانی رابطه با شخصیت
  const updateRelationship = (characterId: string, change: number) => {
    setGameState((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        relationships: {
          ...prev.stats.relationships,
          [characterId]: Math.max(0, Math.min(100, (prev.stats.relationships[characterId] || 50) + change)),
        },
      },
    }));
  };

  const makeChoice = (choiceId: string, nextNodeId: string) => {
    const choice = currentNode.choices.find((c) => c.id === choiceId);

    // اعمال تأثیرات انتخاب
    if (choice) {
      // تغییرات آمار
      if (choice.statChanges) {
        updateStats(choice.statChanges);
      }

      // تغییرات روابط
      if (choice.relationshipChanges) {
        Object.entries(choice.relationshipChanges).forEach(([charId, change]) => {
          updateRelationship(charId, change);
        });
      }
    }

    // رفتن به گره بعدی
    const nextNode = rostamSohrabStory.nodes[nextNodeId];

    setGameState((prev) => {
      const newState = {
        ...prev,
        currentNodeId: nextNodeId,
        visitedNodes: [...prev.visitedNodes, nextNodeId],
        choices: [...prev.choices, { nodeId: prev.currentNodeId, choiceId }],
      };

      // اعمال تأثیرات خودکار گره
      if (nextNode.autoStatChanges) {
        const updatedStats = { ...newState.stats.playerStats };
        Object.entries(nextNode.autoStatChanges).forEach(([stat, change]) => {
          updatedStats[stat as keyof PlayerStats] = Math.max(
            0,
            Math.min(100, (updatedStats[stat as keyof PlayerStats] || 0) + (change || 0))
          );
        });
        newState.stats = { ...newState.stats, playerStats: updatedStats };
      }

      if (nextNode.autoRelationshipChanges) {
        const updatedRelationships = { ...newState.stats.relationships };
        Object.entries(nextNode.autoRelationshipChanges).forEach(([charId, change]) => {
          updatedRelationships[charId] = Math.max(
            0,
            Math.min(100, (updatedRelationships[charId] || 50) + (change || 0))
          );
        });
        newState.stats = { ...newState.stats, relationships: updatedRelationships };
      }

      // افزودن achievement اگر وجود دارد
      if (nextNode.achievementUnlocked && !newState.stats.achievements.includes(nextNode.achievementUnlocked)) {
        newState.stats = {
          ...newState.stats,
          achievements: [...newState.stats.achievements, nextNode.achievementUnlocked],
        };
      }

      // افزودن item اگر وجود دارد
      if (nextNode.itemGained && !newState.stats.itemsCollected.includes(nextNode.itemGained)) {
        newState.stats = {
          ...newState.stats,
          itemsCollected: [...newState.stats.itemsCollected, nextNode.itemGained],
        };
      }

      return newState;
    });
  };

  const resetStory = () => {
    setGameState({
      currentNodeId: rostamSohrabStory.startNodeId,
      visitedNodes: [rostamSohrabStory.startNodeId],
      choices: [],
      stats: initialGameStats,
    });
  };

  const saveProgress = async () => {
    try {
      await AsyncStorage.setItem("gameState", JSON.stringify(gameState));
    } catch (error) {
      console.error("خطا در ذخیره پیشرفت:", error);
    }
  };

  const loadProgress = async () => {
    try {
      const saved = await AsyncStorage.getItem("gameState");
      if (saved) {
        setGameState(JSON.parse(saved));
      }
    } catch (error) {
      console.error("خطا در بارگذاری پیشرفت:", error);
    }
  };

  // ذخیره خودکار پیشرفت
  useEffect(() => {
    saveProgress();
  }, [gameState]);

  return (
    <StoryContext.Provider
      value={{
        currentNode,
        gameState,
        makeChoice,
        resetStory,
        saveProgress,
        loadProgress,
        updateStats,
        updateRelationship,
      }}
    >
      {children}
    </StoryContext.Provider>
  );
};

export const useStory = () => {
  const context = useContext(StoryContext);
  if (!context) {
    throw new Error("useStory must be used within StoryProvider");
  }
  return context;
};
