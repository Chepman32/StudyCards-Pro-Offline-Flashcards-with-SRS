import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const decks = sqliteTable('decks', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  color: text('color'),
  icon: text('icon'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
  newCardsPerDay: integer('new_cards_per_day').notNull().default(20),
  maxReviewsPerDay: integer('max_reviews_per_day').notNull().default(200),
  easyMultiplier: real('easy_multiplier').notNull().default(2.5),
  hardMultiplier: real('hard_multiplier').notNull().default(1.2),
  lapseInterval: integer('lapse_interval').notNull().default(10),
  graduatingInterval: integer('graduating_interval').notNull().default(1),
  easyInterval: integer('easy_interval').notNull().default(4),
});

export const cards = sqliteTable('cards', {
  id: text('id').primaryKey(),
  deckId: text('deck_id').notNull().references(() => decks.id, { onDelete: 'cascade' }),
  front: text('front').notNull(),
  back: text('back').notNull(),
  frontMedia: text('front_media'), // JSON array
  backMedia: text('back_media'), // JSON array
  tags: text('tags'), // JSON array
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
  state: text('state').notNull().default('new'),
  due: text('due').notNull(),
  interval: integer('interval').notNull().default(0),
  easeFactor: real('ease_factor').notNull().default(2.5),
  lapses: integer('lapses').notNull().default(0),
  reps: integer('reps').notNull().default(0),
});

export const reviewLogs = sqliteTable('review_logs', {
  id: text('id').primaryKey(),
  cardId: text('card_id').notNull().references(() => cards.id, { onDelete: 'cascade' }),
  deckId: text('deck_id').notNull().references(() => decks.id, { onDelete: 'cascade' }),
  rating: text('rating').notNull(),
  ease: real('ease').notNull(),
  interval: integer('interval').notNull(),
  reviewedAt: text('reviewed_at').notNull(),
  timeTaken: integer('time_taken').notNull(),
  previousState: text('previous_state').notNull(),
  newState: text('new_state').notNull(),
});

export const studySessions = sqliteTable('study_sessions', {
  id: text('id').primaryKey(),
  deckId: text('deck_id').notNull().references(() => decks.id, { onDelete: 'cascade' }),
  startedAt: text('started_at').notNull(),
  endedAt: text('ended_at'),
  cardsReviewed: integer('cards_reviewed').notNull().default(0),
  newCards: integer('new_cards').notNull().default(0),
  reviewCards: integer('review_cards').notNull().default(0),
  correctCount: integer('correct_count').notNull().default(0),
  againCount: integer('again_count').notNull().default(0),
  hardCount: integer('hard_count').notNull().default(0),
  goodCount: integer('good_count').notNull().default(0),
  easyCount: integer('easy_count').notNull().default(0),
});

export type DeckRow = typeof decks.$inferSelect;
export type CardRow = typeof cards.$inferSelect;
export type ReviewLogRow = typeof reviewLogs.$inferSelect;
export type StudySessionRow = typeof studySessions.$inferSelect;
