import type { SQLiteDatabase } from 'expo-sqlite';
import type { Measurement } from '@/types/models';
import type { BodyPartKey } from '@/types/bodyParts';

interface MeasurementRow {
  id: number;
  user_id: number;
  body_part: string;
  value: number;
  measured_at: string;
  notes: string;
  created_at: string;
}

function rowToMeasurement(row: MeasurementRow): Measurement {
  return {
    id: row.id,
    userId: row.user_id,
    bodyPart: row.body_part as BodyPartKey,
    value: row.value,
    measuredAt: row.measured_at,
    notes: row.notes,
    createdAt: row.created_at,
  };
}

export async function insertMeasurement(
  db: SQLiteDatabase,
  userId: number,
  bodyPart: BodyPartKey,
  value: number,
  measuredAt?: string,
  notes?: string
): Promise<number> {
  const result = await db.runAsync(
    `INSERT INTO measurements (user_id, body_part, value, measured_at, notes)
     VALUES (?, ?, ?, ?, ?)`,
    [
      userId,
      bodyPart,
      value,
      measuredAt || new Date().toISOString(),
      notes || '',
    ]
  );
  return result.lastInsertRowId;
}

export async function getLatestMeasurements(
  db: SQLiteDatabase,
  userId: number
): Promise<Partial<Record<BodyPartKey, Measurement>>> {
  const rows = await db.getAllAsync<MeasurementRow>(
    `SELECT m.* FROM measurements m
     INNER JOIN (
       SELECT body_part, MAX(measured_at) as max_date
       FROM measurements WHERE user_id = ?
       GROUP BY body_part
     ) latest ON m.body_part = latest.body_part AND m.measured_at = latest.max_date
     WHERE m.user_id = ?`,
    [userId, userId]
  );

  const result: Partial<Record<BodyPartKey, Measurement>> = {};
  for (const row of rows) {
    result[row.body_part as BodyPartKey] = rowToMeasurement(row);
  }
  return result;
}

export async function getMeasurementHistory(
  db: SQLiteDatabase,
  userId: number,
  bodyPart: BodyPartKey,
  fromDate?: string,
  toDate?: string
): Promise<Measurement[]> {
  let query = 'SELECT * FROM measurements WHERE user_id = ? AND body_part = ?';
  const params: any[] = [userId, bodyPart];

  if (fromDate) {
    query += ' AND measured_at >= ?';
    params.push(fromDate);
  }
  if (toDate) {
    query += ' AND measured_at <= ?';
    params.push(toDate);
  }

  query += ' ORDER BY measured_at ASC';

  const rows = await db.getAllAsync<MeasurementRow>(query, params);
  return rows.map(rowToMeasurement);
}

export async function getMeasurementStats(
  db: SQLiteDatabase,
  userId: number,
  bodyPart: BodyPartKey,
  fromDate?: string
): Promise<{ min: number; max: number; avg: number; count: number; change: number }> {
  let query = `SELECT MIN(value) as min_val, MAX(value) as max_val,
               AVG(value) as avg_val, COUNT(*) as count_val
               FROM measurements WHERE user_id = ? AND body_part = ?`;
  const params: any[] = [userId, bodyPart];

  if (fromDate) {
    query += ' AND measured_at >= ?';
    params.push(fromDate);
  }

  const row = await db.getFirstAsync<{
    min_val: number; max_val: number; avg_val: number; count_val: number;
  }>(query, params);

  // Calculate change (latest - earliest in range)
  let changeQuery = `SELECT value FROM measurements
                     WHERE user_id = ? AND body_part = ?`;
  const changeParams: any[] = [userId, bodyPart];
  if (fromDate) {
    changeQuery += ' AND measured_at >= ?';
    changeParams.push(fromDate);
  }
  changeQuery += ' ORDER BY measured_at';

  const all = await db.getAllAsync<{ value: number }>(changeQuery, changeParams);
  const change = all.length >= 2 ? all[all.length - 1].value - all[0].value : 0;

  return {
    min: row?.min_val ?? 0,
    max: row?.max_val ?? 0,
    avg: Math.round((row?.avg_val ?? 0) * 10) / 10,
    count: row?.count_val ?? 0,
    change: Math.round(change * 10) / 10,
  };
}

export async function getRecentMeasurements(
  db: SQLiteDatabase,
  userId: number,
  limit: number = 10
): Promise<Measurement[]> {
  const rows = await db.getAllAsync<MeasurementRow>(
    'SELECT * FROM measurements WHERE user_id = ? ORDER BY measured_at DESC LIMIT ?',
    [userId, limit]
  );
  return rows.map(rowToMeasurement);
}

export async function deleteMeasurement(
  db: SQLiteDatabase,
  id: number
): Promise<void> {
  await db.runAsync('DELETE FROM measurements WHERE id = ?', [id]);
}
