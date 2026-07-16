import {Gestion} from './types';
import {getDatabase} from './init';
import {generateId} from '../utils/uuid';

export async function getAllGestiones(): Promise<Gestion[]> {
  const db = await getDatabase();
  const [result] = await db.executeSql(
    'SELECT * FROM gestiones ORDER BY year DESC, created_at DESC',
  );
  const list: Gestion[] = [];
  for (let i = 0; i < result.rows.length; i++) {
    list.push(result.rows.item(i));
  }
  return list;
}

export async function getGestionById(id: string): Promise<Gestion | null> {
  const db = await getDatabase();
  const [result] = await db.executeSql(
    'SELECT * FROM gestiones WHERE id = ?',
    [id],
  );
  if (result.rows.length === 0) return null;
  return result.rows.item(0);
}

export async function createGestion(
  data: Omit<Gestion, 'id' | 'created_at' | 'updated_at'>,
): Promise<string> {
  const db = await getDatabase();
  const id = generateId();
  const now = new Date().toISOString();
  await db.executeSql(
    'INSERT INTO gestiones (id, user_id, year, titulo, descripcion, estado, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [id, data.user_id, data.year, data.titulo, data.descripcion, data.estado, now, now],
  );
  return id;
}

export async function updateGestion(
  id: string,
  data: Partial<Omit<Gestion, 'id' | 'created_at'>>,
): Promise<void> {
  const db = await getDatabase();
  const fields: string[] = [];
  const values: any[] = [];
  const allowed = ['user_id', 'year', 'titulo', 'descripcion', 'estado'];
  for (const key of allowed) {
    if ((data as any)[key] !== undefined) {
      fields.push(key + ' = ?');
      values.push((data as any)[key]);
    }
  }
  if (fields.length === 0) return;
  const now = new Date().toISOString();
  fields.push('updated_at = ?');
  values.push(now);
  values.push(id);
  await db.executeSql(
    'UPDATE gestiones SET ' + fields.join(', ') + ' WHERE id = ?',
    values,
  );
}

export async function deleteGestion(id: string): Promise<void> {
  const db = await getDatabase();
  await db.executeSql('DELETE FROM gestiones WHERE id = ?', [id]);
}
