import {useState, useCallback} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {useTheme} from '../context/ThemeContext';
import {useAuth} from '../context/AuthContext';
import {UserProfile} from '../database/types';
import {getAllUsers, deleteUserProfile} from '../database/usuarios';

export default function UsuariosScreen({navigation}: any) {
  const {colors} = useTheme();
  const {user: currentUser} = useAuth();
  const [usuarios, setUsuarios] = useState<UserProfile[]>([]);

  const cargar = useCallback(async () => {
    const data = await getAllUsers();
    setUsuarios(data);
  }, []);

  useFocusEffect(
    useCallback(() => {
      cargar();
    }, [cargar]),
  );

  const handleDelete = (uid: string, nombre: string) => {
    if (uid === currentUser?.uid) {
      Alert.alert('Error', 'No puedes eliminarte a ti mismo');
      return;
    }
    Alert.alert('Eliminar usuario', `¿Eliminar a ${nombre}?`, [
      {text: 'Cancelar', style: 'cancel'},
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteUserProfile(uid);
            cargar();
          } catch {
            Alert.alert('Error', 'No se pudo eliminar el usuario');
          }
        },
      },
    ]);
  };

  const renderItem = ({item}: {item: UserProfile}) => (
    <View style={[styles.card, {backgroundColor: colors.surface}]}>
      <View style={styles.cardHeader}>
        <Text style={[styles.nombre, {color: colors.textPrimary}]}>
          {item.nombre}
        </Text>
        <View
          style={[
            styles.roleBadge,
            {
              backgroundColor:
                item.role === 'admin'
                  ? colors.primary
                  : colors.accent,
            },
          ]}>
          <Text style={styles.roleText}>
            {item.role === 'admin' ? 'Admin' : 'Usuario'}
          </Text>
        </View>
      </View>
      <Text style={[styles.email, {color: colors.textSecondary}]}>
        {item.email}
      </Text>
      <Text style={[styles.cargo, {color: colors.textSecondary}]}>
        {item.cargo}
      </Text>
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.btn, {backgroundColor: colors.primary}]}
          onPress={() =>
            navigation.navigate('UsuarioForm', {usuario: item})
          }>
          <Text style={styles.btnText}>Editar</Text>
        </TouchableOpacity>
        {item.role !== 'admin' && (
          <TouchableOpacity
            style={[styles.btn, {backgroundColor: colors.danger}]}
            onPress={() => handleDelete(item.uid, item.nombre)}>
            <Text style={styles.btnText}>Eliminar</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={[styles.container, {backgroundColor: colors.primaryBg}]}>
      <View style={[styles.header, {backgroundColor: colors.primary}]}>
        <TouchableOpacity
          onPress={() => navigation.openDrawer()}
          style={styles.menuBtn}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Usuarios</Text>
      </View>

      <FlatList
        data={usuarios}
        keyExtractor={item => item.uid}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={[styles.emptyText, {color: colors.textSecondary}]}>
              No hay usuarios registrados
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        style={[styles.fab, {backgroundColor: colors.primary}]}
        onPress={() =>
          navigation.navigate('UsuarioForm', {usuario: null})
        }>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  menuBtn: {
    marginRight: 12,
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
  list: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  nombre: {
    fontSize: 16,
    fontWeight: '600',
  },
  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  roleText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  email: {
    fontSize: 13,
    marginTop: 2,
  },
  cargo: {
    fontSize: 13,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  btn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  empty: {
    alignItems: 'center',
    marginTop: 80,
  },
  emptyText: {
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
