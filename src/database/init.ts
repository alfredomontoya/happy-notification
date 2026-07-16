import SQLite from 'react-native-sqlite-storage';
import {Image} from 'react-native';
import * as XLSX from 'xlsx';
import {createPersona} from './personas';
import {buildAutoMapping, parseSheetToPersonas} from '../utils/xlsxParser';

SQLite.enablePromise(true);

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) {
    return db;
  }

  db = await SQLite.openDatabase({
    name: 'stmsc.db',
    location: 'default',
  });

  await db.executeSql(`
    CREATE TABLE IF NOT EXISTS personas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ci TEXT DEFAULT '',
      nombre TEXT NOT NULL,
      cargo TEXT DEFAULT '',
      dependencia TEXT DEFAULT '',
      fecha_nacimiento TEXT NOT NULL
    )
  `);

  await db.executeSql(`
    CREATE TABLE IF NOT EXISTS gestiones (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      year INTEGER NOT NULL,
      titulo TEXT NOT NULL,
      descripcion TEXT DEFAULT '',
      estado TEXT DEFAULT 'activo',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);

  await db.executeSql(`
    CREATE TABLE IF NOT EXISTS funcionarios (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      gestion_id TEXT NOT NULL,
      nro TEXT DEFAULT '',
      ci TEXT DEFAULT '',
      nombres TEXT NOT NULL,
      apellidos TEXT DEFAULT '',
      cargo TEXT DEFAULT '',
      edificio TEXT DEFAULT '',
      tipo TEXT DEFAULT '',
      responsable TEXT DEFAULT '',
      telresponsable TEXT DEFAULT '',
      estado TEXT DEFAULT 'activo',
      entregado INTEGER DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (gestion_id) REFERENCES gestiones(id)
    )
  `);

  const [result] = await db.executeSql(
    'SELECT COUNT(*) as count FROM personas',
  );
  const count = result.rows.item(0).count;

  if (count === 0) {
    await seedFromExcel(db);
  }

  return db;
}

async function seedFromExcel(database: SQLite.SQLiteDatabase) {
  try {
    const assetRef = require('../../assets/cumple.xlsx');
    const source = Image.resolveAssetSource(assetRef);
    const response = await fetch(source.uri);
    const blob = await response.arrayBuffer();
    const workbook = XLSX.read(blob, {type: 'array', cellDates: true});
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json<any[]>(sheet, {
      header: 1,
      raw: true,
    });

    if (data.length < 2) {
      console.warn('El archivo cumple.xlsx debe tener al menos 2 filas');
      return;
    }

    const fileHeaders = data[0].map(h => String(h).trim());
    const fileRows = data.slice(1).filter(r =>
      r.some(c => String(c).trim()),
    );
    const mapping = buildAutoMapping(fileHeaders);
    const personas = parseSheetToPersonas(fileHeaders, fileRows, mapping);

    for (const p of personas) {
      try {
        await createPersona(database, p);
      } catch (e) {
        console.warn('Error insertando persona:', e);
      }
    }
  } catch (e) {
    console.warn('Error al cargar cumple.xlsx:', e);
  }
}
