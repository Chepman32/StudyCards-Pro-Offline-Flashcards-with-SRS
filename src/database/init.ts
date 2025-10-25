import { database, db } from './client';

export const initializeDatabase = async () => {
  try {
    // Create decks table
    db.execute(`
      CREATE TABLE IF NOT EXISTS decks (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        color TEXT,
        icon TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        new_cards_per_day INTEGER NOT NULL DEFAULT 20,
        max_reviews_per_day INTEGER NOT NULL DEFAULT 200,
        easy_multiplier REAL NOT NULL DEFAULT 2.5,
        hard_multiplier REAL NOT NULL DEFAULT 1.2,
        lapse_interval INTEGER NOT NULL DEFAULT 10,
        graduating_interval INTEGER NOT NULL DEFAULT 1,
        easy_interval INTEGER NOT NULL DEFAULT 4
      )
    `);

    // Create cards table
    db.execute(`
      CREATE TABLE IF NOT EXISTS cards (
        id TEXT PRIMARY KEY,
        deck_id TEXT NOT NULL,
        front TEXT NOT NULL,
        back TEXT NOT NULL,
        front_media TEXT,
        back_media TEXT,
        tags TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        state TEXT NOT NULL DEFAULT 'new',
        due TEXT NOT NULL,
        interval INTEGER NOT NULL DEFAULT 0,
        ease_factor REAL NOT NULL DEFAULT 2.5,
        lapses INTEGER NOT NULL DEFAULT 0,
        reps INTEGER NOT NULL DEFAULT 0,
        FOREIGN KEY (deck_id) REFERENCES decks(id) ON DELETE CASCADE
      )
    `);

    // Create review_logs table
    db.execute(`
      CREATE TABLE IF NOT EXISTS review_logs (
        id TEXT PRIMARY KEY,
        card_id TEXT NOT NULL,
        deck_id TEXT NOT NULL,
        rating TEXT NOT NULL,
        ease REAL NOT NULL,
        interval INTEGER NOT NULL,
        reviewed_at TEXT NOT NULL,
        time_taken INTEGER NOT NULL,
        previous_state TEXT NOT NULL,
        new_state TEXT NOT NULL,
        FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE,
        FOREIGN KEY (deck_id) REFERENCES decks(id) ON DELETE CASCADE
      )
    `);

    // Create study_sessions table
    db.execute(`
      CREATE TABLE IF NOT EXISTS study_sessions (
        id TEXT PRIMARY KEY,
        deck_id TEXT NOT NULL,
        started_at TEXT NOT NULL,
        ended_at TEXT,
        cards_reviewed INTEGER NOT NULL DEFAULT 0,
        new_cards INTEGER NOT NULL DEFAULT 0,
        review_cards INTEGER NOT NULL DEFAULT 0,
        correct_count INTEGER NOT NULL DEFAULT 0,
        again_count INTEGER NOT NULL DEFAULT 0,
        hard_count INTEGER NOT NULL DEFAULT 0,
        good_count INTEGER NOT NULL DEFAULT 0,
        easy_count INTEGER NOT NULL DEFAULT 0,
        FOREIGN KEY (deck_id) REFERENCES decks(id) ON DELETE CASCADE
      )
    `);

    // Create indices for better query performance
    db.execute('CREATE INDEX IF NOT EXISTS idx_cards_deck_id ON cards(deck_id)');
    db.execute('CREATE INDEX IF NOT EXISTS idx_cards_due ON cards(due)');
    db.execute('CREATE INDEX IF NOT EXISTS idx_cards_state ON cards(state)');
    db.execute('CREATE INDEX IF NOT EXISTS idx_review_logs_card_id ON review_logs(card_id)');
    db.execute('CREATE INDEX IF NOT EXISTS idx_review_logs_reviewed_at ON review_logs(reviewed_at)');

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
};
