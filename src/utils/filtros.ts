import {isSameDay, isSameWeek, isSameMonth} from 'date-fns';
import {es} from 'date-fns/locale';
import {Persona} from '../database/types';

export type FiltroFecha = 'hoy' | 'semana' | 'mes' | null;

export function filtrarPersonas(
  personas: Persona[],
  query: string,
  filtroFecha: FiltroFecha,
): Persona[] {
  let result = personas;

  if (query.trim()) {
    const q = query.toLowerCase();
    result = result.filter(
      p => p.nombre.toLowerCase().includes(q) || p.ci.toLowerCase().includes(q),
    );
  }

  if (filtroFecha) {
    const hoy = new Date();
    result = result.filter(p => {
      const fn = new Date(p.fecha_nacimiento);
      switch (filtroFecha) {
        case 'hoy':
          return isSameDay(fn, hoy);
        case 'semana':
          return isSameWeek(fn, hoy, {locale: es, weekStartsOn: 1});
        case 'mes':
          return isSameMonth(fn, hoy);
        default:
          return true;
      }
    });
  }

  return result;
}

export function getCumpleanerosHoy(personas: Persona[]): Persona[] {
  const hoy = new Date();
  return personas.filter(p => isSameDay(new Date(p.fecha_nacimiento), hoy));
}
