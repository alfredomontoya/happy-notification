import {getFirestoreDB} from './firebase';
import type {Funcionario} from './types';
import type {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {
  getCachedFuncionarios,
  setCachedFuncionarios,
  invalidateFuncionariosCache,
} from './funcionariosCache';

const COLLECTION = 'funcionarios';
const BUSQUEDA_LIMITE = 20;

function collectionRef() {
  return getFirestoreDB().collection(COLLECTION);
}

function generateSearchTokens(f: {
  nombres: string;
  apellidos: string;
  ci: string;
  nro: string;
}): string[] {
  const tokens = new Set<string>();
  const add = (v: string) => {
    const t = v.toLowerCase().trim();
    if (t) {
      tokens.add(t);
      t.split(/\s+/).forEach(p => tokens.add(p));
    }
  };
  add(f.nombres + ' ' + f.apellidos);
  add(f.ci);
  add(f.nro);
  return Array.from(tokens);
}

export async function getFuncionariosByGestion(
  gestionId: string,
): Promise<Funcionario[]> {
  const cached = getCachedFuncionarios(gestionId);
  if (cached) return cached;

  const snapshot = await collectionRef()
    .where('gestion_id', '==', gestionId)
    .orderBy('nro', 'asc')
    .get();
  const list: Funcionario[] = [];
  snapshot.forEach((doc: FirebaseFirestoreTypes.DocumentSnapshot) =>
    list.push({id: doc.id, ...doc.data()} as Funcionario),
  );
  setCachedFuncionarios(gestionId, list);
  return list;
}

export async function buscarFuncionarios(
  gestionId: string,
  texto: string,
): Promise<Funcionario[]> {
  const q = texto.trim().toLowerCase();
  if (!q) return [];

  const db = getFirestoreDB();
  const seen = new Set<string>();
  const results: Funcionario[] = [];

  const add = (snapshot: FirebaseFirestoreTypes.QuerySnapshot) => {
    snapshot.forEach((doc: FirebaseFirestoreTypes.DocumentSnapshot) => {
      const f = {id: doc.id, ...doc.data()} as Funcionario;
      if (!seen.has(f.id)) {
        seen.add(f.id);
        results.push(f);
      }
    });
  };

  const matches = (
    q.match(/^[\d-]+$/) ? [q.replace(/-/g, '')] : []
  );

  for (const exact of matches) {
    const snap = await collectionRef()
      .where('gestion_id', '==', gestionId)
      .where('ci', '==', exact)
      .limit(BUSQUEDA_LIMITE)
      .get();
    add(snap);

    const snapNro = await collectionRef()
      .where('gestion_id', '==', gestionId)
      .where('nro', '==', exact)
      .limit(BUSQUEDA_LIMITE)
      .get();
    add(snapNro);

    if (results.length >= BUSQUEDA_LIMITE) break;
  }

  if (results.length < BUSQUEDA_LIMITE) {
    const snap = await collectionRef()
      .where('gestion_id', '==', gestionId)
      .where('search_tokens', 'array-contains', q)
      .limit(BUSQUEDA_LIMITE - results.length)
      .get();
    add(snap);
  }

  return results;
}

export async function getFuncionarioById(
  id: string,
): Promise<Funcionario | null> {
  const doc = await collectionRef().doc(id).get();
  if (!doc.exists) return null;
  return {id: doc.id, ...doc.data()} as Funcionario;
}

export async function createFuncionario(
  data: Omit<Funcionario, 'id' | 'created_at' | 'updated_at' | 'search_tokens'>,
): Promise<string> {
  const now = new Date().toISOString();
  const tokens = generateSearchTokens(data);
  const docRef = await collectionRef().add({
    ...data,
    search_tokens: tokens,
    created_at: now,
    updated_at: now,
  });
  invalidateFuncionariosCache(data.gestion_id);
  return docRef.id;
}

export async function updateFuncionario(
  id: string,
  data: Partial<
    Omit<Funcionario, 'id' | 'created_at' | 'updated_at' | 'search_tokens'>
  >,
): Promise<void> {
  const now = new Date().toISOString();
  const updateData: Record<string, unknown> = {...data, updated_at: now};

  if (data.nombres || data.apellidos || data.ci || data.nro) {
    const existing = await getFuncionarioById(id);
    if (existing) {
      updateData.search_tokens = generateSearchTokens({
        nombres: data.nombres ?? existing.nombres,
        apellidos: data.apellidos ?? existing.apellidos,
        ci: data.ci ?? existing.ci,
        nro: data.nro ?? existing.nro,
      });
    }
  }

  await collectionRef().doc(id).update(updateData);
  invalidateFuncionariosCache(data.gestion_id);
}

export async function deleteFuncionario(id: string): Promise<void> {
  const existing = await getFuncionarioById(id);
  await collectionRef().doc(id).delete();
  if (existing) {
    invalidateFuncionariosCache(existing.gestion_id);
  }
}

export async function countFuncionariosByGestion(
  gestionId: string,
): Promise<number> {
  const snapshot = await collectionRef()
    .where('gestion_id', '==', gestionId)
    .get();
  return snapshot.size;
}

export async function deleteFuncionariosByGestion(
  gestionId: string,
): Promise<void> {
  const snapshot = await collectionRef()
    .where('gestion_id', '==', gestionId)
    .get();
  const db = getFirestoreDB();
  const batch = db.batch();
  snapshot.forEach((doc: FirebaseFirestoreTypes.DocumentSnapshot) =>
    batch.delete(doc.ref),
  );
  await batch.commit();
  invalidateFuncionariosCache(gestionId);
}
