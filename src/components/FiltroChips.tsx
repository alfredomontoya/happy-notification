import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {colors} from '../theme/colors';
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
  return (
    <View style={styles.container}>
      {chips.map(chip => {
        const activo = filtroActivo === chip.key;
        return (
          <TouchableOpacity
            key={chip.key ?? 'todos'}
            style={[styles.chip, activo && styles.chipActivo]}
            onPress={() => onChange(activo ? null : chip.key)}>
            <Text style={styles.icon}>{chip.icon}</Text>
            <Text style={[styles.label, activo && styles.labelActivo]}>
              {chip.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActivo: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  icon: {
    fontSize: 14,
    marginRight: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  labelActivo: {
    color: colors.white,
  },
});
