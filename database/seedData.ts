import type { SQLiteDatabase } from 'expo-sqlite';

const USERS = [
  { name: 'Carlos Mendez', gender: 'male', height_cm: 178, unit_system: 'metric' },
  { name: 'Maria Lopez', gender: 'female', height_cm: 165, unit_system: 'metric' },
  { name: 'Andres Gutierrez', gender: 'male', height_cm: 182, unit_system: 'metric' },
  { name: 'Laura Torres', gender: 'female', height_cm: 170, unit_system: 'imperial' },
  { name: 'Diego Ramirez', gender: 'male', height_cm: 175, unit_system: 'metric' },
];

// Measurements over 3 months — showing progress
// Each user has different starting points and goals
const MEASUREMENT_TEMPLATES: Record<string, {
  bodyPart: string;
  baseValue: number;
  monthlyChange: number; // per month change
}[]> = {
  // Carlos - building muscle
  'Carlos Mendez': [
    { bodyPart: 'chest', baseValue: 95, monthlyChange: 1.5 },
    { bodyPart: 'biceps', baseValue: 33, monthlyChange: 0.8 },
    { bodyPart: 'shoulders', baseValue: 112, monthlyChange: 1.2 },
    { bodyPart: 'waist', baseValue: 82, monthlyChange: -0.5 },
    { bodyPart: 'thighs', baseValue: 56, monthlyChange: 1.0 },
    { bodyPart: 'calves', baseValue: 37, monthlyChange: 0.3 },
    { bodyPart: 'forearms', baseValue: 28, monthlyChange: 0.4 },
    { bodyPart: 'neck', baseValue: 38, monthlyChange: 0.2 },
    { bodyPart: 'hips', baseValue: 95, monthlyChange: 0.3 },
    { bodyPart: 'weight', baseValue: 78, monthlyChange: 1.0 },
    { bodyPart: 'bodyFat', baseValue: 18, monthlyChange: -0.8 },
  ],
  // Maria - toning
  'Maria Lopez': [
    { bodyPart: 'chest', baseValue: 88, monthlyChange: 0.3 },
    { bodyPart: 'biceps', baseValue: 26, monthlyChange: 0.5 },
    { bodyPart: 'shoulders', baseValue: 96, monthlyChange: 0.4 },
    { bodyPart: 'waist', baseValue: 72, monthlyChange: -1.2 },
    { bodyPart: 'thighs', baseValue: 54, monthlyChange: -0.5 },
    { bodyPart: 'calves', baseValue: 35, monthlyChange: 0.2 },
    { bodyPart: 'hips', baseValue: 98, monthlyChange: -0.8 },
    { bodyPart: 'weight', baseValue: 65, monthlyChange: -0.8 },
    { bodyPart: 'bodyFat', baseValue: 26, monthlyChange: -1.0 },
  ],
  // Andres - powerlifter
  'Andres Gutierrez': [
    { bodyPart: 'chest', baseValue: 108, monthlyChange: 1.0 },
    { bodyPart: 'biceps', baseValue: 38, monthlyChange: 0.6 },
    { bodyPart: 'shoulders', baseValue: 125, monthlyChange: 0.8 },
    { bodyPart: 'waist', baseValue: 88, monthlyChange: 0.3 },
    { bodyPart: 'thighs', baseValue: 64, monthlyChange: 1.2 },
    { bodyPart: 'calves', baseValue: 40, monthlyChange: 0.4 },
    { bodyPart: 'forearms', baseValue: 32, monthlyChange: 0.5 },
    { bodyPart: 'neck', baseValue: 42, monthlyChange: 0.3 },
    { bodyPart: 'weight', baseValue: 95, monthlyChange: 1.5 },
    { bodyPart: 'bodyFat', baseValue: 20, monthlyChange: 0.2 },
  ],
  // Laura - losing weight
  'Laura Torres': [
    { bodyPart: 'chest', baseValue: 92, monthlyChange: -0.5 },
    { bodyPart: 'biceps', baseValue: 28, monthlyChange: 0.3 },
    { bodyPart: 'waist', baseValue: 78, monthlyChange: -2.0 },
    { bodyPart: 'thighs', baseValue: 58, monthlyChange: -1.0 },
    { bodyPart: 'calves', baseValue: 36, monthlyChange: -0.3 },
    { bodyPart: 'hips', baseValue: 102, monthlyChange: -1.5 },
    { bodyPart: 'weight', baseValue: 72, monthlyChange: -2.0 },
    { bodyPart: 'bodyFat', baseValue: 30, monthlyChange: -1.5 },
  ],
  // Diego - beginner
  'Diego Ramirez': [
    { bodyPart: 'chest', baseValue: 90, monthlyChange: 2.0 },
    { bodyPart: 'biceps', baseValue: 30, monthlyChange: 1.0 },
    { bodyPart: 'shoulders', baseValue: 105, monthlyChange: 1.5 },
    { bodyPart: 'waist', baseValue: 85, monthlyChange: -1.0 },
    { bodyPart: 'thighs', baseValue: 52, monthlyChange: 1.5 },
    { bodyPart: 'forearms', baseValue: 26, monthlyChange: 0.6 },
    { bodyPart: 'weight', baseValue: 74, monthlyChange: 0.5 },
    { bodyPart: 'bodyFat', baseValue: 22, monthlyChange: -1.2 },
  ],
};

