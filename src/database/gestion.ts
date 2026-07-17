import {getFirestoreDB} from './firebase';
import type {Gestion} from './types';
import type {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';

const COLLECTION = 'gestiones';

function collectionRef() {
  return getFirestoreDB().collection(COLLECTION);
}

export async function getAllGestiones(): Promise<Gestion[]> {
  const snapshot = await collectionRef()
    .orderBy('year', 'desc')
    .orderBy('created_at', 'desc')
    .get();
  const list: Gestion[] = [];
  snapshot.forEach((doc: FirebaseFirestoreTypes.DocumentSnapshot) =>
    list.push({id: doc.id, ...doc.data()} as Gestion),
  );
  return list;
}

export async function getGestionById(
  id: string,
): Promise<Gestion | null> {
  const doc = await collectionRef().doc(id).get();
  if (!doc.exists) return null;
  return {id: doc.id, ...doc.data()} as Gestion;
}

export async function createGestion(
  data: Omit<Gestion, 'id' | 'created_at' | 'updated_at'>,
): Promise<string> {
  const now = new Date().toISOString();
  const docRef = await collectionRef().add({
    ...data,
    created_at: now,
    updated_at: now,
  });
  return docRef.id;
}

export async function updateGestion(
  id: string,
  data: Partial<Omit<Gestion, 'id' | 'created_at'>>,
): Promise<void> {
  const now = new Date().toISOString();
  await collectionRef().doc(id).update({
    ...data,
    updated_at: now,
  });
}

export async function deleteGestion(id: string): Promise<void> {
  await collectionRef().doc(id).delete();
}
