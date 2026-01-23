import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import path from 'path';
import * as schema from './schema';

// Database path - use environment variable or default to data directory
const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), '../../data/mediterana.db');

// Create better-sqlite3 instance
const sqlite = new Database(dbPath);

// Enable WAL mode for better concurrent access
sqlite.pragma('journal_mode = WAL');

// Create drizzle instance with schema
export const db = drizzle(sqlite, { schema });

// Export schema for convenience
export * from './schema';
