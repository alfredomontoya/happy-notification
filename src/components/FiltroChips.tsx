import {ScrollView, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {useTheme} from '../context/ThemeContext';
import {FiltroFecha} from '../utils/filtros';

interface Props {
  filtroActivo: FiltroFecha;
  onChange: (filtro: FiltroFecha) => void;
}

const chips: {key: FiltroFecha; label: string; icon: string}[] = [
  {key: null, label: 'Todos', icon: '👥'},
  {key: 'hoy', label: 'Hoy', icon: '🎂'},
  {key: 'semana', label: 'Semana', icon: '📅'},
  {key: 'mes', label: 'Mes', icon: '📆'},
];

export default function FiltroChips({filtroActivo, onChange}: Props) {
  const {colors} = useTheme();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
      {chips.map(chip => {
        const activo = filtroActivo === chip.key;
        return (
          <TouchableOpacity
            key={chip.key ?? 'todos'}
            style={[
              styles.chip,
              {backgroundColor: colors.surface, borderColor: colors.border},
              activo && {
                backgroundColor: colors.primary,
                borderColor: colors.primary,
              },
            ]}
            onPress={() => {
              console.log('FiltroChips:onPress', chip.key);
              onChange(activo ? null : chip.key);
            }}>
            <Text style={styles.icon}>{chip.icon}</Text>
            <Text
              style={[
                styles.label,
                {color: colors.textSecondary},
                activo && {color: colors.white},
              ]}>
              {chip.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 0,
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 4,
    minHeight: 48,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
  },
  icon: {
    fontSize: 14,
    marginRight: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
  },
});
