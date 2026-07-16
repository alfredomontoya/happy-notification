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
import {Funcionario, Gestion} from '../database/types';
import {getFuncionariosByGestion} from '../database/funcionarios';
import {getAllGestiones} from '../database/gestion';
import PersonaCard from '../components/PersonaCard';

export default function FuncionariosListScreen({navigation}: any) {
  const {colors} = useTheme();
  const [gestiones, setGestiones] = useState<Gestion[]>([]);
  const [selectedGestionId, setSelectedGestionId] = useState<string | null>(null);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [query, setQuery] = useState('');

  const cargarGestiones = useCallback(async () => {
    const data = await getAllGestiones();
    const activas = data.filter(g => g.estado === 'activo');
    setGestiones(activas);
    if (activas.length > 0) {
      if (!selectedGestionId || !activas.some(g => g.id === selectedGestionId)) {
        setSelectedGestionId(activas[0].id);
      }
    } else {
      setSelectedGestionId(null);
    }
  }, [selectedGestionId]);

  const cargarDatos = useCallback(async () => {
    if (!selectedGestionId) {
      setFuncionarios([]);
      return;
    }
    const data = await getFuncionariosByGestion(selectedGestionId);
    setFuncionarios(data);
  }, [selectedGestionId]);

  useEffect(() => {
    cargarGestiones();
  }, [cargarGestiones]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      cargarGestiones();
      cargarDatos();
    });
    return unsubscribe;
  }, [navigation, cargarGestiones, cargarDatos]);

  const filtradas = funcionarios.filter(f => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      f.nombres.toLowerCase().includes(q) ||
      f.apellidos.toLowerCase().includes(q) ||
      f.ci.toLowerCase().includes(q) ||
      f.nro.toLowerCase().includes(q) ||
      f.cargo.toLowerCase().includes(q)
    );
  });

  const gestionActual = gestiones.find(g => g.id === selectedGestionId);

  return (
    <View style={[styles.container, {backgroundColor: colors.primaryBg}]}>
      <View style={[styles.header, {backgroundColor: colors.primary}]}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => navigation.openDrawer()}
            style={styles.menuBtn}>
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>
          <View style={styles.headerTitles}>
            <Text style={styles.title}>FUNCIONARIOS</Text>
            <Text style={styles.subtitle}>
              {gestionActual
                ? gestionActual.titulo + ' (' + gestionActual.year + ')'
                : 'Lista de funcionarios registrados'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.gestionRow}>
        {gestiones.map(g => (
          <TouchableOpacity
            key={g.id}
            style={[
              styles.gestionChip,
              {
                backgroundColor:
                  selectedGestionId === g.id ? colors.primary : colors.surface,
              },
            ]}
            onPress={() => setSelectedGestionId(g.id)}>
            <Text
              style={[
                styles.gestionChipText,
                {
                  color:
                    selectedGestionId === g.id ? '#FFFFFF' : colors.textPrimary,
                },
              ]}>
              {g.titulo} ({g.year})
            </Text>
          </TouchableOpacity>
        ))}
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
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <PersonaCard
            persona={{
              id: item.id,
              ci: item.ci,
              nombres: item.nombres,
              apellidos: item.apellidos,
              cargo: item.cargo,
              edificio: item.edificio,
              nro: item.nro,
            }}
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
        {selectedGestionId && (
          <TouchableOpacity
            style={[styles.fabSmall, {backgroundColor: colors.primary}]}
            onPress={() =>
              navigation.navigate('ImportExcelFuncionarios', {
                gestionId: selectedGestionId,
              })
            }>
            <Text style={styles.fabSmallText}>📊</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => {
            if (selectedGestionId) {
              navigation.navigate('FuncionarioForm', {
                funcionario: null,
                gestionId: selectedGestionId,
              });
            }
          }}>
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
  headerTitles: {
    flex: 1,
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
  gestionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  gestionChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    elevation: 2,
  },
  gestionChipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
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
  fabContainer: {
    position: 'absolute',
    bottom: 24,
    right: 16,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  fabSmall: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabSmallText: {
    fontSize: 20,
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
});
