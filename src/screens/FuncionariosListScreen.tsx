import {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTheme} from '../context/ThemeContext';
import {Funcionario} from '../database/types';
import {getAllFuncionarios} from '../database/funcionarios';
import PersonaCard from '../components/PersonaCard';

export default function FuncionariosListScreen({navigation}: any) {
  const {colors} = useTheme();
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [query, setQuery] = useState('');

  const cargarDatos = useCallback(async () => {
    const data = await getAllFuncionarios();
    setFuncionarios(data);
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      cargarDatos();
    });
    return unsubscribe;
  }, [navigation, cargarDatos]);

  const filtradas = funcionarios.filter(f => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      f.nombre.toLowerCase().includes(q) ||
      f.ci.toLowerCase().includes(q) ||
      f.cargo.toLowerCase().includes(q) ||
      f.dependencia.toLowerCase().includes(q)
    );
  });

  return (
    <View style={[styles.container, {backgroundColor: colors.primaryBg}]}>
      <View style={[styles.header, {backgroundColor: colors.primary}]}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => navigation.openDrawer()}
            style={styles.menuBtn}>
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>FUNCIONARIOS</Text>
            <Text style={styles.subtitle}>Lista de funcionarios registrados</Text>
          </View>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={[
            styles.searchInput,
            {backgroundColor: colors.surface, color: colors.textPrimary, borderColor: colors.border},
          ]}
          placeholder="Buscar funcionario..."
          placeholderTextColor={colors.textSecondary}
          value={query}
          onChangeText={setQuery}
        />
      </View>

      <FlatList
        data={filtradas}
        keyExtractor={item => String(item.id)}
        renderItem={({item}) => (
          <PersonaCard
            persona={item}
            onPress={() =>
              navigation.navigate('FuncionarioDetail', {funcionario: item})
            }
            showBirthday={false}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>👥</Text>
            <Text style={[styles.emptyText, {color: colors.textSecondary}]}>
              No se encontraron funcionarios
            </Text>
          </View>
        }
      />

      <View style={styles.fabContainer}>
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('FuncionarioForm', {funcionario: null})}>
          <Text style={styles.fabText}>+</Text>
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
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 4,
  },
  searchInput: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    borderWidth: 1,
    elevation: 2,
  },
  list: {
    paddingTop: 8,
    paddingBottom: 100,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 24,
    right: 16,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0D9488',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  empty: {
    alignItems: 'center',
    marginTop: 80,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
  },
});
