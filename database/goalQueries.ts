import type { SQLiteDatabase } from 'expo-sqlite';
import type { Goal } from '@/types/models';
import type { BodyPartKey } from '@/types/bodyParts';

interface GoalRow {
  id: number;
  user_id: number;
  body_part: string;
  target_value: number;
  created_at: string;
}

function rowToGoal(row: GoalRow): Goal {
  return {
    id: row.id,
    userId: row.user_id,
    bodyPart: row.body_part as BodyPartKey,
    targetValue: row.target_value,
    createdAt: row.created_at,
  };
}

export async function getGoals(
  db: SQLiteDatabase,
  userId: number
): Promise<Partial<Record<BodyPartKey, Goal>>> {
  const rows = await db.getAllAsync<GoalRow>(
    'SELECT * FROM goals WHERE user_id = ?',
    [userId]
  );
  const result: Partial<Record<BodyPartKey, Goal>> = {};
  for (const row of rows) {
    result[row.body_part as BodyPartKey] = rowToGoal(row);
  }
  return result;
}

export async function upsertGoal(
  db: SQLiteDatabase,
  userId: number,
  bodyPart: BodyPartKey,
  targetValue: number
): Promise<void> {
  await db.runAsync(
    `INSERT INTO goals (user_id, body_part, target_value)
     VALUES (?, ?, ?)
     ON CONFLICT(user_id, body_part) DO UPDATE SET target_value = ?`,
    [userId, bodyPart, targetValue, targetValue]
  );
}

export async function deleteGoal(
  db: SQLiteDatabase,
  userId: number,
  bodyPart: BodyPartKey
): Promise<void> {
  await db.runAsync(
    'DELETE FROM goals WHERE user_id = ? AND body_part = ?',
    [userId, bodyPart]
  );
}
