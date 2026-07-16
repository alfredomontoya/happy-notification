import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {format, parse} from 'date-fns';
import {useTheme} from '../context/ThemeContext';

interface Props {
  persona: {
    id: number | string;
    ci: string;
    nombre?: string;
    nombres?: string;
    apellidos?: string;
    cargo: string;
    dependencia?: string;
    edificio?: string;
    nro?: string;
    fecha_nacimiento?: string;
  };
  onPress: () => void;
  showBirthday?: boolean;
}

export default function PersonaCard({persona, onPress, showBirthday = true}: Props) {
  const {colors} = useTheme();
  const nombreCompleto =
    persona.nombres
      ? (persona.nombres + ' ' + (persona.apellidos ?? '')).trim()
      : persona.nombre ?? '';

  const iniciales = nombreCompleto
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const badgeLabel = persona.edificio ?? persona.dependencia ?? '';

  const fechaFormateada = showBirthday && persona.fecha_nacimiento
    ? (() => {
        try {
          return format(
            parse(persona.fecha_nacimiento, 'yyyy-MM-dd', new Date()),
            'dd/MM/yyyy',
          );
        } catch {
          return persona.fecha_nacimiento;
        }
      })()
    : null;

  return (
    <TouchableOpacity style={[styles.card, {backgroundColor: colors.surface}]} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.avatar, {backgroundColor: colors.primaryBg}]}>
        <Text style={[styles.avatarText, {color: colors.primary}]}>{iniciales}</Text>
      </View>
      <View style={styles.info}>
        <Text style={[styles.nombre, {color: colors.textPrimary}]} numberOfLines={1}>
          {nombreCompleto}
        </Text>
        <Text style={[styles.cargo, {color: colors.textSecondary}]} numberOfLines={1}>
          {persona.cargo}
        </Text>
        <View style={styles.footer}>
          {persona.nro ? (
            <Text style={[styles.ci, {color: colors.textSecondary}]}>Nro: {persona.nro}</Text>
          ) : (
            <Text style={[styles.ci, {color: colors.textSecondary}]}>CI: {persona.ci}</Text>
          )}
          {badgeLabel ? (
            <View style={[styles.badge, {backgroundColor: colors.primaryBg}]}>
              <Text style={[styles.badgeText, {color: colors.primaryDark}]} numberOfLines={1}>
                {badgeLabel}
              </Text>
            </View>
          ) : null}
        </View>
        {fechaFormateada && (
          <Text style={[styles.fecha, {color: colors.textSecondary}]}>🎂 {fechaFormateada}</Text>
        )}
      </View>
      <Text style={[styles.arrow, {color: colors.border}]}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 4,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
  },
  info: {
    flex: 1,
  },
  nombre: {
    fontSize: 16,
    fontWeight: '600',
  },
  cargo: {
    fontSize: 13,
    marginTop: 2,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 8,
  },
  ci: {
    fontSize: 12,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    maxWidth: 150,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '500',
  },
  fecha: {
    fontSize: 12,
    marginTop: 4,
  },
  arrow: {
    fontSize: 24,
    marginLeft: 8,
  },
});
