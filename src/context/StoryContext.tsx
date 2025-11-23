import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GameState, StoryNode } from "../types";
import { rostamSohrabStory } from "../data/storyData";
import { Directions } from "react-native-gesture-handler";

interface StoryContextType {
  currentNode: StoryNode;
  gameState: GameState;
  makeChoice: (choiceId: string, nextNodeId: string) => void;
  resetStory: () => void;
  saveProgress: () => Promise<void>;
  loadProgress: () => Promise<void>;
}

const StoryContext = createContext<StoryContextType | undefined>(undefined);

export const StoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>({
    currentNodeId: rostamSohrabStory.startNodeId,
    visitedNodes: [rostamSohrabStory.startNodeId],
    choices: [],
  });

  const currentNode = rostamSohrabStory.nodes[gameState.currentNodeId];

  const makeChoice = (choiceId: string, nextNodeId: string) => {
    setGameState((prev) => ({
      currentNodeId: nextNodeId,
      visitedNodes: [...prev.visitedNodes, nextNodeId],
      choices: [...prev.choices, { nodeId: prev.currentNodeId, choiceId }],
    }));
  };

  const resetStory = () => {
    setGameState({
      currentNodeId: rostamSohrabStory.startNodeId,
      visitedNodes: [rostamSohrabStory.startNodeId],
      choices: [],
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
      value={{ currentNode, gameState, makeChoice, resetStory, saveProgress, loadProgress }}
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
