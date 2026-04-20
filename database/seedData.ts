import type { SQLiteDatabase } from 'expo-sqlite';

export async function seedDatabase(db: SQLiteDatabase): Promise<void> {
  // Check if already seeded — NEVER reseed
  const seeded = await db.getFirstAsync<{ value: string }>(
    "SELECT value FROM app_meta WHERE key = 'seeded'"
  );
  if (seeded) return;

  // Check if real user exists (terms accepted)
  const realUser = await db.getFirstAsync<{ id: number }>(
    'SELECT id FROM users WHERE terms_accepted = 1 LIMIT 1'
  );
  if (realUser) {
    // Real user exists, mark as seeded and skip
    await db.runAsync("INSERT OR REPLACE INTO app_meta (key, value) VALUES ('seeded', '1')");
    return;
  }

  // Seed demo user (Carlos) with 3 months of data
  const result = await db.runAsync(
    `INSERT INTO users (name, gender, height_cm, unit_system, terms_accepted)
     VALUES ('Carlos Mendez', 'male', 178, 'metric', 0)`
  );
  const userId = result.lastInsertRowId;

  const measurements = [
    { part: 'chest', base: 95, change: 1.5 },
    { part: 'biceps', base: 33, change: 0.8 },
    { part: 'deltoids', base: 45, change: 0.5 },
    { part: 'trapezius', base: 42, change: 0.3 },
    { part: 'triceps', base: 32, change: 0.6 },
    { part: 'forearms', base: 28, change: 0.4 },
    { part: 'abs', base: 82, change: -0.5 },
    { part: 'obliques', base: 78, change: -0.4 },
    { part: 'neck', base: 38, change: 0.2 },
    { part: 'quadriceps', base: 56, change: 1.0 },
    { part: 'hamstring', base: 52, change: 0.8 },
    { part: 'gluteal', base: 95, change: 0.3 },
    { part: 'calves', base: 37, change: 0.3 },
    { part: 'adductors', base: 50, change: 0.5 },
    { part: 'weight', base: 78, change: 1.0 },
    { part: 'bodyFat', base: 18, change: -0.8 },
    { part: 'waist', base: 82, change: -0.5 },
    { part: 'hips', base: 95, change: 0.2 },
  ];

  const now = new Date();
  for (const m of measurements) {
    for (let week = 12; week >= 0; week--) {
      for (const dayOff of [0, 3]) {
        const date = new Date(now);
        date.setDate(date.getDate() - (week * 7) + dayOff);
        const monthsAgo = week / 4.33;
        const progress = (3 - monthsAgo) * m.change;
        const noise = (Math.random() - 0.5) * 0.6;
        const value = Math.round((m.base + progress + noise) * 10) / 10;
        await db.runAsync(
          'INSERT INTO measurements (user_id, body_part, value, measured_at) VALUES (?, ?, ?, ?)',
          [userId, m.part, value, date.toISOString()]
        );
      }
    }
  }

  // Seed goals
  for (const g of [
    { part: 'chest', target: 102 }, { part: 'biceps', target: 38 },
    { part: 'abs', target: 78 }, { part: 'weight', target: 85 },
    { part: 'bodyFat', target: 12 },
  ]) {
    await db.runAsync(
      'INSERT INTO goals (user_id, body_part, target_value) VALUES (?, ?, ?)',
      [userId, g.part, g.target]
    );
  }

  // Seed events
  for (const evt of [
    { title: 'Coaching Session', type: 'coaching', days: 2 },
    { title: 'Body Check-in', type: 'check_in', days: 7 },
    { title: 'Leg Day', type: 'workout', days: 1 },
  ]) {
    const d = new Date(now);
    d.setDate(d.getDate() + evt.days);
    await db.runAsync(
      'INSERT INTO events (user_id, title, event_type, start_time) VALUES (?, ?, ?, ?)',
      [userId, evt.title, evt.type, d.toISOString()]
    );
  }

  // Mark as seeded
  await db.runAsync("INSERT OR REPLACE INTO app_meta (key, value) VALUES ('seeded', '1')");
}
