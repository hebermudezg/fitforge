import type { SQLiteDatabase } from 'expo-sqlite';

interface DemoUser {
  name: string;
  gender: 'male' | 'female';
  height_cm: number;
  fitness_goal: string;
  // Baseline measurements (cm except weight=kg, bodyFat=%)
  measurements: Record<string, { base: number; change: number }>;
}

const DEMO_USERS: DemoUser[] = [
  {
    name: 'Diego Torres',
    gender: 'male',
    height_cm: 180,
    fitness_goal: 'build',
    measurements: {
      // Big muscular man
      neck: { base: 42, change: 0.3 },
      trapezius: { base: 48, change: 0.4 },
      deltoids: { base: 52, change: 0.6 },
      chest: { base: 110, change: 1.5 },
      biceps: { base: 40, change: 0.8 },
      triceps: { base: 38, change: 0.6 },
      forearms: { base: 33, change: 0.4 },
      abs: { base: 80, change: -0.5 },
      obliques: { base: 78, change: -0.4 },
      upperBack: { base: 48, change: 0.5 },
      lowerBack: { base: 38, change: 0.3 },
      gluteal: { base: 102, change: 0.4 },
      quadriceps: { base: 64, change: 1.2 },
      hamstring: { base: 58, change: 0.8 },
      adductors: { base: 56, change: 0.5 },
      calves: { base: 42, change: 0.4 },
      weight: { base: 92, change: 1.0 },
      bodyFat: { base: 12, change: -0.3 },
      waist: { base: 80, change: -0.5 },
      hips: { base: 98, change: 0.2 },
    },
  },
  {
    name: 'Valentina Rojas',
    gender: 'female',
    height_cm: 168,
    fitness_goal: 'build',
    measurements: {
      // Muscular/fit woman
      neck: { base: 33, change: 0.1 },
      trapezius: { base: 38, change: 0.3 },
      deltoids: { base: 40, change: 0.5 },
      chest: { base: 92, change: 0.5 },
      biceps: { base: 30, change: 0.6 },
      triceps: { base: 27, change: 0.4 },
      forearms: { base: 25, change: 0.3 },
      abs: { base: 68, change: -0.8 },
      obliques: { base: 66, change: -0.6 },
      upperBack: { base: 38, change: 0.4 },
      lowerBack: { base: 32, change: 0.2 },
      gluteal: { base: 100, change: 1.0 },
      quadriceps: { base: 58, change: 1.0 },
      hamstring: { base: 54, change: 0.8 },
      adductors: { base: 52, change: 0.5 },
      calves: { base: 36, change: 0.3 },
      weight: { base: 62, change: 0.5 },
      bodyFat: { base: 18, change: -0.5 },
      waist: { base: 66, change: -1.0 },
      hips: { base: 96, change: 0.5 },
    },
  },
  {
    name: 'Andres Medina',
    gender: 'male',
    height_cm: 175,
    fitness_goal: 'lose',
    measurements: {
      // Normal/average man trying to get fit
      neck: { base: 38, change: 0.1 },
      trapezius: { base: 40, change: 0.2 },
      deltoids: { base: 42, change: 0.3 },
      chest: { base: 95, change: 0.5 },
      biceps: { base: 32, change: 0.4 },
      triceps: { base: 30, change: 0.3 },
      forearms: { base: 27, change: 0.2 },
      abs: { base: 88, change: -1.0 },
      obliques: { base: 85, change: -0.8 },
      quadriceps: { base: 54, change: 0.5 },
      hamstring: { base: 50, change: 0.3 },
      gluteal: { base: 96, change: 0.2 },
      calves: { base: 37, change: 0.2 },
      weight: { base: 82, change: -1.5 },
      bodyFat: { base: 24, change: -1.0 },
      waist: { base: 90, change: -1.5 },
      hips: { base: 98, change: -0.5 },
    },
  },
  {
    name: 'Camila Vargas',
    gender: 'female',
    height_cm: 163,
    fitness_goal: 'maintain',
    measurements: {
      // Normal woman maintaining
      neck: { base: 31, change: 0 },
      deltoids: { base: 36, change: 0.2 },
      chest: { base: 88, change: 0.1 },
      biceps: { base: 26, change: 0.2 },
      forearms: { base: 22, change: 0.1 },
      abs: { base: 72, change: -0.3 },
      obliques: { base: 70, change: -0.2 },
      gluteal: { base: 96, change: 0.3 },
      quadriceps: { base: 52, change: 0.3 },
      hamstring: { base: 48, change: 0.2 },
      calves: { base: 34, change: 0.1 },
      weight: { base: 58, change: -0.3 },
      bodyFat: { base: 25, change: -0.4 },
      waist: { base: 70, change: -0.3 },
      hips: { base: 94, change: 0 },
    },
  },
];

export async function seedDatabase(db: SQLiteDatabase): Promise<void> {
  const seeded = await db.getFirstAsync<{ value: string }>(
    "SELECT value FROM app_meta WHERE key = 'seeded'"
  );
  if (seeded) return;

  const now = new Date();

  for (const demo of DEMO_USERS) {
    const userResult = await db.runAsync(
      `INSERT INTO users (name, gender, height_cm, unit_system, terms_accepted, fitness_goal)
       VALUES (?, ?, ?, 'metric', 0, ?)`,
      [demo.name, demo.gender, demo.height_cm, demo.fitness_goal]
    );
    const userId = userResult.lastInsertRowId;

    // 12 weeks of measurements, 2x per week
    for (const [part, config] of Object.entries(demo.measurements)) {
      for (let week = 12; week >= 0; week--) {
        for (const dayOff of [0, 4]) {
          const date = new Date(now);
          date.setDate(date.getDate() - (week * 7) + dayOff);
          const monthsAgo = week / 4.33;
          const progress = (3 - monthsAgo) * config.change;
          const noise = (Math.random() - 0.5) * 0.4;
          const value = Math.round((config.base + progress + noise) * 10) / 10;
          await db.runAsync(
            'INSERT INTO measurements (user_id, body_part, value, measured_at) VALUES (?, ?, ?, ?)',
            [userId, part, value, date.toISOString()]
          );
        }
      }
    }

    // Goals for build users
    if (demo.fitness_goal === 'build') {
      const goals = [
        { part: 'chest', target: demo.measurements.chest.base + 10 },
        { part: 'biceps', target: demo.measurements.biceps.base + 5 },
        { part: 'quadriceps', target: demo.measurements.quadriceps.base + 8 },
      ];
      for (const g of goals) {
        await db.runAsync(
          'INSERT INTO goals (user_id, body_part, target_value) VALUES (?, ?, ?)',
          [userId, g.part, g.target]
        );
      }
    }
  }

  // Events for first user
  const firstUser = await db.getFirstAsync<{ id: number }>('SELECT id FROM users LIMIT 1');
  if (firstUser) {
    for (const evt of [
      { title: 'Coaching Session', type: 'coaching', days: 2 },
      { title: 'Body Check-in', type: 'check_in', days: 7 },
      { title: 'Leg Day', type: 'workout', days: 1 },
    ]) {
      const d = new Date(now);
      d.setDate(d.getDate() + evt.days);
      await db.runAsync(
        'INSERT INTO events (user_id, title, event_type, start_time) VALUES (?, ?, ?, ?)',
        [firstUser.id, evt.title, evt.type, d.toISOString()]
      );
    }
  }

  await db.runAsync("INSERT OR REPLACE INTO app_meta (key, value) VALUES ('seeded', '1')");
}