const EVENTS_TEMPLATES = [
  { title: 'Coaching Session', event_type: 'coaching', daysFromNow: 2 },
  { title: 'Body Check-in', event_type: 'check_in', daysFromNow: 7 },
  { title: 'Leg Day', event_type: 'workout', daysFromNow: 1 },
  { title: 'Upper Body', event_type: 'workout', daysFromNow: 3 },
  { title: 'Progress Photos', event_type: 'check_in', daysFromNow: 14 },
];

const GOALS: Record<string, { bodyPart: string; target: number }[]> = {
  'Carlos Mendez': [
    { bodyPart: 'chest', target: 102 },
    { bodyPart: 'biceps', target: 38 },
    { bodyPart: 'waist', target: 78 },
    { bodyPart: 'weight', target: 85 },
    { bodyPart: 'bodyFat', target: 12 },
  ],
  'Maria Lopez': [
    { bodyPart: 'waist', target: 65 },
    { bodyPart: 'weight', target: 58 },
    { bodyPart: 'bodyFat', target: 20 },
  ],
  'Diego Ramirez': [
    { bodyPart: 'chest', target: 100 },
    { bodyPart: 'biceps', target: 36 },
    { bodyPart: 'weight', target: 80 },
  ],
};

export async function seedDatabase(db: SQLiteDatabase): Promise<void> {
  // Check if already seeded
  const existingUsers = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM users'
  );
  if (existingUsers && existingUsers.count > 1) return; // Already seeded

  // Delete default user if exists
  await db.runAsync('DELETE FROM users');
  await db.runAsync('DELETE FROM measurements');
  await db.runAsync('DELETE FROM goals');
  await db.runAsync('DELETE FROM events');

  for (const userData of USERS) {
    // Insert user
    const result = await db.runAsync(
      `INSERT INTO users (name, gender, height_cm, unit_system)
       VALUES (?, ?, ?, ?)`,
      [userData.name, userData.gender, userData.height_cm, userData.unit_system]
    );
    const userId = result.lastInsertRowId;

    // Insert measurements — 2 per week for 12 weeks (3 months)
    const templates = MEASUREMENT_TEMPLATES[userData.name] || [];
    const now = new Date();

    for (const tmpl of templates) {
      for (let week = 12; week >= 0; week--) {
        // 2 entries per week
        for (const dayOffset of [0, 3]) {
          const date = new Date(now);
          date.setDate(date.getDate() - (week * 7) + dayOffset);

          const monthsAgo = week / 4.33;
          const progress = (3 - monthsAgo) * tmpl.monthlyChange;
          const noise = (Math.random() - 0.5) * 0.6;
          const value = Math.round((tmpl.baseValue + progress + noise) * 10) / 10;

          await db.runAsync(
            `INSERT INTO measurements (user_id, body_part, value, measured_at)
             VALUES (?, ?, ?, ?)`,
            [userId, tmpl.bodyPart, value, date.toISOString()]
          );
        }
      }
    }

    // Insert goals
    const userGoals = GOALS[userData.name] || [];
    for (const goal of userGoals) {
      await db.runAsync(
        `INSERT INTO goals (user_id, body_part, target_value) VALUES (?, ?, ?)`,
        [userId, goal.bodyPart, goal.target]
      );
    }

    // Insert events for first user only (active user)
    if (userData.name === USERS[0].name) {
      for (const evt of EVENTS_TEMPLATES) {
        const eventDate = new Date(now);
        eventDate.setDate(eventDate.getDate() + evt.daysFromNow);
        await db.runAsync(
          `INSERT INTO events (user_id, title, event_type, start_time)
           VALUES (?, ?, ?, ?)`,
          [userId, evt.title, evt.event_type, eventDate.toISOString()]
        );
      }
    }
  }
}
