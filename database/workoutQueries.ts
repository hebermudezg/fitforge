import type { SQLiteDatabase } from 'expo-sqlite';

export interface WorkoutSession {
  id: number;
  userId: number;
  workoutName: string;
  startedAt: string;
  completedAt: string | null;
  totalExercises: number;
  completedExercises: number;
  notes: string;
}

export interface WorkoutSet {
  id: number;
  sessionId: number;
  exerciseId: string;
  exerciseName: string;
  setNumber: number;
  reps: number | null;
  weightKg: number | null;
  completed: boolean;
  completedAt: string | null;
}

export async function startWorkoutSession(
  db: SQLiteDatabase,
  userId: number,
  workoutName: string,
  exercises: { id: string; name: string; sets: number }[]
): Promise<number> {
  const result = await db.runAsync(
    `INSERT INTO workout_sessions (user_id, workout_name, total_exercises)
     VALUES (?, ?, ?)`,
    [userId, workoutName, exercises.length]
  );
  const sessionId = result.lastInsertRowId;

  // Create set entries for each exercise
  for (const ex of exercises) {
    for (let s = 1; s <= ex.sets; s++) {
      await db.runAsync(
        `INSERT INTO workout_sets (session_id, exercise_id, exercise_name, set_number)
         VALUES (?, ?, ?, ?)`,
        [sessionId, ex.id, ex.name, s]
      );
    }
  }

  return sessionId;
}

export async function completeSet(
  db: SQLiteDatabase,
  setId: number,
  reps?: number,
  weightKg?: number
): Promise<void> {
  await db.runAsync(
    `UPDATE workout_sets SET completed = 1, completed_at = datetime('now'),
     reps = ?, weight_kg = ? WHERE id = ?`,
    [reps || null, weightKg || null, setId]
  );
}

export async function uncompleteSet(
  db: SQLiteDatabase,
  setId: number
): Promise<void> {
  await db.runAsync(
    'UPDATE workout_sets SET completed = 0, completed_at = NULL WHERE id = ?',
    [setId]
  );
}

export async function getSessionSets(
  db: SQLiteDatabase,
  sessionId: number
): Promise<WorkoutSet[]> {
  const rows = await db.getAllAsync<any>(
    'SELECT * FROM workout_sets WHERE session_id = ? ORDER BY exercise_id, set_number',
    [sessionId]
  );
  return rows.map((r) => ({
    id: r.id,
    sessionId: r.session_id,
    exerciseId: r.exercise_id,
    exerciseName: r.exercise_name,
    setNumber: r.set_number,
    reps: r.reps,
    weightKg: r.weight_kg,
    completed: r.completed === 1,
    completedAt: r.completed_at,
  }));
}

export async function completeWorkoutSession(
  db: SQLiteDatabase,
  sessionId: number
): Promise<void> {
  const completed = await db.getFirstAsync<{ c: number }>(
    'SELECT COUNT(*) as c FROM workout_sets WHERE session_id = ? AND completed = 1',
    [sessionId]
  );
  await db.runAsync(
    `UPDATE workout_sessions SET completed_at = datetime('now'),
     completed_exercises = ? WHERE id = ?`,
    [completed?.c || 0, sessionId]
  );
}

export async function getRecentSessions(
  db: SQLiteDatabase,
  userId: number,
  limit: number = 10
): Promise<WorkoutSession[]> {
  const rows = await db.getAllAsync<any>(
    `SELECT * FROM workout_sessions WHERE user_id = ?
     ORDER BY started_at DESC LIMIT ?`,
    [userId, limit]
  );
  return rows.map((r) => ({
    id: r.id,
    userId: r.user_id,
    workoutName: r.workout_name,
    startedAt: r.started_at,
    completedAt: r.completed_at,
    totalExercises: r.total_exercises,
    completedExercises: r.completed_exercises,
    notes: r.notes,
  }));
}

export async function getActiveSession(
  db: SQLiteDatabase,
  userId: number
): Promise<WorkoutSession | null> {
  const row = await db.getFirstAsync<any>(
    `SELECT * FROM workout_sessions WHERE user_id = ? AND completed_at IS NULL
     ORDER BY started_at DESC LIMIT 1`,
    [userId]
  );
  if (!row) return null;
  return {
    id: row.id,
    userId: row.user_id,
    workoutName: row.workout_name,
    startedAt: row.started_at,
    completedAt: row.completed_at,
    totalExercises: row.total_exercises,
    completedExercises: row.completed_exercises,
    notes: row.notes,
  };
}
