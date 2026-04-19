import type { SQLiteDatabase } from 'expo-sqlite';
import type { User } from '@/types/models';

interface UserRow {
  id: number;
  name: string;
  email: string;
  avatar_uri: string | null;
  gender: string;
  date_of_birth: string | null;
  height_cm: number | null;
  unit_system: string;
  created_at: string;
  updated_at: string;
}

function rowToUser(row: UserRow): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    avatarUri: row.avatar_uri,
    gender: row.gender as 'male' | 'female',
    dateOfBirth: row.date_of_birth,
    heightCm: row.height_cm,
    unitSystem: row.unit_system as 'metric' | 'imperial',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getOrCreateUser(db: SQLiteDatabase): Promise<User> {
  const row = await db.getFirstAsync<UserRow>('SELECT * FROM users LIMIT 1');
  if (row) return rowToUser(row);

  const result = await db.runAsync(
    "INSERT INTO users (name, gender, unit_system) VALUES ('', 'male', 'metric')"
  );
  const newRow = await db.getFirstAsync<UserRow>(
    'SELECT * FROM users WHERE id = ?',
    [result.lastInsertRowId]
  );
  return rowToUser(newRow!);
}

export async function updateUser(
  db: SQLiteDatabase,
  userId: number,
  updates: Partial<Pick<User, 'name' | 'email' | 'avatarUri' | 'gender' | 'dateOfBirth' | 'heightCm' | 'unitSystem'>>
): Promise<void> {
  const fields: string[] = [];
  const values: any[] = [];

  if (updates.name !== undefined) { fields.push('name = ?'); values.push(updates.name); }
  if (updates.email !== undefined) { fields.push('email = ?'); values.push(updates.email); }
  if (updates.avatarUri !== undefined) { fields.push('avatar_uri = ?'); values.push(updates.avatarUri); }
  if (updates.gender !== undefined) { fields.push('gender = ?'); values.push(updates.gender); }
  if (updates.dateOfBirth !== undefined) { fields.push('date_of_birth = ?'); values.push(updates.dateOfBirth); }
  if (updates.heightCm !== undefined) { fields.push('height_cm = ?'); values.push(updates.heightCm); }
  if (updates.unitSystem !== undefined) { fields.push('unit_system = ?'); values.push(updates.unitSystem); }

  if (fields.length === 0) return;

  fields.push("updated_at = datetime('now')");
  values.push(userId);

  await db.runAsync(
    `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
    values
  );
}
