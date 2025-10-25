import { Card, CardState, ReviewRating, DeckSettings } from '@/types';

/**
 * SM-2 Algorithm with modifications
 * Based on SuperMemo 2 algorithm with enhancements for better retention
 */

export interface ReviewResult {
  interval: number;
  easeFactor: number;
  state: CardState;
  due: string;
  lapses: number;
  reps: number;
}

const MINIMUM_EASE_FACTOR = 1.3;
const MAXIMUM_EASE_FACTOR = 3.0;
const INITIAL_EASE_FACTOR = 2.5;

/**
 * Calculate the next review parameters based on user rating
 */
export const calculateNextReview = (
  card: Card,
  rating: ReviewRating,
  settings: DeckSettings
): ReviewResult => {
  const now = new Date();
  let { interval, easeFactor, state, lapses, reps } = card;

  // Increment reps for non-again ratings
  if (rating !== 'again') {
    reps += 1;
  }

  switch (rating) {
    case 'again':
      // Failed - reset to learning state
      interval = 1;
      easeFactor = Math.max(MINIMUM_EASE_FACTOR, easeFactor - 0.2);
      state = state === 'new' ? 'learning' : 'relearning';
      lapses += 1;
      break;

    case 'hard':
      // Difficult but passed
      if (state === 'new' || state === 'learning' || state === 'relearning') {
        interval = settings.graduatingInterval;
        state = 'review';
      } else {
        interval = Math.max(1, Math.floor(interval * settings.hardMultiplier));
      }
      easeFactor = Math.max(MINIMUM_EASE_FACTOR, easeFactor - 0.15);
      break;

    case 'good':
      // Standard pass
      if (state === 'new') {
        interval = settings.graduatingInterval;
        state = 'learning';
      } else if (state === 'learning' || state === 'relearning') {
        interval = settings.graduatingInterval;
        state = 'review';
      } else {
        // Review state
        if (interval === 0) {
          interval = settings.graduatingInterval;
        } else {
          interval = Math.floor(interval * easeFactor);
        }
      }
      // Slight ease increase for good ratings
      easeFactor = Math.min(MAXIMUM_EASE_FACTOR, easeFactor + 0.05);
      break;

    case 'easy':
      // Very easy - longer interval
      if (state === 'new' || state === 'learning' || state === 'relearning') {
        interval = settings.easyInterval;
        state = 'review';
      } else {
        interval = Math.floor(interval * easeFactor * settings.easyMultiplier);
      }
      easeFactor = Math.min(MAXIMUM_EASE_FACTOR, easeFactor + 0.15);
      break;
  }

  // Calculate due date
  const dueDate = new Date(now);
  dueDate.setDate(dueDate.getDate() + interval);

  return {
    interval,
    easeFactor,
    state,
    due: dueDate.toISOString(),
    lapses,
    reps,
  };
};

/**
 * Get cards due for review
 */
export const getDueCards = (cards: Card[], limit?: number): Card[] => {
  const now = new Date();
  const dueCards = cards.filter((card) => {
    const dueDate = new Date(card.due);
    return dueDate <= now;
  });

  // Sort by due date (oldest first)
  dueCards.sort((a, b) => {
    const dateA = new Date(a.due).getTime();
    const dateB = new Date(b.due).getTime();
    return dateA - dateB;
  });

  return limit ? dueCards.slice(0, limit) : dueCards;
};

/**
 * Get new cards for learning
 */
export const getNewCards = (cards: Card[], limit: number): Card[] => {
  const newCards = cards.filter((card) => card.state === 'new');
  return newCards.slice(0, limit);
};

/**
 * Calculate retention rate from review history
 */
export const calculateRetentionRate = (
  totalReviews: number,
  failedReviews: number
): number => {
  if (totalReviews === 0) return 0;
  return ((totalReviews - failedReviews) / totalReviews) * 100;
};

/**
 * Calculate optimal study time based on due cards
 */
export const estimateStudyTime = (cardCount: number): number => {
  // Average 10 seconds per card (can be adjusted based on user data)
  const averageTimePerCard = 10;
  return Math.ceil((cardCount * averageTimePerCard) / 60); // Return minutes
};

/**
 * Get next review intervals for display
 */
export const getIntervalDisplay = (interval: number): string => {
  if (interval < 1) return 'Less than 1 day';
  if (interval === 1) return '1 day';
  if (interval < 30) return `${interval} days`;
  if (interval < 365) {
    const months = Math.floor(interval / 30);
    return months === 1 ? '1 month' : `${months} months`;
  }
  const years = Math.floor(interval / 365);
  return years === 1 ? '1 year' : `${years} years`;
};

/**
 * Calculate daily study streak
 */
export const calculateStreak = (reviewDates: string[]): number => {
  if (reviewDates.length === 0) return 0;

  const sortedDates = reviewDates
    .map((date) => new Date(date).toDateString())
    .filter((date, index, self) => self.indexOf(date) === index)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  let streak = 0;
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  // Start counting from today or yesterday
  let currentDate = sortedDates[0] === today ? today : yesterday;
  if (sortedDates[0] !== today && sortedDates[0] !== yesterday) {
    return 0;
  }

  for (const dateStr of sortedDates) {
    if (dateStr === currentDate) {
      streak++;
      const date = new Date(currentDate);
      date.setDate(date.getDate() - 1);
      currentDate = date.toDateString();
    } else {
      break;
    }
  }

  return streak;
};
