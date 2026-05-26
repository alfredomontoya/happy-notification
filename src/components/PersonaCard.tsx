import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {format, parse} from 'date-fns';
import {colors} from '../theme/colors';
import {Persona} from '../database/types';

interface Props {
  persona: Persona;
  onPress: () => void;
}

export default function PersonaCard({persona, onPress}: Props) {
  const iniciales = persona.nombre
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const fechaFormateada = (() => {
    try {
      return format(parse(persona.fecha_nacimiento, 'yyyy-MM-dd', new Date()), 'dd/MM/yyyy');
    } catch {
      return persona.fecha_nacimiento;
    }
  })();

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{iniciales}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.nombre} numberOfLines={1}>
          {persona.nombre}
        </Text>
        <Text style={styles.cargo} numberOfLines={1}>
          {persona.cargo}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.ci}>CI: {persona.ci}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText} numberOfLines={1}>
              {persona.dependencia}
            </Text>
          </View>
        </View>
        <Text style={styles.fecha}>🎂 {fechaFormateada}</Text>
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
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
    backgroundColor: colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  info: {
    flex: 1,
  },
  nombre: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  cargo: {
    fontSize: 13,
    color: colors.textSecondary,
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
    color: colors.textSecondary,
  },
  badge: {
    backgroundColor: colors.primaryBg,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    maxWidth: 150,
  },
  badgeText: {
    fontSize: 11,
    color: colors.primaryDark,
    fontWeight: '500',
  },
  fecha: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  arrow: {
    fontSize: 24,
    color: colors.border,
    marginLeft: 8,
  },
});
