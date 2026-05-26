import {faker} from '@faker-js/faker/locale/es';
import {Persona} from '../database/types';

const cargos = [
  'Secretario General',
  'Secretario de Actas',
  'Secretario de Hacienda',
  'Secretario de Organización',
  'Secretario de Conflictos',
  'Vocal',
  'Fiscal',
  'Tesorero',
  'Presidente',
  'Vicepresidente',
];

const dependencias = [
  'Dirección de Obras Públicas',
  'Dirección de Recursos Humanos',
  'Dirección Financiera',
  'Dirección de Salud',
  'Dirección de Educación',
  'Dirección de Cultura',
  'Dirección de Deportes',
  'Dirección de Tránsito',
  'Dirección de Medio Ambiente',
  'Dirección de Desarrollo Social',
];

export function generarPersonas(count: number): Omit<Persona, 'id'>[] {
  const personas: Omit<Persona, 'id'>[] = [];
  const usedCIs = new Set<string>();

  for (let i = 0; i < count; i++) {
    let ci: string;
    do {
      ci = faker.string.numeric({length: {min: 7, max: 10}});
    } while (usedCIs.has(ci));
    usedCIs.add(ci);

    personas.push({
      ci,
      nombre: faker.person.fullName(),
      cargo: faker.helpers.arrayElement(cargos),
      dependencia: faker.helpers.arrayElement(dependencias),
      fecha_nacimiento: faker.date
        .birthdate({mode: 'year', min: 1960, max: 2000})
        .toISOString()
        .split('T')[0],
    });
  }

  return personas;
}
