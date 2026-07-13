import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useTheme} from '../context/ThemeContext';
import {useAuth} from '../context/AuthContext';

export default function PerfilScreen({navigation}: any) {
  const {colors} = useTheme();
  const {user, logout} = useAuth();

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
