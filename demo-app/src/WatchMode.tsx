import { useState, useMemo } from 'react';
import { TraceTable, type TraceTableRow } from './TraceTable';
import { CodeDisplay } from './CodeDisplay';
import type { Algorithm } from './algorithms';

interface WatchModeProps {
  algorithm: Algorithm;
}

export const WatchMode = ({ algorithm }: WatchModeProps) => {
  const { columns, code, name, generateTrace } = algorithm;

  // Generate full trace once
  const fullTrace = useMemo(() => generateTrace(), [generateTrace]);

  const [currentStep, setCurrentStep] = useState(0);
  const [changedCells, setChangedCells] = useState<Set<string>>(new Set());

  const visibleRows = fullTrace.slice(0, currentStep);

  const executeNextStep = () => {
    if (currentStep >= fullTrace.length) {
      return;
    }

    const nextRow = fullTrace[currentStep];
    const previousRow = currentStep > 0 ? fullTrace[currentStep - 1] : null;

    // Detect which cells changed
    const changed = new Set<string>();
    if (previousRow) {
      columns.forEach(col => {
        if (previousRow[col.key] !== nextRow[col.key]) {
          changed.add(col.key);
        }
      });
    } else {
      // First row - all cells are "new"
      columns.forEach(col => changed.add(col.key));
    }

    setChangedCells(changed);
    setCurrentStep(prev => prev + 1);
  };

  const reset = () => {
    setCurrentStep(0);
    setChangedCells(new Set());
  };

  const isComplete = currentStep >= fullTrace.length;

  return (
    <div>
      <CodeDisplay title={`Algorithm: ${name}`} code={code} />

      <TraceTable
        columns={columns}
        rows={visibleRows}
        highlightRow={visibleRows.length > 0 ? visibleRows.length - 1 : undefined}
        changedCells={changedCells}
      />

      <div className="mt-5 flex gap-3">
        <button
          onClick={executeNextStep}
          disabled={isComplete}
          className="px-5 py-2.5 text-base cursor-pointer rounded border border-slate-700 bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed disabled:border-gray-500"
        >
          {currentStep === 0 ? 'Start Trace' : 'Next Step'}
        </button>

        {visibleRows.length > 0 && (
          <button
            onClick={reset}
            className="px-5 py-2.5 text-base cursor-pointer rounded border border-slate-700 bg-gray-500 text-white hover:bg-gray-600 transition-colors"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
};
