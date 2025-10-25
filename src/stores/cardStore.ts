import { create } from 'zustand';
import { eq, and } from 'drizzle-orm';
import { database, cards as cardsTable, reviewLogs as reviewLogsTable } from '@/database';
import { Card, ReviewRating, ReviewLog, MediaAttachment } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { calculateNextReview } from '@/utils/srs';
import { useDeckStore } from './deckStore';

interface CardStore {
  cards: Card[];
  currentCard: Card | null;
  loading: boolean;
  error: string | null;

  // Actions
  fetchCards: (deckId: string) => Promise<void>;
  getCard: (id: string) => Card | undefined;
  createCard: (deckId: string, front: string, back: string, frontMedia?: MediaAttachment[], backMedia?: MediaAttachment[]) => Promise<Card>;
  updateCard: (id: string, updates: Partial<Card>) => Promise<void>;
  deleteCard: (id: string) => Promise<void>;
  reviewCard: (card: Card, rating: ReviewRating, timeTaken: number) => Promise<void>;
  setCurrentCard: (card: Card | null) => void;
}

export const useCardStore = create<CardStore>((set, get) => ({
  cards: [],
  currentCard: null,
  loading: false,
  error: null,

  fetchCards: async (deckId) => {
    set({ loading: true, error: null });
    try {
      const result = await database
        .select()
        .from(cardsTable)
        .where(eq(cardsTable.deckId, deckId));

      const cards: Card[] = result.map((row) => ({
        id: row.id,
        deckId: row.deckId,
        front: row.front,
        back: row.back,
        frontMedia: row.frontMedia ? JSON.parse(row.frontMedia) : undefined,
        backMedia: row.backMedia ? JSON.parse(row.backMedia) : undefined,
        tags: row.tags ? JSON.parse(row.tags) : undefined,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        state: row.state as Card['state'],
        due: row.due,
        interval: row.interval,
        easeFactor: row.easeFactor,
        lapses: row.lapses,
        reps: row.reps,
      }));

      set({ cards, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  getCard: (id) => {
    return get().cards.find((card) => card.id === id);
  },

  createCard: async (deckId, front, back, frontMedia, backMedia) => {
    const now = new Date().toISOString();
    const id = uuidv4();

    const newCard: Card = {
      id,
      deckId,
      front,
      back,
      frontMedia,
      backMedia,
      createdAt: now,
      updatedAt: now,
      state: 'new',
      due: now,
      interval: 0,
      easeFactor: 2.5,
      lapses: 0,
      reps: 0,
    };

    await database.insert(cardsTable).values({
      id,
      deckId,
      front,
      back,
      frontMedia: frontMedia ? JSON.stringify(frontMedia) : null,
      backMedia: backMedia ? JSON.stringify(backMedia) : null,
      tags: null,
      createdAt: now,
      updatedAt: now,
      state: 'new',
      due: now,
      interval: 0,
      easeFactor: 2.5,
      lapses: 0,
      reps: 0,
    });

    set((state) => ({ cards: [...state.cards, newCard] }));
    return newCard;
  },

  updateCard: async (id, updates) => {
    const now = new Date().toISOString();

    const updateData: any = { ...updates, updatedAt: now };
    if (updates.frontMedia) {
      updateData.frontMedia = JSON.stringify(updates.frontMedia);
    }
    if (updates.backMedia) {
      updateData.backMedia = JSON.stringify(updates.backMedia);
    }
    if (updates.tags) {
      updateData.tags = JSON.stringify(updates.tags);
    }

    await database
      .update(cardsTable)
      .set(updateData)
      .where(eq(cardsTable.id, id));

    set((state) => ({
      cards: state.cards.map((card) =>
        card.id === id ? { ...card, ...updates, updatedAt: now } : card
      ),
    }));
  },

  deleteCard: async (id) => {
    await database.delete(cardsTable).where(eq(cardsTable.id, id));
    set((state) => ({
      cards: state.cards.filter((card) => card.id !== id),
    }));
  },

  reviewCard: async (card, rating, timeTaken) => {
    const deck = useDeckStore.getState().getDeck(card.deckId);
    if (!deck) return;

    const previousState = card.state;
    const reviewResult = calculateNextReview(card, rating, deck.settings);
    const now = new Date().toISOString();

    // Update card
    await database
      .update(cardsTable)
      .set({
        interval: reviewResult.interval,
        easeFactor: reviewResult.easeFactor,
        state: reviewResult.state,
        due: reviewResult.due,
        lapses: reviewResult.lapses,
        reps: reviewResult.reps,
        updatedAt: now,
      })
      .where(eq(cardsTable.id, card.id));

    // Create review log
    const logId = uuidv4();
    await database.insert(reviewLogsTable).values({
      id: logId,
      cardId: card.id,
      deckId: card.deckId,
      rating,
      ease: reviewResult.easeFactor,
      interval: reviewResult.interval,
      reviewedAt: now,
      timeTaken,
      previousState,
      newState: reviewResult.state,
    });

    // Update local state
    set((state) => ({
      cards: state.cards.map((c) =>
        c.id === card.id
          ? {
              ...c,
              ...reviewResult,
              updatedAt: now,
            }
          : c
      ),
    }));

    // Refresh deck counts
    useDeckStore.getState().fetchDecks();
  },

  setCurrentCard: (card) => {
    set({ currentCard: card });
  },
}));
