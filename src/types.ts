/**
 * انواع داده‌های مورد استفاده در اپلیکیشن داستان تعاملی
 */

export interface Choice {
  id: string;
  text: string;
  nextNodeId: string;
  consequence?: string; // پیامد انتخاب
}

export interface StoryNode {
  id: string;
  title: string;
  text: string;
  image?: string;
  choices: Choice[];
  isEnding?: boolean;
  endingType?: 'good' | 'bad' | 'neutral';
}

export interface GameState {
  currentNodeId: string;
  visitedNodes: string[];
  choices: { nodeId: string; choiceId: string }[];
}

export interface StoryData {
  title: string;
  author: string;
  description: string;
  nodes: { [key: string]: StoryNode };
  startNodeId: string;
}
