// ============================================================================
// 小魔方大师 - 核心类型定义
// ============================================================================

export type FormulaCategory = 'OLL' | 'PLL' | 'OLL-2x2' | 'PBL-2x2';

export type FormulaStatus = 'new' | 'learning' | 'mastered';

export type Difficulty = 1 | 2 | 3;

/**
 * 学习路径。
 *
 * - tutorial: 三阶零基础教程（层先法）
 * - tutorial-2x2: 二阶零基础教程（Ortega 入门）
 * - cfop: 三阶公式库 / 高手模式
 * - ortega: 二阶公式库 / 高手模式
 */
export type LearningPath = 'tutorial' | 'tutorial-2x2' | 'cfop' | 'ortega' | null;

/**
 * 一个公式数据。三阶 OLL 57 + PLL 21 + 二阶 OLL 7 + PBL 5 = 90 个。
 */
export interface Formula {
  id: string;
  category: FormulaCategory;
  subCategory: string;
  number: number;
  name: string;
  algorithm: string;
  alternativeAlgorithms?: string[];
  setupMoves?: string;
  difficulty: Difficulty;
  isPremium: boolean;
  tip?: string;
  puzzle?: '3x3x3' | '2x2x2';
}

export interface UserProgress {
  formulaId: string;
  status: FormulaStatus;
  practiceCount: number;
  lastPracticedAt: number;
  successRate: number;
  classroomId?: string;
}

export interface User {
  id: string;
  nickname: string;
  avatar: string;
  isPremium: boolean;
  createdAt: number;
  kidMode?: boolean;
  speechEnabled?: boolean;
  /** 当前选择的学习路径 */
  learningPath?: LearningPath;
}

export interface TutorialProgress {
  lessonId: string;
  completed: boolean;
  completedAt?: number;
  stars: number;
}

export interface PracticeSession {
  date: string;
  total: number;
  correct: number;
  formulaIds: string[];
  timestamp: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  emoji: string;
  unlocked: boolean;
  unlockedAt?: number;
}

export type AnalyticsEvent =
  | 'formula_view'
  | 'formula_mastered'
  | 'practice_start'
  | 'practice_complete'
  | 'premium_modal_show'
  | 'pricing_view'
  | 'pricing_cta_click'
  | 'b2b_contact_click'
  | 'path_select'
  | 'kid_mode_toggle'
  | 'tutorial_lesson_start'
  | 'tutorial_lesson_complete'
  | 'speech_toggle';
