import type {Funcionario} from './types';

const CACHE_TTL = 30 * 60 * 1000;

const cache = new Map<string, {data: Funcionario[]; timestamp: number}>();

export function getCachedFuncionarios(
  gestionId: string,
): Funcionario[] | null {
  const entry = cache.get(gestionId);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    cache.delete(gestionId);
    return null;
  }
  return entry.data;
}

export function setCachedFuncionarios(
  gestionId: string,
  data: Funcionario[],
): void {
  cache.set(gestionId, {data, timestamp: Date.now()});
}

export function invalidateFuncionariosCache(gestionId?: string): void {
  if (gestionId) {
    cache.delete(gestionId);
  } else {
    cache.clear();
  }
}
