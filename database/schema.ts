export const CREATE_TABLES = `
  CREATE TABLE IF NOT EXISTS users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    name          TEXT NOT NULL DEFAULT '',
    email         TEXT DEFAULT '',
    avatar_uri    TEXT DEFAULT NULL,
    gender        TEXT NOT NULL DEFAULT 'male' CHECK(gender IN ('male','female')),
    date_of_birth TEXT DEFAULT NULL,
    height_cm     REAL DEFAULT NULL,
    unit_system   TEXT NOT NULL DEFAULT 'metric' CHECK(unit_system IN ('metric','imperial')),
    terms_accepted INTEGER NOT NULL DEFAULT 0,
    terms_accepted_at TEXT DEFAULT NULL,
    fitness_goal  TEXT DEFAULT NULL,
    phone         TEXT DEFAULT NULL,
    password      TEXT DEFAULT NULL,
    created_at    TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS goals (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id       INTEGER NOT NULL REFERENCES users(id),
    body_part     TEXT NOT NULL,
    target_value  REAL NOT NULL,
    created_at    TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(user_id, body_part)
  );

  CREATE TABLE IF NOT EXISTS measurements (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id       INTEGER NOT NULL REFERENCES users(id),
    body_part     TEXT NOT NULL,
    value         REAL NOT NULL,
    measured_at   TEXT NOT NULL DEFAULT (datetime('now')),
    notes         TEXT DEFAULT '',
    created_at    TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_measurements_user_part_date
    ON measurements(user_id, body_part, measured_at DESC);

  CREATE TABLE IF NOT EXISTS events (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id       INTEGER NOT NULL REFERENCES users(id),
    title         TEXT NOT NULL,
    description   TEXT DEFAULT '',
    event_type    TEXT NOT NULL DEFAULT 'coaching'
                  CHECK(event_type IN ('coaching','check_in','workout','custom')),
    start_time    TEXT NOT NULL,
    end_time      TEXT DEFAULT NULL,
    location      TEXT DEFAULT '',
    reminder_mins INTEGER DEFAULT 30,
    is_completed  INTEGER NOT NULL DEFAULT 0,
    created_at    TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_events_user_date
    ON events(user_id, start_time);

  CREATE TABLE IF NOT EXISTS app_meta (
    key   TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`;
