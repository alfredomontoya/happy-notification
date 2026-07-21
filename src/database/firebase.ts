import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import functions from '@react-native-firebase/functions';

export function getFirebaseAuth() {
  return auth();
}

export function getFirestoreDB() {
  const db = firestore();
  db.settings({persistence: true});
  return db;
}

export function getFunctions() {
  return functions();
}
