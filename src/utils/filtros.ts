import {Persona} from '../database/types';

export type FiltroFecha = 'hoy' | 'semana' | 'mes' | null;

export function filtrarPersonas(
  personas: Persona[],
  query: string,
  filtroFecha: FiltroFecha,
): Persona[] {
  let result = personas;

  // 🔍 FILTRO POR TEXTO (nombre o CI)
  if (query.trim()) {
    const q = query.toLowerCase();

    result = result.filter(
      p =>
        p.nombre.toLowerCase().includes(q) ||
        p.ci.toLowerCase().includes(q),
    );
  }

  // 📅 FILTRO POR FECHA (CUMPLEAÑOS RECURRENTES)
  if (filtroFecha) {
    const hoy = new Date();

    result = result.filter(p => {
      const fn = new Date(p.fecha_nacimiento);

      switch (filtroFecha) {
        // 🎂 HOY (mismo mes y día, sin importar año)
        case 'hoy': {
          return (
            fn.getUTCMonth() === hoy.getUTCMonth() &&
            fn.getUTCDate() === hoy.getUTCDate()
          );
        }

        // 📆 SEMANA (próximos 7 días)
        case 'semana': {
          const inicioHoy = new Date();
          inicioHoy.setUTCHours(0, 0, 0, 0);
          const inicioHoyMs = inicioHoy.getTime();

          const cumple = new Date(fn);
          cumple.setUTCFullYear(inicioHoy.getUTCFullYear());

          if (cumple.getTime() < inicioHoyMs) {
            cumple.setUTCFullYear(inicioHoy.getUTCFullYear() + 1);
          }

          const diffDias =
            (cumple.getTime() - inicioHoyMs) / (1000 * 60 * 60 * 24);

          return diffDias >= 0 && diffDias <= 7;
        }

        // 📅 MES (solo mes actual)
        case 'mes': {
          return fn.getUTCMonth() === hoy.getUTCMonth();
        }

        default:
          return true;
      }
    });
  }

  return result;
}

// 🎂 SOLO CUMPLEAÑOS DE HOY
export function getCumpleanerosHoy(personas: Persona[]): Persona[] {
  const hoy = new Date();

  return personas.filter(p => {
    const fn = new Date(p.fecha_nacimiento);

    return (
      fn.getUTCMonth() === hoy.getUTCMonth() &&
      fn.getUTCDate() === hoy.getUTCDate()
    );
  });
}