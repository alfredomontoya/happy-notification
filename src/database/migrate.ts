import {getFirestoreDB} from './firebase';

const MIGRATION_DOC = '_migration';
const MIGRATION_COLLECTION = '_app_meta';

async function isMigrated(): Promise<boolean> {
  const doc = await getFirestoreDB()
    .collection(MIGRATION_COLLECTION)
    .doc(MIGRATION_DOC)
    .get();
  return doc.exists && doc.data()?.completed === true;
}

async function setMigrated(): Promise<void> {
  await getFirestoreDB()
    .collection(MIGRATION_COLLECTION)
    .doc(MIGRATION_DOC)
    .set({completed: true, migrated_at: new Date().toISOString()});
}

export async function migrateFromSQLite(): Promise<boolean> {
  const already = await isMigrated();
  if (already) {
    return false;
  }

  // SQLite data has been removed from the project.
  // New Firestore collections will be populated from scratch
  // via the seed Excel import or manual data entry.
  await setMigrated();
  return true;
}
