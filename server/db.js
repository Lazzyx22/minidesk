import Database from 'better-sqlite3';
export function openDatabase(path = process.env.DB_PATH || './minidesk.db') {
  const db = new Database(path);
  db.pragma('journal_mode = WAL');
  db.exec(`CREATE TABLE IF NOT EXISTS issues (
    id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    priority TEXT NOT NULL CHECK(priority IN ('low','medium','high')),
    status TEXT NOT NULL CHECK(status IN ('open','in_progress','done')),
    created_at TEXT NOT NULL, updated_at TEXT NOT NULL
  )`);
  return db;
}
