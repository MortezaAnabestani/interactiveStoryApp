/**
 * انواع داده‌های مورد استفاده در اپلیکیشن داستان تعاملی
 */

// ============= سیستم شخصیت‌ها =============

export type CharacterId = 'rostam' | 'sohrab' | 'tahmineh' | 'kavoos' | 'goudarz' | 'human_ford' | 'narrator';

export interface Character {
  id: CharacterId;
  name: string;
  title?: string; // مثلاً "پهلوان ایران" برای رستم
  avatar: string; // کلید تصویر از images.characters
  description: string;
}

// ============= سیستم روابط و آمار =============

export interface RelationshipStats {
  [characterId: string]: number; // عدد بین 0 تا 100
}

export interface PlayerStats {
  honor: number; // شرافت (0-100)
  courage: number; // شجاعت (0-100)
  wisdom: number; // خرد (0-100)
  fame: number; // شهرت (0-100)
}

export interface GameStats {
  relationships: RelationshipStats;
  playerStats: PlayerStats;
  achievements: string[];
  itemsCollected: string[];
}

// ============= گره داستان با سیستم گفتگو =============

export interface DialogueLine {
  speaker: CharacterId | 'player' | 'narrator';
  text: string;
  emotion?: 'happy' | 'sad' | 'angry' | 'neutral' | 'surprised' | 'worried';
}

export interface Choice {
  id: string;
  text: string;
  nextNodeId: string;
  consequence?: string; // پیامد انتخاب
  // تأثیرات انتخاب
  relationshipChanges?: { [characterId: string]: number };
  statChanges?: Partial<PlayerStats>;
  requiredStats?: Partial<PlayerStats>; // آمار لازم برای فعال شدن انتخاب
  requiredRelationship?: { characterId: string; minValue: number };
}

export interface StoryNode {
  id: string;
  title: string;
  text?: string; // متن روایت (اختیاری)
  dialogue?: DialogueLine[]; // گفتگوها
  background?: string; // کلید تصویر پس‌زمینه
  choices: Choice[];
  isEnding?: boolean;
  endingType?: 'good' | 'bad' | 'neutral';
  // تأثیرات خودکار این گره
  autoRelationshipChanges?: { [characterId: string]: number };
  autoStatChanges?: Partial<PlayerStats>;
  achievementUnlocked?: string;
  itemGained?: string;
}

export interface GameState {
  currentNodeId: string;
  visitedNodes: string[];
  choices: { nodeId: string; choiceId: string; choice: string }[];
  stats: GameStats;
}

export interface StoryData {
  title: string;
  author: string;
  description: string;
  nodes: { [key: string]: StoryNode };
  characters: { [key: string]: Character };
  startNodeId: string;
}
