import type { SQLiteDatabase } from 'expo-sqlite';
import type { CalendarEvent } from '@/types/models';

interface EventRow {
  id: number;
  user_id: number;
  title: string;
  description: string;
  event_type: string;
  start_time: string;
  end_time: string | null;
  location: string;
  reminder_mins: number;
  is_completed: number;
  created_at: string;
  updated_at: string;
}

function rowToEvent(row: EventRow): CalendarEvent {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    description: row.description,
    eventType: row.event_type as CalendarEvent['eventType'],
    startTime: row.start_time,
    endTime: row.end_time,
    location: row.location,
    reminderMins: row.reminder_mins,
    isCompleted: row.is_completed === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function insertEvent(
  db: SQLiteDatabase,
  userId: number,
  event: {
    title: string;
    description?: string;
    eventType: CalendarEvent['eventType'];
    startTime: string;
    endTime?: string;
    location?: string;
    reminderMins?: number;
  }
): Promise<number> {
  const result = await db.runAsync(
    `INSERT INTO events (user_id, title, description, event_type, start_time, end_time, location, reminder_mins)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      userId,
      event.title,
      event.description || '',
      event.eventType,
      event.startTime,
      event.endTime || null,
      event.location || '',
      event.reminderMins ?? 30,
    ]
  );
  return result.lastInsertRowId;
}

export async function getEventsByMonth(
  db: SQLiteDatabase,
  userId: number,
  year: number,
  month: number
): Promise<CalendarEvent[]> {
  const startDate = `${year}-${String(month).padStart(2, '0')}-01T00:00:00`;
  const endMonth = month === 12 ? 1 : month + 1;
  const endYear = month === 12 ? year + 1 : year;
  const endDate = `${endYear}-${String(endMonth).padStart(2, '0')}-01T00:00:00`;

  const rows = await db.getAllAsync<EventRow>(
    `SELECT * FROM events
     WHERE user_id = ? AND start_time >= ? AND start_time < ?
     ORDER BY start_time ASC`,
    [userId, startDate, endDate]
  );
  return rows.map(rowToEvent);
}

export async function getUpcomingEvents(
  db: SQLiteDatabase,
  userId: number,
  limit: number = 5
): Promise<CalendarEvent[]> {
  const now = new Date().toISOString();
  const rows = await db.getAllAsync<EventRow>(
    `SELECT * FROM events
     WHERE user_id = ? AND start_time >= ? AND is_completed = 0
     ORDER BY start_time ASC LIMIT ?`,
    [userId, now, limit]
  );
  return rows.map(rowToEvent);
}

export async function updateEvent(
  db: SQLiteDatabase,
  eventId: number,
  updates: Partial<Pick<CalendarEvent, 'title' | 'description' | 'eventType' | 'startTime' | 'endTime' | 'location' | 'reminderMins' | 'isCompleted'>>
): Promise<void> {
  const fields: string[] = [];
  const values: any[] = [];

  if (updates.title !== undefined) { fields.push('title = ?'); values.push(updates.title); }
  if (updates.description !== undefined) { fields.push('description = ?'); values.push(updates.description); }
  if (updates.eventType !== undefined) { fields.push('event_type = ?'); values.push(updates.eventType); }
  if (updates.startTime !== undefined) { fields.push('start_time = ?'); values.push(updates.startTime); }
  if (updates.endTime !== undefined) { fields.push('end_time = ?'); values.push(updates.endTime); }
  if (updates.location !== undefined) { fields.push('location = ?'); values.push(updates.location); }
  if (updates.reminderMins !== undefined) { fields.push('reminder_mins = ?'); values.push(updates.reminderMins); }
  if (updates.isCompleted !== undefined) { fields.push('is_completed = ?'); values.push(updates.isCompleted ? 1 : 0); }

  if (fields.length === 0) return;

  fields.push("updated_at = datetime('now')");
  values.push(eventId);

  await db.runAsync(
    `UPDATE events SET ${fields.join(', ')} WHERE id = ?`,
    values
  );
}

export async function deleteEvent(
  db: SQLiteDatabase,
  eventId: number
): Promise<void> {
  await db.runAsync('DELETE FROM events WHERE id = ?', [eventId]);
}

export async function getEvent(
  db: SQLiteDatabase,
  eventId: number
): Promise<CalendarEvent | null> {
  const row = await db.getFirstAsync<EventRow>(
    'SELECT * FROM events WHERE id = ?',
    [eventId]
  );
  return row ? rowToEvent(row) : null;
}
