import {initializeDatabase} from './sqlite';
import {createAdminUserIfNotExists} from './usuarios';
import {migrateFromFirestore} from './migrate';

export async function initializeApp(): Promise<void> {
  await initializeDatabase();
  await createAdminUserIfNotExists();
  await migrateFromFirestore();
}
