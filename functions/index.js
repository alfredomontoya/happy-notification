const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.updateUserPassword = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Debes iniciar sesión',
    );
  }

  const callerUid = context.auth.uid;
  const callerDoc = await admin
    .firestore()
    .collection('usuarios')
    .doc(callerUid)
    .get();
  const callerProfile = callerDoc.data();

  if (!callerProfile || callerProfile.role !== 'admin') {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Solo administradores pueden cambiar contraseñas',
    );
  }

  const {uid, newPassword} = data;

  if (!uid || !newPassword) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Faltan datos requeridos',
    );
  }

  if (newPassword.length < 6) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'La contraseña debe tener al menos 6 caracteres',
    );
  }

  await admin.auth().updateUser(uid, {password: newPassword});

  return {success: true};
});

exports.createUser = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Debes iniciar sesión',
    );
  }

  const callerUid = context.auth.uid;
  const callerDoc = await admin
    .firestore()
    .collection('usuarios')
    .doc(callerUid)
    .get();
  const callerProfile = callerDoc.data();

  if (!callerProfile || callerProfile.role !== 'admin') {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Solo administradores pueden crear usuarios',
    );
  }

  const {email, password, profile} = data;

  if (!email || !password || !profile) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Faltan datos requeridos',
    );
  }

  if (password.length < 6) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'La contraseña debe tener al menos 6 caracteres',
    );
  }

  const userRecord = await admin.auth().createUser({
    email,
    password,
  });

  const uid = userRecord.uid;
  const now = new Date().toISOString();

  const userDoc = {
    uid,
    ...profile,
    email,
    created_at: now,
    created_by: callerUid,
  };

  await admin.firestore().collection('usuarios').doc(uid).set(userDoc);

  return {uid, success: true};
});
