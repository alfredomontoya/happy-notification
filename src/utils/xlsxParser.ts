import {Persona} from '../database/types';

export type RowData = any[];

export const CAMPOS = ['ci', 'nombre', 'cargo', 'dependencia', 'fecha_nacimiento'] as const;
export const CAMPOS_REQUERIDOS = ['nombre', 'fecha_nacimiento'];
export const CAMPOS_LABELS: Record<string, string> = {
  ci: 'CI',
  nombre: 'Nombre',
  cargo: 'Cargo',
  dependencia: 'Dependencia',
  fecha_nacimiento: 'Fecha de Nac.',
};

export function convertirFecha(raw: any): string {
  if (!raw) {
    return '';
  }

  if (raw instanceof Date && !isNaN(raw.getTime())) {
    const y = raw.getUTCFullYear();
    const m = String(raw.getUTCMonth() + 1).padStart(2, '0');
    const d = String(raw.getUTCDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  const str = String(raw).trim();

  const iso = str.match(/^(\d{4})-(\d{2})-(\d{2})T/);
  if (iso) {
    return `${iso[1]}-${iso[2]}-${iso[3]}`;
  }

  const num = Number(str);
  if (!isNaN(num) && num > 10000 && num < 200000) {
    const date = new Date((num - 25569) * 86400 * 1000);
    const y = date.getUTCFullYear();
    const m = String(date.getUTCMonth() + 1).padStart(2, '0');
    const d = String(date.getUTCDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  const partes = str.split(/[/\-.]/);
  if (partes.length === 3) {
    if (partes[0].length === 4) {
      const m = partes[1].padStart(2, '0');
      const d = partes[2].padStart(2, '0');
      return `${partes[0]}-${m}-${d}`;
    }
    const d = partes[0].padStart(2, '0');
    const m = partes[1].padStart(2, '0');
    const y = partes[2].length === 2 ? '20' + partes[2] : partes[2];
    return `${y}-${m}-${d}`;
  }

  return str;
}

export interface ParseResult {
  headers: string[];
  rows: RowData[];
  autoMapping: Record<number, string>;
}

export function parseSheetToPersonas(
  headers: string[],
  rows: RowData[],
  mapping: Record<string, string>,
): Omit<Persona, 'id' | 'created_at' | 'birthday_month' | 'birthday_day'>[] {
  return rows.map(row => {
    const persona: any = {};
    Object.entries(mapping).forEach(([colIdx, campo]) => {
      const raw = row[Number(colIdx)];
      persona[campo] =
        campo === 'fecha_nacimiento'
          ? convertirFecha(raw)
          : String(raw ?? '').trim();
    });
    return persona;
  });
}

export function buildAutoMapping(headers: string[]): Record<number, string> {
  const autoMapping: Record<number, string> = {};
  headers.forEach((h, i) => {
    const lower = h.toLowerCase();
    if (lower.includes('ci') || lower.includes('cedula') || lower.includes('cédula')) {
      autoMapping[i] = 'ci';
    } else if (lower.includes('nombre') || lower.includes('apellido')) {
      autoMapping[i] = 'nombre';
    } else if (lower.includes('cargo')) {
      autoMapping[i] = 'cargo';
    } else if (lower.includes('dependencia') || lower.includes('departamento')) {
      autoMapping[i] = 'dependencia';
    } else if (lower.includes('fecha') || lower.includes('nacimiento')) {
      autoMapping[i] = 'fecha_nacimiento';
    }
  });
  return autoMapping;
}

export function formatearPreview(valor: any): string {
  if (valor instanceof Date && !isNaN(valor.getTime())) {
    const d = String(valor.getDate()).padStart(2, '0');
    const m = String(valor.getMonth() + 1).padStart(2, '0');
    const y = valor.getFullYear();
    return `${d}/${m}/${y}`;
  }
  return String(valor ?? '').slice(0, 30);
}
