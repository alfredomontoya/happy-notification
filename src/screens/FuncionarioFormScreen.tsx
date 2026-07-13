import {useState} from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTheme} from '../context/ThemeContext';
import {Funcionario} from '../database/types';
import {createFuncionario, updateFuncionario} from '../database/funcionarios';

export default function FuncionarioFormScreen({route, navigation}: any) {
  const {colors} = useTheme();
  const existing: Funcionario | null = route.params?.funcionario ?? null;
  const isEdit = !!existing;

  const [ci, setCi] = useState(existing?.ci ?? '');
  const [nombre, setNombre] = useState(existing?.nombre ?? '');
  const [cargo, setCargo] = useState(existing?.cargo ?? '');
  const [dependencia, setDependencia] = useState(existing?.dependencia ?? '');
  const [telefono, setTelefono] = useState(existing?.telefono ?? '');
  const [email, setEmail] = useState(existing?.email ?? '');

  const handleSave = async () => {
    if (!nombre.trim()) {
      Alert.alert('Error', 'El nombre es obligatorio');
      return;
    }

    const data = {
      ci: ci.trim(),
      nombre: nombre.trim(),
      cargo: cargo.trim(),
      dependencia: dependencia.trim(),
      telefono: telefono.trim(),
      email: email.trim(),
    };

    if (isEdit) {
      await updateFuncionario(existing!.id, data);
    } else {
      await createFuncionario(data);
    }

    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, {backgroundColor: colors.primaryBg}]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled">
        <View style={[styles.card, {backgroundColor: colors.surface}]}>
          <Text style={[styles.title, {color: colors.textPrimary}]}>
            {isEdit ? 'Editar funcionario' : 'Nuevo funcionario'}
          </Text>

          <Input label="CI" value={ci} onChange={setCi} colors={colors} />
          <Input
            label="Nombre *"
            value={nombre}
            onChange={setNombre}
            colors={colors}
          />
          <Input label="Cargo" value={cargo} onChange={setCargo} colors={colors} />
          <Input
            label="Dependencia"
            value={dependencia}
            onChange={setDependencia}
            colors={colors}
          />
          <Input
            label="Teléfono"
            value={telefono}
            onChange={setTelefono}
            colors={colors}
            keyboardType="phone-pad"
          />
          <Input
            label="Email"
            value={email}
            onChange={setEmail}
            colors={colors}
            keyboardType="email-address"
          />

          <TouchableOpacity
            style={[styles.btn, {backgroundColor: colors.primary}]}
            onPress={handleSave}>
            <Text style={styles.btnText}>
              {isEdit ? 'Guardar cambios' : 'Crear funcionario'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Input({
  label,
  value,
  onChange,
  colors,
  keyboardType,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  colors: any;
  keyboardType?: any;
}) {
  return (
    <View style={styles.field}>
      <Text style={[styles.label, {color: colors.textSecondary}]}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          {backgroundColor: colors.primaryBg, color: colors.textPrimary, borderColor: colors.border},
        ]}
        value={value}
        onChangeText={onChange}
        placeholderTextColor={colors.textSecondary}
        keyboardType={keyboardType}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    padding: 16,
  },
  card: {
    borderRadius: 20,
    padding: 24,
    elevation: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  field: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
  },
  btn: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
