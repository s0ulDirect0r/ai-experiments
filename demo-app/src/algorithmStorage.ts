import type { Algorithm } from './algorithms';
import { deserializeAlgorithm, serializeAlgorithm, type SerializedAlgorithm } from './createCustomAlgorithm';

const STORAGE_KEY = 'custom-algorithms';

export function saveCustomAlgorithms(algorithms: Array<{ algorithm: Algorithm; executorString: string }>) {
  const serialized = algorithms.map(({ algorithm, executorString }) =>
    serializeAlgorithm(algorithm, executorString)
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
}

export function loadCustomAlgorithms(): { algorithms: Algorithm[]; executorStrings: Map<string, string> } {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return { algorithms: [], executorStrings: new Map() };

    const serialized: SerializedAlgorithm[] = JSON.parse(stored);
    const algorithms = serialized.map(deserializeAlgorithm);
    const executorStrings = new Map<string, string>();

    serialized.forEach(s => {
      executorStrings.set(s.id, s.executorString);
    });

    return { algorithms, executorStrings };
  } catch (error) {
    console.error('Failed to load custom algorithms:', error);
    return { algorithms: [], executorStrings: new Map() };
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

export function updateCustomAlgorithm(algorithm: Algorithm, executorString: string) {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) return;

  const serialized: SerializedAlgorithm[] = JSON.parse(existing);
  const index = serialized.findIndex(a => a.id === algorithm.id);

  if (index !== -1) {
    serialized[index] = serializeAlgorithm(algorithm, executorString);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
  }
}

export function getExecutorString(algorithmId: string): string | null {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) return null;

  const serialized: SerializedAlgorithm[] = JSON.parse(existing);
  const found = serialized.find(a => a.id === algorithmId);
  return found ? found.executorString : null;
}
