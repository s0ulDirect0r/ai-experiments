import type { Algorithm } from './algorithms';
import { deserializeAlgorithm, serializeAlgorithm, type SerializedAlgorithm } from './createCustomAlgorithm';

const STORAGE_KEY = 'custom-algorithms';

export function saveCustomAlgorithms(algorithms: Array<{ algorithm: Algorithm; executorString: string }>) {
  const serialized = algorithms.map(({ algorithm, executorString }) =>
    serializeAlgorithm(algorithm, executorString)
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
}

export function loadCustomAlgorithms(): Algorithm[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const serialized: SerializedAlgorithm[] = JSON.parse(stored);
    return serialized.map(deserializeAlgorithm);
  } catch (error) {
    console.error('Failed to load custom algorithms:', error);
    return [];
  }
}

export function addCustomAlgorithm(algorithm: Algorithm, executorString: string) {
  const existing = localStorage.getItem(STORAGE_KEY);
  const serialized: SerializedAlgorithm[] = existing ? JSON.parse(existing) : [];

  serialized.push(serializeAlgorithm(algorithm, executorString));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
}

export function removeCustomAlgorithm(algorithmId: string) {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) return;

  const serialized: SerializedAlgorithm[] = JSON.parse(existing);
  const filtered = serialized.filter(a => a.id !== algorithmId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}
