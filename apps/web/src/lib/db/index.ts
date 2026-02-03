import { drizzle, BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import * as schema from './schema';

// Database path - use environment variable or default to data directory
const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), 'data/mediterana.db');

// Lazy database initialization to avoid build-time errors
let _db: BetterSQLite3Database<typeof schema> | null = null;

function getDb(): BetterSQLite3Database<typeof schema> {
  if (!_db) {
    // Ensure the directory exists
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const sqlite = new Database(dbPath);
    // Enable WAL mode for better concurrent access
    sqlite.pragma('journal_mode = WAL');
    _db = drizzle(sqlite, { schema });
  }
  return _db;
}

// Export a proxy that lazily initializes the database
export const db = new Proxy({} as BetterSQLite3Database<typeof schema>, {
  get(_target, prop) {
    return getDb()[prop as keyof BetterSQLite3Database<typeof schema>];
  },
});

// Export schema for convenience
export * from './schema';
