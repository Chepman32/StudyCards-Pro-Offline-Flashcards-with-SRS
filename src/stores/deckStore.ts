import { create } from 'zustand';
import { eq } from 'drizzle-orm';
import { database, decks as decksTable, cards as cardsTable } from '@/database';
import { Deck, DeckSettings, defaultDeckSettings } from '@/types';
import { v4 as uuidv4 } from 'uuid';

interface DeckStore {
  decks: Deck[];
  loading: boolean;
  error: string | null;

  // Actions
  fetchDecks: () => Promise<void>;
  getDeck: (id: string) => Deck | undefined;
  createDeck: (title: string, description?: string, settings?: Partial<DeckSettings>) => Promise<Deck>;
  updateDeck: (id: string, updates: Partial<Deck>) => Promise<void>;
  deleteDeck: (id: string) => Promise<void>;
  getDeckCounts: (deckId: string) => Promise<{ total: number; new: number; due: number }>;
}

export const useDeckStore = create<DeckStore>((set, get) => ({
  decks: [],
  loading: false,
  error: null,

  fetchDecks: async () => {
    set({ loading: true, error: null });
    try {
      const result = await database.select().from(decksTable);

      const decksWithCounts = await Promise.all(
        result.map(async (deck) => {
          const cards = await database
            .select()
            .from(cardsTable)
            .where(eq(cardsTable.deckId, deck.id));

          const now = new Date();
          const newCount = cards.filter((c) => c.state === 'new').length;
          const dueCount = cards.filter((c) => new Date(c.due) <= now && c.state !== 'new').length;

          return {
            id: deck.id,
            title: deck.title,
            description: deck.description || undefined,
            color: deck.color || undefined,
            icon: deck.icon || undefined,
            createdAt: deck.createdAt,
            updatedAt: deck.updatedAt,
            cardCount: cards.length,
            newCount,
            dueCount,
            settings: {
              newCardsPerDay: deck.newCardsPerDay,
              maxReviewsPerDay: deck.maxReviewsPerDay,
              easyMultiplier: deck.easyMultiplier,
              hardMultiplier: deck.hardMultiplier,
              lapseInterval: deck.lapseInterval,
              graduatingInterval: deck.graduatingInterval,
              easyInterval: deck.easyInterval,
            },
          } as Deck;
        })
      );

      set({ decks: decksWithCounts, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  getDeck: (id) => {
    return get().decks.find((deck) => deck.id === id);
  },

  createDeck: async (title, description, settings) => {
    const now = new Date().toISOString();
    const deckSettings = { ...defaultDeckSettings, ...settings };
    const id = uuidv4();

    const newDeck: Deck = {
      id,
      title,
      description,
      createdAt: now,
      updatedAt: now,
      cardCount: 0,
      newCount: 0,
      dueCount: 0,
      settings: deckSettings,
    };

    await database.insert(decksTable).values({
      id,
      title,
      description: description || null,
      color: null,
      icon: null,
      createdAt: now,
      updatedAt: now,
      ...deckSettings,
    });

    set((state) => ({ decks: [...state.decks, newDeck] }));
    return newDeck;
  },

  updateDeck: async (id, updates) => {
    const now = new Date().toISOString();

    await database
      .update(decksTable)
      .set({ ...updates, updatedAt: now })
      .where(eq(decksTable.id, id));

    set((state) => ({
      decks: state.decks.map((deck) =>
        deck.id === id ? { ...deck, ...updates, updatedAt: now } : deck
      ),
    }));
  },

  deleteDeck: async (id) => {
    await database.delete(decksTable).where(eq(decksTable.id, id));
    set((state) => ({
      decks: state.decks.filter((deck) => deck.id !== id),
    }));
  },

  getDeckCounts: async (deckId) => {
    const cards = await database
      .select()
      .from(cardsTable)
      .where(eq(cardsTable.deckId, deckId));

    const now = new Date();
    const newCount = cards.filter((c) => c.state === 'new').length;
    const dueCount = cards.filter((c) => new Date(c.due) <= now && c.state !== 'new').length;

    return {
      total: cards.length,
      new: newCount,
      due: dueCount,
    };
  },
}));
