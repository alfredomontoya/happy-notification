import {getFirestoreDB} from './firebase';
import {createAdminUserIfNotExists} from './usuarios';
import {migrateFromSQLite} from './migrate';

export async function initializeApp(): Promise<void> {
  getFirestoreDB();
  await createAdminUserIfNotExists();
  await migrateFromSQLite();
}
