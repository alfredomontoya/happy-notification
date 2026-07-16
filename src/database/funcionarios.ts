import {Funcionario} from './types';
import {getDatabase} from './init';
import {generateId} from '../utils/uuid';

export async function getFuncionariosByGestion(
  gestionId: string,
): Promise<Funcionario[]> {
  const db = await getDatabase();
  const [result] = await db.executeSql(
    'SELECT * FROM funcionarios WHERE gestion_id = ? ORDER BY nro ASC',
    [gestionId],
  );
  const list: Funcionario[] = [];
  for (let i = 0; i < result.rows.length; i++) {
    list.push(result.rows.item(i));
  }
  return list;
}

export async function getFuncionarioById(
  id: string,
): Promise<Funcionario | null> {
  const db = await getDatabase();
  const [result] = await db.executeSql(
    'SELECT * FROM funcionarios WHERE id = ?',
    [id],
  );
  if (result.rows.length === 0) return null;
  return result.rows.item(0);
}

export async function createFuncionario(
  data: Omit<Funcionario, 'id' | 'created_at' | 'updated_at'>,
): Promise<string> {
  const db = await getDatabase();
  const id = generateId();
  const now = new Date().toISOString();
  await db.executeSql(
    'INSERT INTO funcionarios (id, user_id, gestion_id, nro, ci, nombres, apellidos, cargo, edificio, tipo, responsable, telresponsable, estado, entregado, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      id,
      data.user_id,
      data.gestion_id,
      data.nro,
      data.ci,
      data.nombres,
      data.apellidos,
      data.cargo,
      data.edificio,
      data.tipo,
      data.responsable,
      data.telresponsable,
      data.estado,
      data.entregado,
      now,
      now,
    ],
  );
  return id;
}

export async function updateFuncionario(
  id: string,
  data: Partial<Omit<Funcionario, 'id' | 'created_at'>>,
): Promise<void> {
  const db = await getDatabase();
  const fields: string[] = [];
  const values: any[] = [];
  const allowed = [
    'user_id', 'gestion_id', 'nro', 'ci', 'nombres', 'apellidos',
    'cargo', 'edificio', 'tipo', 'responsable', 'telresponsable',
    'estado', 'entregado',
  ];
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
    'UPDATE funcionarios SET ' + fields.join(', ') + ' WHERE id = ?',
    values,
  );
}

export async function deleteFuncionario(id: string): Promise<void> {
  const db = await getDatabase();
  await db.executeSql('DELETE FROM funcionarios WHERE id = ?', [id]);
}

export async function countFuncionariosByGestion(
  gestionId: string,
): Promise<number> {
  const db = await getDatabase();
  const [result] = await db.executeSql(
    'SELECT COUNT(*) as count FROM funcionarios WHERE gestion_id = ?',
    [gestionId],
  );
  return result.rows.item(0).count;
}

export async function deleteFuncionariosByGestion(
  gestionId: string,
): Promise<void> {
  const db = await getDatabase();
  await db.executeSql('DELETE FROM funcionarios WHERE gestion_id = ?', [gestionId]);
}
