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
  // Prefer real user (terms accepted) over seed/demo users
  const realUser = await db.getFirstAsync<UserRow>(
    'SELECT * FROM users WHERE terms_accepted = 1 ORDER BY id DESC LIMIT 1'
  );
  if (realUser) return rowToUser(realUser);

  // Fallback to any user
  const anyUser = await db.getFirstAsync<UserRow>('SELECT * FROM users LIMIT 1');
  if (anyUser) return rowToUser(anyUser);

  // Create new empty user
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
  updates: Partial<Pick<User, 'name' | 'email' | 'avatarUri' | 'gender' | 'dateOfBirth' | 'heightCm' | 'unitSystem'> & { phone?: string; termsAccepted?: boolean; fitnessGoal?: string }>
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
  if (updates.phone !== undefined) { fields.push('phone = ?'); values.push(updates.phone); }
  if (updates.termsAccepted !== undefined) { fields.push('terms_accepted = ?'); values.push(updates.termsAccepted ? 1 : 0); fields.push("terms_accepted_at = datetime('now')"); }
  if (updates.fitnessGoal !== undefined) { fields.push('fitness_goal = ?'); values.push(updates.fitnessGoal); }

  if (fields.length === 0) return;

  fields.push("updated_at = datetime('now')");
  values.push(userId);

  await db.runAsync(
    `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
    values
  );
}

export async function loginUser(
  db: SQLiteDatabase,
  email: string,
  password: string
): Promise<User | null> {
  // First try exact match
  const row = await db.getFirstAsync<UserRow & { password?: string }>(
    'SELECT * FROM users WHERE email = ? AND password = ?',
    [email, password]
  );
  if (row) return rowToUser(row);

  // Debug: check if user exists without password check
  const userExists = await db.getFirstAsync<{ id: number; email: string; password: string | null }>(
    'SELECT id, email, password FROM users WHERE email = ?',
    [email]
  );
  if (userExists) {
    console.log('User found but password mismatch:', {
      email, providedPass: password, storedPass: userExists.password,
    });
  } else {
    // List all users for debug
    const allUsers = await db.getAllAsync<{ id: number; email: string; password: string | null }>(
      'SELECT id, email, password FROM users'
    );
    console.log('No user with that email. All users:', allUsers);
  }

  return null;
}

export async function getUserById(
  db: SQLiteDatabase,
  userId: number
): Promise<User | null> {
  const row = await db.getFirstAsync<UserRow>(
    'SELECT * FROM users WHERE id = ?',
    [userId]
  );
  return row ? rowToUser(row) : null;
}

export async function getAllUsers(db: SQLiteDatabase): Promise<User[]> {
  const rows = await db.getAllAsync<UserRow>('SELECT * FROM users ORDER BY id');
  return rows.map(rowToUser);
}
