import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export function getFirebaseAuth() {
  return auth();
}

export function getFirestoreDB() {
  const db = firestore();
  db.settings({persistence: true});
  return db;
}
