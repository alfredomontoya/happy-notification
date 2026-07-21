import {getDatabase} from './sqlite';
import type {Persona} from './types';
import {
  getCachedPersonas,
  setCachedPersonas,
  invalidatePersonasCache,
} from './personasCache';

function generateId(): string {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 10);
  return `${ts}${rand}`;
}

function computeBirthdayFields(
  fecha: string,
): {birthday_month: number; birthday_day: number} {
  const d = new Date(fecha);
  return {
    birthday_month: d.getMonth() + 1,
    birthday_day: d.getDate(),
  };
}

function rowToPersona(row: any): Persona {
  return {
    id: row.id,
    ci: row.ci,
    nombre: row.nombre,
    cargo: row.cargo,
    dependencia: row.dependencia,
    fecha_nacimiento: row.fecha_nacimiento,
    birthday_month: row.birthday_month,
    birthday_day: row.birthday_day,
    created_at: row.created_at,
  };
}

export async function getAllPersonas(): Promise<Persona[]> {
  const cached = getCachedPersonas();
  if (cached) return cached;

  const db = await getDatabase();
  const [results] = await db.executeSql(
    'SELECT * FROM personas ORDER BY nombre ASC',
  );
  const list: Persona[] = [];
  for (let i = 0; i < results.rows.length; i++) {
    list.push(rowToPersona(results.rows.item(i)));
  }
  setCachedPersonas(list);
  return list;
}

export async function getPersonaById(id: string): Promise<Persona | null> {
  const db = await getDatabase();
  const [results] = await db.executeSql(
    'SELECT * FROM personas WHERE id = ?',
    [id],
  );
  if (results.rows.length === 0) return null;
  return rowToPersona(results.rows.item(0));
}

export async function createPersona(
  data: Omit<Persona, 'id' | 'created_at' | 'birthday_month' | 'birthday_day'>,
): Promise<string> {
  const db = await getDatabase();
  const id = generateId();
  const now = new Date().toISOString();
  const birthday = computeBirthdayFields(data.fecha_nacimiento);

  await db.executeSql(
    `INSERT INTO personas (id, ci, nombre, cargo, dependencia, fecha_nacimiento, birthday_month, birthday_day, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      data.ci,
      data.nombre,
      data.cargo,
      data.dependencia,
      data.fecha_nacimiento,
      birthday.birthday_month,
      birthday.birthday_day,
      now,
    ],
  );

  invalidatePersonasCache();
  return id;
}

export async function updatePersona(
  id: string,
  data: Partial<
    Omit<Persona, 'id' | 'created_at' | 'birthday_month' | 'birthday_day'>
  >,
): Promise<void> {
  const db = await getDatabase();
  const fields: string[] = [];
  const values: any[] = [];

  if (data.ci !== undefined) {
    fields.push('ci = ?');
    values.push(data.ci);
  }
  if (data.nombre !== undefined) {
    fields.push('nombre = ?');
    values.push(data.nombre);
  }
  if (data.cargo !== undefined) {
    fields.push('cargo = ?');
    values.push(data.cargo);
  }
  if (data.dependencia !== undefined) {
    fields.push('dependencia = ?');
    values.push(data.dependencia);
  }
  if (data.fecha_nacimiento !== undefined) {
    const birthday = computeBirthdayFields(data.fecha_nacimiento);
    fields.push('fecha_nacimiento = ?');
    values.push(data.fecha_nacimiento);
    fields.push('birthday_month = ?');
    values.push(birthday.birthday_month);
    fields.push('birthday_day = ?');
    values.push(birthday.birthday_day);
  }

  if (fields.length === 0) return;

  values.push(id);
  await db.executeSql(
    `UPDATE personas SET ${fields.join(', ')} WHERE id = ?`,
    values,
  );

  invalidatePersonasCache();
}

export async function deletePersona(id: string): Promise<void> {
  const db = await getDatabase();
  await db.executeSql('DELETE FROM personas WHERE id = ?', [id]);
  invalidatePersonasCache();
}

export async function getPersonasByMonth(month: number): Promise<Persona[]> {
  const db = await getDatabase();
  const [results] = await db.executeSql(
    'SELECT * FROM personas WHERE birthday_month = ? ORDER BY birthday_day ASC',
    [month],
  );
  const list: Persona[] = [];
  for (let i = 0; i < results.rows.length; i++) {
    list.push(rowToPersona(results.rows.item(i)));
  }
  return list;
}

export async function getPersonasByDay(
  month: number,
  day: number,
): Promise<Persona[]> {
  const db = await getDatabase();
  const [results] = await db.executeSql(
    'SELECT * FROM personas WHERE birthday_month = ? AND birthday_day = ?',
    [month, day],
  );
  const list: Persona[] = [];
  for (let i = 0; i < results.rows.length; i++) {
    list.push(rowToPersona(results.rows.item(i)));
  }
  return list;
}

export async function importPersonas(
  data: Omit<Persona, 'id' | 'created_at' | 'birthday_month' | 'birthday_day'>[],
): Promise<number> {
  const db = await getDatabase();
  const now = new Date().toISOString();

  await db.transaction(async tx => {
    for (const p of data) {
      const id = generateId();
      const birthday = computeBirthdayFields(p.fecha_nacimiento);
      tx.executeSql(
        `INSERT INTO personas (id, ci, nombre, cargo, dependencia, fecha_nacimiento, birthday_month, birthday_day, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          p.ci,
          p.nombre,
          p.cargo,
          p.dependencia,
          p.fecha_nacimiento,
          birthday.birthday_month,
          birthday.birthday_day,
          now,
        ],
      );
    }
  });

  invalidatePersonasCache();
  return data.length;
}

export async function limpiarPersonas(): Promise<void> {
  const db = await getDatabase();
  await db.executeSql('DELETE FROM personas');
  invalidatePersonasCache();
}
