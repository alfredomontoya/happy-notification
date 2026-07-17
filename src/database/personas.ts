import {getFirestoreDB} from './firebase';
import type {Persona} from './types';
import type {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {
  getCachedPersonas,
  setCachedPersonas,
  invalidatePersonasCache,
} from './personasCache';

const COLLECTION = 'personas';

function collectionRef() {
  return getFirestoreDB().collection(COLLECTION);
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

export async function getAllPersonas(): Promise<Persona[]> {
  const cached = getCachedPersonas();
  if (cached) return cached;

  const snapshot = await collectionRef()
    .orderBy('nombre', 'asc')
    .get();
  const list: Persona[] = [];
  snapshot.forEach((doc: FirebaseFirestoreTypes.DocumentSnapshot) =>
    list.push({id: doc.id, ...doc.data()} as Persona),
  );
  setCachedPersonas(list);
  return list;
}

export async function getPersonaById(id: string): Promise<Persona | null> {
  const doc = await collectionRef().doc(id).get();
  if (!doc.exists) return null;
  return {id: doc.id, ...doc.data()} as Persona;
}

export async function createPersona(
  data: Omit<Persona, 'id' | 'created_at' | 'birthday_month' | 'birthday_day'>,
): Promise<string> {
  const now = new Date().toISOString();
  const birthday = computeBirthdayFields(data.fecha_nacimiento);
  const doc = await collectionRef().add({
    ...data,
    ...birthday,
    created_at: now,
  });
  invalidatePersonasCache();
  return doc.id;
}

export async function updatePersona(
  id: string,
  data: Partial<
    Omit<Persona, 'id' | 'created_at' | 'birthday_month' | 'birthday_day'>
  >,
): Promise<void> {
  const updateData: Record<string, unknown> = {...data};
  if (data.fecha_nacimiento) {
    const birthday = computeBirthdayFields(data.fecha_nacimiento);
    updateData.birthday_month = birthday.birthday_month;
    updateData.birthday_day = birthday.birthday_day;
  }
  await collectionRef().doc(id).update(updateData);
  invalidatePersonasCache();
}

export async function deletePersona(id: string): Promise<void> {
  await collectionRef().doc(id).delete();
  invalidatePersonasCache();
}

export async function getPersonasByMonth(
  month: number,
): Promise<Persona[]> {
  const snapshot = await collectionRef()
    .where('birthday_month', '==', month)
    .orderBy('birthday_day', 'asc')
    .get();
  const list: Persona[] = [];
  snapshot.forEach((doc: FirebaseFirestoreTypes.DocumentSnapshot) =>
    list.push({id: doc.id, ...doc.data()} as Persona),
  );
  return list;
}

export async function getPersonasByDay(
  month: number,
  day: number,
): Promise<Persona[]> {
  const snapshot = await collectionRef()
    .where('birthday_month', '==', month)
    .where('birthday_day', '==', day)
    .get();
  const list: Persona[] = [];
  snapshot.forEach((doc: FirebaseFirestoreTypes.DocumentSnapshot) =>
    list.push({id: doc.id, ...doc.data()} as Persona),
  );
  return list;
}

export async function importPersonas(
  data: Omit<Persona, 'id' | 'created_at' | 'birthday_month' | 'birthday_day'>[],
): Promise<number> {
  const db = getFirestoreDB();
  const batch = db.batch();
  const now = new Date().toISOString();
  for (const p of data) {
    const birthday = computeBirthdayFields(p.fecha_nacimiento);
    const ref = collectionRef().doc();
    batch.set(ref, {...p, ...birthday, created_at: now});
  }
  await batch.commit();
  invalidatePersonasCache();
  return data.length;
}

export async function limpiarPersonas(): Promise<void> {
  const snapshot = await collectionRef().get();
  const db = getFirestoreDB();
  const batch = db.batch();
  snapshot.forEach((doc: FirebaseFirestoreTypes.DocumentSnapshot) =>
    batch.delete(doc.ref),
  );
  await batch.commit();
  invalidatePersonasCache();
}
