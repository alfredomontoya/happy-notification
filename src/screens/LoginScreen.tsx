import {useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import {useAuth} from '../context/AuthContext';
import {useTheme} from '../context/ThemeContext';

export default function LoginScreen() {
  const {login} = useAuth();
  const {colors, mode, toggleTheme} = useTheme();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    const trimmedUser = username.trim();
    const trimmedPass = password.trim();

    if (!trimmedUser || !trimmedPass) {
      Alert.alert('Error', 'Ingresa usuario y contraseña');
      return;
    }

    const success = login(trimmedUser, trimmedPass);
    if (!success) {
      Alert.alert('Error', 'Usuario o contraseña incorrectos');
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
            {backgroundColor: colors.primaryBg, color: colors.textPrimary, borderColor: colors.border},
          ]}
          placeholder="Usuario"
          placeholderTextColor={colors.textSecondary}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <TextInput
          style={[
            styles.input,
            {backgroundColor: colors.primaryBg, color: colors.textPrimary, borderColor: colors.border},
          ]}
          placeholder="Contraseña"
          placeholderTextColor={colors.textSecondary}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.button, {backgroundColor: colors.primary}]}
          onPress={handleLogin}>
          <Text style={styles.buttonText}>Ingresar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.themeToggle}
          onPress={toggleTheme}>
          <Text style={{color: colors.textSecondary, fontSize: 12}}>
            {mode === 'light' ? '🌙' : '☀️'} Modo {mode === 'light' ? 'oscuro' : 'claro'}
          </Text>
        </TouchableOpacity>
      </View>
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
  themeToggle: {
    marginTop: 20,
    padding: 8,
  },
});
