import { create } from 'zustand';
import { database, reviewLogs as reviewLogsTable, cards as cardsTable } from '@/database';
import { Statistics, DailyStats } from '@/types';
import { calculateStreak, calculateRetentionRate } from '@/utils/srs';
import { eq } from 'drizzle-orm';

interface StatsStore {
  statistics: Statistics | null;
  loading: boolean;
  error: string | null;

  // Actions
  fetchStatistics: (deckId?: string) => Promise<void>;
  getDailyStats: (days: number) => Promise<DailyStats[]>;
}

export const useStatsStore = create<StatsStore>((set, get) => ({
  statistics: null,
  loading: false,
  error: null,

  fetchStatistics: async (deckId) => {
    set({ loading: true, error: null });
    try {
      // Fetch all review logs
      const reviewLogs = deckId
        ? await database.select().from(reviewLogsTable).where(eq(reviewLogsTable.deckId, deckId))
        : await database.select().from(reviewLogsTable);

      // Calculate statistics
      const totalReviews = reviewLogs.length;
      const againCount = reviewLogs.filter((log) => log.rating === 'again').length;
      const retentionRate = calculateRetentionRate(totalReviews, againCount);

      // Calculate average ease
      const totalEase = reviewLogs.reduce((sum, log) => sum + log.ease, 0);
      const averageEase = totalReviews > 0 ? totalEase / totalReviews : 2.5;

      // Calculate streak
      const reviewDates = reviewLogs.map((log) => log.reviewedAt);
      const streakDays = calculateStreak(reviewDates);

      // Get last review date
      const lastReviewDate =
        reviewLogs.length > 0
          ? reviewLogs.sort((a, b) => new Date(b.reviewedAt).getTime() - new Date(a.reviewedAt).getTime())[0]
              .reviewedAt
          : undefined;

      // Fetch daily stats for last 30 days
      const dailyStats = await get().getDailyStats(30);

      // Get total counts
      const allCards = deckId
        ? await database.select().from(cardsTable).where(eq(cardsTable.deckId, deckId))
        : await database.select().from(cardsTable);

      const statistics: Statistics = {
        totalDecks: deckId ? 1 : new Set(allCards.map((c) => c.deckId)).size,
        totalCards: allCards.length,
        totalReviews,
        streakDays,
        lastReviewDate,
        averageEase,
        retentionRate,
        dailyStats,
      };

      set({ statistics, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  getDailyStats: async (days) => {
    const now = new Date();
    const statsMap = new Map<string, DailyStats>();

    // Initialize all days
    for (let i = 0; i < days; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      statsMap.set(dateStr, {
        date: dateStr,
        reviewCount: 0,
        newCardCount: 0,
        timeSpent: 0,
        accuracy: 0,
      });
    }

    // Fetch review logs for the period
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - days);
    const reviewLogs = await database.select().from(reviewLogsTable);

    const relevantLogs = reviewLogs.filter(
      (log) => new Date(log.reviewedAt) >= startDate
    );

    // Aggregate by day
    relevantLogs.forEach((log) => {
      const dateStr = log.reviewedAt.split('T')[0];
      const stats = statsMap.get(dateStr);
      if (stats) {
        stats.reviewCount += 1;
        stats.timeSpent += log.timeTaken / 60000; // Convert to minutes
        if (log.previousState === 'new') {
          stats.newCardCount += 1;
        }
        if (log.rating !== 'again') {
          stats.accuracy += 1;
        }
      }
    });

    // Calculate accuracy percentage
    statsMap.forEach((stats) => {
      if (stats.reviewCount > 0) {
        stats.accuracy = (stats.accuracy / stats.reviewCount) * 100;
      }
    });

    return Array.from(statsMap.values()).reverse();
  },
}));
