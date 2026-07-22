import {useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {useTheme} from '../context/ThemeContext';
import {useAuth} from '../context/AuthContext';

export default function PerfilScreen({navigation}: any) {
  const {colors} = useTheme();
  const {user, logout} = useAuth();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changing, setChanging] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);

  const handleChangePassword = async () => {
    if (!currentPassword) {
      Alert.alert('Error', 'Ingresa tu contraseña actual');
      return;
    }
    if (!newPassword) {
      Alert.alert('Error', 'Ingresa la nueva contraseña');
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('Error', 'La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas nuevas no coinciden');
      return;
    }

    setChanging(true);
    try {
      const firebaseUser = auth().currentUser;
      if (!firebaseUser?.email) {
        throw new Error('No se pudo obtener el email del usuario');
      }

      const credential = auth.EmailAuthProvider.credential(
        firebaseUser.email,
        currentPassword,
      );
      await firebaseUser.reauthenticateWithCredential(credential);
      await firebaseUser.updatePassword(newPassword);

      Alert.alert('Éxito', 'Contraseña cambiada correctamente');
      setShowPasswordForm(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (e: any) {
      const msg =
        e.code === 'auth/wrong-password'
          ? 'La contraseña actual es incorrecta'
          : e.code === 'auth/weak-password'
          ? 'La nueva contraseña debe tener al menos 6 caracteres'
          : e.code === 'auth/invalid-credential'
          ? 'La contraseña actual es incorrecta'
          : e.code === 'auth/requires-recent-login'
          ? 'Vuelve a iniciar sesión e intenta de nuevo'
          : 'Error al cambiar la contraseña';
      Alert.alert('Error', msg);
    } finally {
      setChanging(false);
    }
  };

  if (!user) return null;

  const initials = user.nombre
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const Row = ({label, value}: {label: string; value: string}) => (
    <View style={[styles.row, {borderBottomColor: colors.border}]}>
      <Text style={[styles.label, {color: colors.textSecondary}]}>{label}</Text>
      <Text style={[styles.value, {color: colors.textPrimary}]}>{value}</Text>
    </View>
  );

  return (
    <View style={[styles.container, {backgroundColor: colors.primaryBg}]}>
      <View style={[styles.header, {backgroundColor: colors.primary}]}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => navigation.openDrawer()}
            style={styles.menuBtn}>
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Perfil</Text>
        </View>
      </View>

      <View style={[styles.card, {backgroundColor: colors.surface}]}>
        <View style={[styles.avatar, {backgroundColor: colors.primaryLight}]}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={[styles.name, {color: colors.textPrimary}]}>{user.nombre}</Text>
        <Text style={[styles.username, {color: colors.textSecondary}]}>
          @{user.username}
        </Text>

        <View style={styles.details}>
          <Row label="Cargo" value={user.cargo} />
          <Row label="Email" value={user.email} />
        </View>

        {!showPasswordForm ? (
          <TouchableOpacity
            style={[styles.passwordBtn, {borderColor: colors.primary}]}
            onPress={() => setShowPasswordForm(true)}>
            <Text style={[styles.passwordBtnText, {color: colors.primary}]}>
              Cambiar contraseña
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.passwordForm}>
            <View style={styles.pwContainer}>
              <TextInput
                style={[
                  styles.input,
                  styles.pwInput,
                  {
                    backgroundColor: colors.primaryBg,
                    color: colors.textPrimary,
                    borderColor: colors.border,
                  },
                ]}
                placeholder="Contraseña actual"
                placeholderTextColor={colors.textSecondary}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry={!showPasswords}
              />
              <TouchableOpacity
                style={styles.eyeBtn}
                onPress={() => setShowPasswords(prev => !prev)}>
                <Text style={[styles.eyeIcon, {color: colors.textSecondary}]}>
                  {showPasswords ? '🙈' : '👁'}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.pwContainer}>
              <TextInput
                style={[
                  styles.input,
                  styles.pwInput,
                  {
                    backgroundColor: colors.primaryBg,
                    color: colors.textPrimary,
                    borderColor: colors.border,
                  },
                ]}
                placeholder="Nueva contraseña"
                placeholderTextColor={colors.textSecondary}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showPasswords}
              />
              <TouchableOpacity
                style={styles.eyeBtn}
                onPress={() => setShowPasswords(prev => !prev)}>
                <Text style={[styles.eyeIcon, {color: colors.textSecondary}]}>
                  {showPasswords ? '🙈' : '👁'}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.pwContainer}>
              <TextInput
                style={[
                  styles.input,
                  styles.pwInput,
                  {
                    backgroundColor: colors.primaryBg,
                    color: colors.textPrimary,
                    borderColor: colors.border,
                  },
                ]}
                placeholder="Confirmar nueva contraseña"
                placeholderTextColor={colors.textSecondary}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPasswords}
              />
              <TouchableOpacity
                style={styles.eyeBtn}
                onPress={() => setShowPasswords(prev => !prev)}>
                <Text style={[styles.eyeIcon, {color: colors.textSecondary}]}>
                  {showPasswords ? '🙈' : '👁'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.passwordActions}>
              <TouchableOpacity
                style={[styles.cancelBtn, {borderColor: colors.border}]}
                onPress={() => {
                  setShowPasswordForm(false);
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                }}>
                <Text
                  style={[styles.cancelBtnText, {color: colors.textSecondary}]}>
                  Cancelar
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveBtn, {backgroundColor: colors.primary}]}
                onPress={handleChangePassword}
                disabled={changing}>
                {changing ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.saveBtnText}>Guardar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}

        <TouchableOpacity
          style={[styles.logoutBtn, {backgroundColor: colors.danger}]}
          onPress={logout}>
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuBtn: {
    padding: 4,
  },
  menuIcon: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  card: {
    margin: 16,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    elevation: 4,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
  },
  username: {
    fontSize: 14,
    marginTop: 2,
    marginBottom: 20,
  },
  details: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
  },
  passwordBtn: {
    width: '100%',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
  },
  passwordBtnText: {
    fontSize: 15,
    fontWeight: '600',
  },
  passwordForm: {
    width: '100%',
    marginTop: 20,
  },
  pwContainer: {
    width: '100%',
    position: 'relative',
    marginBottom: 12,
  },
  pwInput: {
    marginBottom: 0,
    paddingRight: 44,
  },
  eyeBtn: {
    position: 'absolute',
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    padding: 4,
  },
  eyeIcon: {
    fontSize: 20,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: 12,
  },
  passwordActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  cancelBtn: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  cancelBtnText: {
    fontSize: 15,
    fontWeight: '600',
  },
  saveBtn: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  logoutBtn: {
    width: '100%',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
