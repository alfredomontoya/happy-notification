import {useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useAuth} from '../context/AuthContext';
import {useTheme} from '../context/ThemeContext';
import {resetPassword} from '../database/usuarios';

export default function LoginScreen() {
  const {login} = useAuth();
  const {colors, mode, toggleTheme} = useTheme();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetInput, setResetInput] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const handleLogin = async () => {
    const trimmedUser = username.trim();
    const trimmedPass = password.trim();

    if (!trimmedUser || !trimmedPass) {
      Alert.alert('Error', 'Ingresa usuario y contraseña');
      return;
    }

    setLoading(true);
    try {
      await login(trimmedUser, trimmedPass);
    } catch (e: any) {
      const msg =
        e.code === 'auth/user-not-found' || e.code === 'user-not-found'
          ? 'Usuario no encontrado'
          : e.code === 'auth/wrong-password'
          ? 'Contraseña incorrecta'
          : e.code === 'auth/invalid-credential'
          ? 'Usuario o contraseña incorrectos'
          : 'Error al iniciar sesión';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    const trimmed = resetInput.trim();
    if (!trimmed) {
      Alert.alert('Error', 'Ingresa tu usuario o correo electrónico');
      return;
    }

    setResetLoading(true);
    try {
      const email = await resetPassword(trimmed);
      Alert.alert(
        'Correo enviado',
        `Se envió un enlace de restablecimiento a ${email}`,
      );
      setShowResetModal(false);
      setResetInput('');
    } catch (e: any) {
      const msg =
        e.code === 'user-not-found'
          ? 'Usuario no encontrado'
          : e.code === 'auth/user-not-found'
          ? 'Correo no registrado'
          : 'Error al enviar el correo';
      Alert.alert('Error', msg);
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <View style={[styles.container, {backgroundColor: colors.primaryBg}]}>
      <View style={[styles.card, {backgroundColor: colors.surface}]}>
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={[styles.title, {color: colors.primary}]}>STMSC</Text>
        <Text style={[styles.subtitle, {color: colors.textSecondary}]}>
          Iniciar sesión
        </Text>

        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.primaryBg,
              color: colors.textPrimary,
              borderColor: colors.border,
            },
          ]}
          placeholder="Usuario o correo electrónico"
          placeholderTextColor={colors.textSecondary}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <View style={styles.passwordContainer}>
          <TextInput
            style={[
              styles.input,
              styles.passwordInput,
              {
                backgroundColor: colors.primaryBg,
                color: colors.textPrimary,
                borderColor: colors.border,
              },
            ]}
            placeholder="Contraseña"
            placeholderTextColor={colors.textSecondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            style={styles.eyeBtn}
            onPress={() => setShowPassword(prev => !prev)}>
            <Text style={[styles.eyeIcon, {color: colors.textSecondary}]}>
              {showPassword ? '🙈' : '👁'}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.button, {backgroundColor: colors.primary}]}
          onPress={handleLogin}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Ingresar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.forgotBtn}
          onPress={() => setShowResetModal(true)}>
          <Text style={[styles.forgotText, {color: colors.primary}]}>
            ¿Olvidaste tu contraseña?
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.themeToggle}
          onPress={toggleTheme}>
          <Text style={{color: colors.textSecondary, fontSize: 12}}>
            {mode === 'light' ? '🌙' : '☀️'} Modo{' '}
            {mode === 'light' ? 'oscuro' : 'claro'}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showResetModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowResetModal(false)}>
        <View style={[styles.modalOverlay, {backgroundColor: colors.overlay}]}>
          <View style={[styles.modalCard, {backgroundColor: colors.surface}]}>
            <Text style={[styles.modalTitle, {color: colors.textPrimary}]}>
              Restablecer contraseña
            </Text>
            <Text style={[styles.modalDesc, {color: colors.textSecondary}]}>
              Ingresa tu usuario o correo electrónico y te enviaremos un enlace
              para restablecer tu contraseña.
            </Text>

            <TextInput
              style={[
                styles.modalInput,
                {
                  backgroundColor: colors.primaryBg,
                  color: colors.textPrimary,
                  borderColor: colors.border,
                },
              ]}
              placeholder="Usuario o correo electrónico"
              placeholderTextColor={colors.textSecondary}
              value={resetInput}
              onChangeText={setResetInput}
              autoCapitalize="none"
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnCancel, {borderColor: colors.border}]}
                onPress={() => {
                  setShowResetModal(false);
                  setResetInput('');
                }}>
                <Text style={[styles.modalBtnText, {color: colors.textPrimary}]}>
                  Cancelar
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, {backgroundColor: colors.primary}]}
                onPress={handleResetPassword}
                disabled={resetLoading}>
                {resetLoading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={[styles.modalBtnText, {color: colors.white}]}>
                    Enviar enlace
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    elevation: 8,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 32,
    marginTop: 4,
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
  button: {
    width: '100%',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  passwordContainer: {
    width: '100%',
    position: 'relative',
    marginBottom: 12,
  },
  passwordInput: {
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
  forgotBtn: {
    marginTop: 16,
    padding: 4,
  },
  forgotText: {
    fontSize: 14,
    fontWeight: '500',
  },
  themeToggle: {
    marginTop: 20,
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 24,
    padding: 28,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  modalDesc: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  modalBtnCancel: {
    borderWidth: 1,
  },
  modalBtnText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
