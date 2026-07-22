import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;
  db = await SQLite.openDatabase({
    name: 'awesomeproject.db',
    location: 'default',
  });
  await db.executeSql(`
    CREATE TABLE IF NOT EXISTS personas (
      id TEXT PRIMARY KEY,
      ci TEXT NOT NULL DEFAULT '',
      nombre TEXT NOT NULL,
      cargo TEXT NOT NULL DEFAULT '',
      dependencia TEXT NOT NULL DEFAULT '',
      fecha_nacimiento TEXT NOT NULL,
      birthday_month INTEGER,
      birthday_day INTEGER,
      created_at TEXT NOT NULL
    )
  `);
  return db;
}

export async function initializeDatabase(): Promise<void> {
  await getDatabase();
}
