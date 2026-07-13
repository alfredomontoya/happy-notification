import {Funcionario} from './types';
import {getDatabase} from './init';

export async function getAllFuncionarios(): Promise<Funcionario[]> {
  const db = await getDatabase();
  const [result] = await db.executeSql(
    'SELECT * FROM funcionarios ORDER BY nombre ASC',
  );
  const list: Funcionario[] = [];
  for (let i = 0; i < result.rows.length; i++) {
    list.push(result.rows.item(i));
  }
  return list;
}

export async function getFuncionarioById(id: number): Promise<Funcionario | null> {
  const db = await getDatabase();
  const [result] = await db.executeSql(
    'SELECT * FROM funcionarios WHERE id = ?',
    [id],
  );
  if (result.rows.length === 0) return null;
  return result.rows.item(0);
}

export async function createFuncionario(
  data: Omit<Funcionario, 'id'>,
): Promise<number> {
  const db = await getDatabase();
  const [result] = await db.executeSql(
    `INSERT INTO funcionarios (ci, nombre, cargo, dependencia, telefono, email)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [data.ci, data.nombre, data.cargo, data.dependencia, data.telefono, data.email],
  );
  return result.insertId;
}

export async function updateFuncionario(
  id: number,
  data: Omit<Funcionario, 'id'>,
): Promise<void> {
  const db = await getDatabase();
  await db.executeSql(
    `UPDATE funcionarios
     SET ci = ?, nombre = ?, cargo = ?, dependencia = ?, telefono = ?, email = ?
     WHERE id = ?`,
    [data.ci, data.nombre, data.cargo, data.dependencia, data.telefono, data.email, id],
  );
}

export async function deleteFuncionario(id: number): Promise<void> {
  const db = await getDatabase();
  await db.executeSql('DELETE FROM funcionarios WHERE id = ?', [id]);
}
