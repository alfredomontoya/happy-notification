import {getFirestoreDB} from './firebase';
import {getDatabase} from './sqlite';
import type {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';

export async function migrateFromFirestore(): Promise<number> {
  const db = await getDatabase();

  const [checkResults] = await db.executeSql(
    'SELECT COUNT(*) AS count FROM personas',
  );
  if (checkResults.rows.item(0).count > 0) {
    return 0;
  }

  const snapshot = await getFirestoreDB().collection('personas').get();
  if (snapshot.size === 0) return 0;

  const rows: any[] = [];
  snapshot.forEach((doc: FirebaseFirestoreTypes.DocumentSnapshot) =>
    rows.push({id: doc.id, ...doc.data()}),
  );

  for (const p of rows) {
    await db.executeSql(
      `INSERT OR IGNORE INTO personas (id, ci, nombre, cargo, dependencia, fecha_nacimiento, birthday_month, birthday_day, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        p.id,
        p.ci ?? '',
        p.nombre ?? '',
        p.cargo ?? '',
        p.dependencia ?? '',
        p.fecha_nacimiento ?? '',
        p.birthday_month ?? null,
        p.birthday_day ?? null,
        p.created_at ?? new Date().toISOString(),
      ],
    );
  }

  return rows.length;
}
