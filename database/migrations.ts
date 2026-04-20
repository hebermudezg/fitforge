import type { SQLiteDatabase } from 'expo-sqlite';
import { CREATE_TABLES } from './schema';

interface Migration {
  version: number;
  statements: string[];
}

const MIGRATIONS: Migration[] = [
  {
    version: 1,
    statements: [CREATE_TABLES],
  },
  {
    version: 2,
    statements: [
      'ALTER TABLE users ADD COLUMN terms_accepted INTEGER NOT NULL DEFAULT 0',
      'ALTER TABLE users ADD COLUMN terms_accepted_at TEXT DEFAULT NULL',
      'ALTER TABLE users ADD COLUMN fitness_goal TEXT DEFAULT NULL',
    ],
  },
  {
    version: 3,
    statements: [
      'ALTER TABLE users ADD COLUMN phone TEXT DEFAULT NULL',
    ],
  },
  {
    version: 4,
    statements: [
      'ALTER TABLE users ADD COLUMN password TEXT DEFAULT NULL',
    ],
  },
  {
    version: 5,
    statements: [
      `CREATE TABLE IF NOT EXISTS workout_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL REFERENCES users(id),
        workout_name TEXT NOT NULL,
        started_at TEXT NOT NULL DEFAULT (datetime('now')),
        completed_at TEXT DEFAULT NULL,
        total_exercises INTEGER NOT NULL DEFAULT 0,
        completed_exercises INTEGER NOT NULL DEFAULT 0,
        notes TEXT DEFAULT ''
      )`,
      `CREATE TABLE IF NOT EXISTS workout_sets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id INTEGER NOT NULL REFERENCES workout_sessions(id),
        exercise_id TEXT NOT NULL,
        exercise_name TEXT NOT NULL,
        set_number INTEGER NOT NULL,
        reps INTEGER DEFAULT NULL,
        weight_kg REAL DEFAULT NULL,
        completed INTEGER NOT NULL DEFAULT 0,
        completed_at TEXT DEFAULT NULL
      )`,
      `CREATE INDEX IF NOT EXISTS idx_sessions_user ON workout_sessions(user_id, started_at DESC)`,
    ],
  },
];

export async function runMigrations(db: SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS app_meta (
      key   TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  const row = await db.getFirstAsync<{ value: string }>(
    "SELECT value FROM app_meta WHERE key = 'schema_version'"
  );
  const currentVersion = row ? parseInt(row.value, 10) : 0;

  for (const migration of MIGRATIONS) {
    if (migration.version > currentVersion) {
      for (const sql of migration.statements) {
        try {
          await db.execAsync(sql);
        } catch (e: any) {
          // Ignore "duplicate column" errors from re-running ALTER TABLE
          if (e.message && e.message.includes('duplicate column')) continue;
          // Ignore "already exists" for CREATE TABLE IF NOT EXISTS
          if (e.message && e.message.includes('already exists')) continue;
          console.warn(`Migration v${migration.version} warning:`, e.message);
        }
      }
      await db.runAsync(
        "INSERT OR REPLACE INTO app_meta (key, value) VALUES ('schema_version', ?)",
        [migration.version.toString()]
      );
    }
  }
}
