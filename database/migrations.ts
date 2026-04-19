import type { SQLiteDatabase } from 'expo-sqlite';
import { CREATE_TABLES } from './schema';

const MIGRATIONS = [
  {
    version: 1,
    up: CREATE_TABLES,
  },
  {
    version: 2,
    up: `
      ALTER TABLE users ADD COLUMN terms_accepted INTEGER NOT NULL DEFAULT 0;
      ALTER TABLE users ADD COLUMN terms_accepted_at TEXT DEFAULT NULL;
      ALTER TABLE users ADD COLUMN fitness_goal TEXT DEFAULT NULL;
    `,
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
      await db.execAsync(migration.up);
      await db.runAsync(
        "INSERT OR REPLACE INTO app_meta (key, value) VALUES ('schema_version', ?)",
        [migration.version.toString()]
      );
    }
  }
}
