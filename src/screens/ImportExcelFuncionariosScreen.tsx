import {useState} from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {pick, types} from '@react-native-documents/picker';
import * as XLSX from 'xlsx';
import {useTheme} from '../context/ThemeContext';
import {useAuth} from '../context/AuthContext';
import {createFuncionariosBatch} from '../database/funcionarios';
import LoadingOverlay from '../components/LoadingOverlay';
import {
  CAMPOS,
  CAMPOS_LABELS,
  CAMPOS_REQUERIDOS,
  buildAutoMapping,
  formatearPreview,
  parseSheetToFuncionarios,
} from '../utils/xlsxParserFuncionarios';

export default function ImportExcelFuncionariosScreen({route, navigation}: any) {
  const gestionId: string = route.params?.gestionId ?? '';
  const {colors: ctxColors} = useTheme();
  const {user} = useAuth();
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<any[][]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [showPicker, setShowPicker] = useState<number | null>(null);
  const [importing, setImporting] = useState(false);
  const [progressCount, setProgressCount] = useState(0);

  const handlePickFile = async () => {
    try {
      const result = await pick({
        type: [types.xlsx, types.xls],
      });

      if (result.length === 0) return;

      const file = result[0];
      const response = await fetch(file.uri);
      const blob = await response.arrayBuffer();
      const workbook = XLSX.read(blob, {type: 'array', cellDates: true});
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json<any[]>(sheet, {header: 1, raw: true});

      if (data.length < 2) {
        Alert.alert('Error', 'El archivo debe tener al menos 2 filas (encabezados + datos)');
        return;
      }

      const fileHeaders = data[0].map(h => String(h).trim());
      const fileRows = data.slice(1).filter(r => r.some(c => String(c).trim()));

      setHeaders(fileHeaders);
      setRows(fileRows);
      setMapping(buildAutoMapping(fileHeaders));
    } catch {
      Alert.alert('Error', 'No se pudo leer el archivo');
    }
  };

  const handleImport = async () => {
    if (!gestionId) {
      Alert.alert('Error', 'No hay una gestión seleccionada');
      return;
    }

    const usedFields = new Set(Object.values(mapping));
    const missing = CAMPOS_REQUERIDOS.filter(c => !usedFields.has(c));
    if (missing.length > 0) {
      Alert.alert(
        'Faltan campos requeridos',
        'Debes mapear: ' + missing.map(c => CAMPOS_LABELS[c]).join(', '),
      );
      return;
    }

    Alert.alert(
      'Aviso importante',
      'La importación se realiza en lotes para mayor velocidad. Si cierras la aplicación durante el proceso, los datos importados hasta ese momento quedarán grabados y deberás limpiar y reimportar manualmente.\n\n¿Deseas continuar?',
      [
        {text: 'Cancelar', style: 'cancel'},
        {
          text: 'Continuar',
          onPress: async () => {
            const funcionarios = parseSheetToFuncionarios(
              headers,
              rows,
              mapping,
              user?.uid ?? '',
              gestionId,
            );
            setProgressCount(0);
            setImporting(true);
            try {
              const count = await createFuncionariosBatch(funcionarios, processed => {
                setProgressCount(processed);
              });
              setImporting(false);
              Alert.alert('Importación exitosa', 'Se importaron ' + count + ' funcionarios', [
                {text: 'OK', onPress: () => navigation.goBack()},
              ]);
            } catch {
              setImporting(false);
              Alert.alert('Error', 'No se pudieron importar los datos');
            }
          },
        },
      ],
    );
  };

  return (
    <ScrollView
      style={[styles.container, {backgroundColor: ctxColors.primaryBg}]}
      contentContainerStyle={styles.content}>
      {headers.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📊</Text>
          <Text style={[styles.emptyTitle, {color: ctxColors.textPrimary}]}>
            Importar funcionarios
          </Text>
          <Text style={[styles.emptyDesc, {color: ctxColors.textSecondary}]}>
            Selecciona un archivo .xlsx o .xls con los datos de funcionarios
          </Text>
          <TouchableOpacity
            style={[styles.pickBtn, {backgroundColor: ctxColors.primary}]}
            onPress={handlePickFile}>
            <Text style={styles.pickBtnText}>Seleccionar archivo</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <Text style={[styles.sectionTitle, {color: ctxColors.textPrimary}]}>
            Mapeo de columnas
          </Text>
          <Text style={[styles.sectionDesc, {color: ctxColors.textSecondary}]}>
            Selecciona qué campo corresponde a cada columna del Excel
          </Text>

          {headers.map((header, colIdx) => (
            <TouchableOpacity
              key={colIdx}
              style={[styles.mappingRow, {backgroundColor: ctxColors.surface, borderColor: ctxColors.border}]}
              onPress={() => setShowPicker(colIdx)}>
              <Text style={[styles.colHeader, {color: ctxColors.textPrimary}]}>
                {header}
              </Text>
              <Text style={styles.colArrow}>→</Text>
              <Text style={[styles.colField, {color: ctxColors.primary}]}>
                {mapping[colIdx]
                  ? CAMPOS_LABELS[mapping[colIdx]]
                  : '— Ignorar —'}
              </Text>
            </TouchableOpacity>
          ))}

          <Text style={[styles.sectionTitle, {color: ctxColors.textPrimary}]}>
            Vista previa
          </Text>
          {rows.slice(0, 5).map((row, ri) => (
            <View
              key={ri}
              style={[styles.previewRow, {backgroundColor: ctxColors.surface, borderColor: ctxColors.border}]}>
              {Object.entries(mapping).map(([colIdx, campo]) => (
                <Text key={colIdx} style={[styles.previewCell, {color: ctxColors.textPrimary}]}>
                  {campo}: {formatearPreview(row[Number(colIdx)])}
                </Text>
              ))}
            </View>
          ))}
          {rows.length > 5 && (
            <Text style={[styles.moreText, {color: ctxColors.textSecondary}]}>
              ...y {rows.length - 5} filas más
            </Text>
          )}

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.pickBtn, {backgroundColor: ctxColors.primary}]}
              onPress={handlePickFile}>
              <Text style={styles.pickBtnText}>Cambiar archivo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.importBtn,
                {backgroundColor: ctxColors.primary},
                importing && styles.disabled,
              ]}
              onPress={handleImport}
              disabled={importing}>
              <Text style={styles.importBtnText}>
                {importing ? 'Importando...' : 'Importar ' + rows.length + ' funcionarios'}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      <Modal visible={showPicker !== null} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, {backgroundColor: ctxColors.surface}]}>
            <Text style={[styles.modalTitle, {color: ctxColors.textPrimary}]}>
              Mapear: {showPicker !== null ? headers[showPicker] : ''}
            </Text>
            <ScrollView style={styles.modalScroll}>
              <TouchableOpacity
                style={[styles.modalOption, {borderBottomColor: ctxColors.border}]}
                onPress={() => {
                  if (showPicker !== null) {
                    const newMapping = {...mapping};
                    delete newMapping[showPicker];
                    setMapping(newMapping);
                    setShowPicker(null);
                  }
                }}>
                <Text style={[styles.modalOptionText, {color: ctxColors.textPrimary}]}>
                  — Ignorar columna —
                </Text>
              </TouchableOpacity>
              {CAMPOS.map(campo => (
                <TouchableOpacity
                  key={campo}
                  style={[styles.modalOption, {borderBottomColor: ctxColors.border}]}
                  onPress={() => {
                    if (showPicker !== null) {
                      const newMapping = {...mapping};
                      Object.entries(newMapping).forEach(([k, v]) => {
                        if (v === campo) delete newMapping[k];
                      });
                      newMapping[showPicker] = campo;
                      setMapping(newMapping);
                      setShowPicker(null);
                    }
                  }}>
                  <Text style={[styles.modalOptionText, {color: ctxColors.textPrimary}]}>
                    {CAMPOS_LABELS[campo]}
                    {Object.values(mapping).includes(campo) ? ' ✓' : ''}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={[styles.modalCancel, {backgroundColor: ctxColors.primaryBg}]}
              onPress={() => setShowPicker(null)}>
              <Text style={[styles.modalCancelText, {color: ctxColors.primary}]}>
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <LoadingOverlay
        visible={importing}
        title="Importando funcionarios..."
        message="Procesando funcionarios desde el archivo Excel."
        count={progressCount}
        total={rows.length}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  pickBtn: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  pickBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 4,
  },
  sectionDesc: {
    fontSize: 13,
    marginBottom: 12,
  },
  mappingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
  },
  colHeader: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
  colArrow: {
    fontSize: 16,
    color: '#64748B',
    marginHorizontal: 8,
  },
  colField: {
    fontSize: 14,
    fontWeight: '600',
  },
  previewRow: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 6,
    borderWidth: 1,
  },
  previewCell: {
    fontSize: 12,
    marginBottom: 2,
  },
  moreText: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  importBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  importBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  disabled: {
    opacity: 0.6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  modalScroll: {
    maxHeight: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  modalOption: {
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  modalOptionText: {
    fontSize: 16,
  },
  modalCancel: {
    marginTop: 16,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
