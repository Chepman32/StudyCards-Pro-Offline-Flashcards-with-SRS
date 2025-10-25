// Core data types for StudyCards Pro

export interface Deck {
  id: string;
  title: string;
  description?: string;
  color?: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
  cardCount: number;
  newCount: number;
  dueCount: number;
  settings: DeckSettings;
}

export interface DeckSettings {
  newCardsPerDay: number;
  maxReviewsPerDay: number;
  easyMultiplier: number;
  hardMultiplier: number;
  lapseInterval: number;
  graduatingInterval: number;
  easyInterval: number;
}

export const defaultDeckSettings: DeckSettings = {
  newCardsPerDay: 20,
  maxReviewsPerDay: 200,
  easyMultiplier: 2.5,
  hardMultiplier: 1.2,
  lapseInterval: 10,
  graduatingInterval: 1,
  easyInterval: 4,
};

export interface Card {
  id: string;
  deckId: string;
  front: string;
  back: string;
  frontMedia?: MediaAttachment[];
  backMedia?: MediaAttachment[];
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  state: CardState;
  due: string;
  interval: number;
  easeFactor: number;
  lapses: number;
  reps: number;
}

export type CardState = 'new' | 'learning' | 'review' | 'relearning';

export interface MediaAttachment {
  id: string;
  type: 'image' | 'audio';
  uri: string;
  filename: string;
  size: number;
}

export interface ReviewLog {
  id: string;
  cardId: string;
  deckId: string;
  rating: ReviewRating;
  ease: number;
  interval: number;
  reviewedAt: string;
  timeTaken: number; // in milliseconds
  previousState: CardState;
  newState: CardState;
}

export type ReviewRating = 'again' | 'hard' | 'good' | 'easy';

export interface StudySession {
  id: string;
  deckId: string;
  startedAt: string;
  endedAt?: string;
  cardsReviewed: number;
  newCards: number;
  reviewCards: number;
  correctCount: number;
  againCount: number;
  hardCount: number;
  goodCount: number;
  easyCount: number;
}

export interface Statistics {
  totalDecks: number;
  totalCards: number;
  totalReviews: number;
  streakDays: number;
  lastReviewDate?: string;
  averageEase: number;
  retentionRate: number;
  dailyStats: DailyStats[];
}

export interface DailyStats {
  date: string;
  reviewCount: number;
  newCardCount: number;
  timeSpent: number; // in minutes
  accuracy: number;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notificationsEnabled: boolean;
  dailyReminderTime?: string;
  soundEnabled: boolean;
  hapticEnabled: boolean;
  cardAnimationSpeed: 'slow' | 'normal' | 'fast';
  showTimer: boolean;
  autoPlayAudio: boolean;
  isPro: boolean;
}

export const defaultUserSettings: UserSettings = {
  theme: 'auto',
  language: 'en',
  notificationsEnabled: true,
  soundEnabled: true,
  hapticEnabled: true,
  cardAnimationSpeed: 'normal',
  showTimer: false,
  autoPlayAudio: false,
  isPro: false,
};

// Component prop types

export type PropType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'color'
  | 'imageUri'
  | 'icon'
  | 'enum'
  | 'length'
  | 'angle'
  | 'opacity';

export type GestureType =
  | 'tap'
  | 'doubleTap'
  | 'longPress'
  | 'pressAndHold'
  | 'pan'
  | 'pinch'
  | 'drag'
  | 'swipe'
  | 'edgeSwipe'
  | 'fling'
  | 'hover'
  | 'scroll';

export type AnimationHook =
  | 'onFocusTransition'
  | 'onPressScaleSpring'
  | 'onDismissSwipe'
  | 'onRevealFling';

// Navigation types

export type RootStackParamList = {
  Splash: undefined;
  Main: undefined;
  DeckDetail: { deckId: string };
  Review: { deckId: string };
  CardEditor: { deckId: string; cardId?: string };
  DeckEditor: { deckId?: string };
  Settings: undefined;
  Statistics: { deckId?: string };
  Import: undefined;
  Export: { deckId?: string };
  Pro: undefined;
};

export type MainTabParamList = {
  Decks: undefined;
  Stats: undefined;
  Settings: undefined;
};

// IAP types

export type IAPProduct = {
  productId: string;
  title: string;
  description: string;
  price: string;
  type: 'consumable' | 'non-consumable' | 'subscription';
};

export type IAPPurchase = {
  productId: string;
  transactionId: string;
  purchaseDate: string;
  isActive: boolean;
};
