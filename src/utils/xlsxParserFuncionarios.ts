import {Funcionario} from '../database/types';

export type RowData = any[];

export const CAMPOS = [
  'nro', 'ci', 'nombres', 'apellidos', 'cargo', 'edificio',
  'tipo', 'responsable', 'telresponsable',
] as const;

export const CAMPOS_REQUERIDOS = ['nombres'];

export const CAMPOS_LABELS: Record<string, string> = {
  nro: 'Nro',
  ci: 'CI',
  nombres: 'Nombres',
  apellidos: 'Apellidos',
  cargo: 'Cargo',
  edificio: 'Edificio',
  tipo: 'Tipo',
  responsable: 'Responsable',
  telresponsable: 'Tel. Responsable',
};

export function parseSheetToFuncionarios(
  headers: string[],
  rows: RowData[],
  mapping: Record<number, string>,
  userId: string,
  gestionId: string,
): Omit<Funcionario, 'id' | 'created_at' | 'updated_at'>[] {
  return rows.map(row => {
    const item: any = {
      user_id: userId,
      gestion_id: gestionId,
      estado: 'activo',
      entregado: 0,
    };
    Object.entries(mapping).forEach(([colIdx, campo]) => {
      const raw = row[Number(colIdx)];
      item[campo] = String(raw ?? '').trim();
    });
    return item;
  });
}

export function buildAutoMapping(headers: string[]): Record<number, string> {
  const autoMapping: Record<number, string> = {};
  headers.forEach((h, i) => {
    const lower = h.toLowerCase();
    if (lower.includes('nro') || lower.includes('numero') || lower.includes('número') || lower.includes('item')) {
      autoMapping[i] = 'nro';
    } else if (lower.includes('ci') || lower.includes('cedula') || lower.includes('cédula') || lower.includes('identidad')) {
      autoMapping[i] = 'ci';
    } else if (lower.includes('nombre') || lower.includes('nombres')) {
      autoMapping[i] = 'nombres';
    } else if (lower.includes('apellido') || lower.includes('apellidos') || lower.includes('paterno') || lower.includes('materno')) {
      autoMapping[i] = 'apellidos';
    } else if (lower.includes('cargo')) {
      autoMapping[i] = 'cargo';
    } else if (lower.includes('edificio') || lower.includes('lugar')) {
      autoMapping[i] = 'edificio';
    } else if (lower.includes('tipo')) {
      autoMapping[i] = 'tipo';
    } else if (lower.includes('responsable')) {
      autoMapping[i] = 'responsable';
    } else if (lower.includes('telefono') || lower.includes('teléfono') || lower.includes('tel') || lower.includes('celular')) {
      autoMapping[i] = 'telresponsable';
    }
  });
  return autoMapping;
}

export function formatearPreview(valor: any): string {
  return String(valor ?? '').slice(0, 30);
}
