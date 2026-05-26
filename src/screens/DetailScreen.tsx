import {Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {colors} from '../theme/colors';
import {Persona} from '../database/types';
import {deletePersona} from '../database/personas';

export default function DetailScreen({route, navigation}: any) {
  const persona: Persona = route.params.persona;

  const handleDelete = () => {
    Alert.alert(
      'Eliminar persona',
      `¿Estás seguro de eliminar a ${persona.nombre}?`,
      [
        {text: 'Cancelar', style: 'cancel'},
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            await deletePersona(persona.id);
            navigation.goBack();
          },
        },
      ],
    );
  };

  const fields: {label: string; value: string}[] = [
    {label: 'CI', value: persona.ci},
    {label: 'Nombre', value: persona.nombre},
    {label: 'Cargo', value: persona.cargo},
    {label: 'Dependencia', value: persona.dependencia},
    {label: 'Fecha de nacimiento', value: persona.fecha_nacimiento},
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {persona.nombre
              .split(' ')
              .map(n => n[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()}
          </Text>
        </View>
        <Text style={styles.nombre}>{persona.nombre}</Text>
        <Text style={styles.cargo}>{persona.cargo}</Text>
      </View>

      <View style={styles.card}>
        {fields.map((field, index) => (
          <View
            key={field.label}
            style={[
              styles.fieldRow,
              index < fields.length - 1 && styles.fieldBorder,
            ]}>
            <Text style={styles.fieldLabel}>{field.label}</Text>
            <Text style={styles.fieldValue}>{field.value}</Text>
          </View>
        ))}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() =>
            navigation.navigate('Form', {persona})
          }>
          <Text style={styles.editBtnText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
          <Text style={styles.deleteBtnText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBg,
  },
  content: {
    padding: 16,
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.white,
  },
  nombre: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  cargo: {
    fontSize: 15,
    color: colors.textSecondary,
    marginTop: 4,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  fieldRow: {
    paddingVertical: 14,
  },
  fieldBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  editBtn: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  editBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  deleteBtn: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.danger,
  },
  deleteBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.danger,
  },
});
