import type { Algorithm, TraceTableColumn, TraceTableRow } from './algorithms';

export type CaptureFunction = (vars: Record<string, any>) => void;

export interface CustomAlgorithmConfig {
  name: string;
  description: string;
  code: string;
  executor: (capture: CaptureFunction) => void;
}

export function createCustomAlgorithm(config: CustomAlgorithmConfig): Algorithm {
  const { name, description, code, executor } = config;

  // Generate trace by running executor
  const generateTrace = (): TraceTableRow[] => {
    const trace: TraceTableRow[] = [];

    const capture: CaptureFunction = (vars) => {
      trace.push({ ...vars });
    };

    try {
      executor(capture);
    } catch (error) {
      console.error('Error executing algorithm:', error);
      throw new Error(`Failed to execute algorithm: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return trace;
  };

  // Generate columns from first trace entry
  const firstTrace = generateTrace();
  if (firstTrace.length === 0) {
    throw new Error('Algorithm must capture at least one step');
  }

  const columns: TraceTableColumn[] = Object.keys(firstTrace[0]).map(key => ({
    key,
    label: key
  }));

  // Generate unique ID
  const id = `custom-${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;

  return {
    id,
    name,
    description,
    code,
    columns,
    generateTrace
  };
}

// Serialize/deserialize for localStorage
export interface SerializedAlgorithm {
  id: string;
  name: string;
  description: string;
  code: string;
  executorString: string;
}

export function serializeAlgorithm(algorithm: Algorithm, executorString: string): SerializedAlgorithm {
  return {
    id: algorithm.id,
    name: algorithm.name,
    description: algorithm.description,
    code: algorithm.code,
    executorString
  };
}

export function deserializeAlgorithm(serialized: SerializedAlgorithm): Algorithm {
  // Reconstruct executor function from string
  // eslint-disable-next-line no-new-func
  const executor = new Function('capture', serialized.executorString) as (capture: CaptureFunction) => void;

  return createCustomAlgorithm({
    name: serialized.name,
    description: serialized.description,
    code: serialized.code,
    executor
  });
}
