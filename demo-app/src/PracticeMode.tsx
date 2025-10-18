import { useState, useMemo } from 'react';
import { type TraceTableRow } from './TraceTable';
import { CodeDisplay } from './CodeDisplay';
import type { Algorithm } from './algorithms';

interface ValidationResult {
  [key: string]: boolean | null; // null = not checked yet
}

interface PracticeModeProps {
  algorithm: Algorithm;
}

export const PracticeMode = ({ algorithm }: PracticeModeProps) => {
  const { columns, code, name, generateTrace } = algorithm;

  // Generate full trace once
  const fullTrace = useMemo(() => generateTrace(), [generateTrace]);

  const [visibleRows, setVisibleRows] = useState<TraceTableRow[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  // Practice-specific state
  const [practiceInput, setPracticeInput] = useState<{ [key: string]: string }>({});
  const [validationResult, setValidationResult] = useState<ValidationResult>({});
  const [isValidated, setIsValidated] = useState(false);
  const [expectedRow, setExpectedRow] = useState<TraceTableRow | null>(null);

  const handleInputChange = (key: string, value: string) => {
    setPracticeInput(prev => ({ ...prev, [key]: value }));
    // Clear validation for this field when user changes it
    if (isValidated) {
      setValidationResult(prev => ({ ...prev, [key]: null }));
    }
  };

  const normalizeValue = (value: string | number | boolean): string => {
    return String(value).toLowerCase().trim();
  };

  const checkAnswer = () => {
    if (currentStep >= fullTrace.length) {
      return;
    }

    const expected = fullTrace[currentStep];
    setExpectedRow(expected);

    const results: ValidationResult = {};
    let allCorrect = true;

    columns.forEach(col => {
      const userValue = normalizeValue(practiceInput[col.key] || '');
      const expectedValue = normalizeValue(expected[col.key]);

      const isCorrect = userValue === expectedValue;
      results[col.key] = isCorrect;

      if (!isCorrect) {
        allCorrect = false;
      }
    });

    setValidationResult(results);
    setIsValidated(true);

    // If all correct, automatically advance
    if (allCorrect) {
      setTimeout(() => {
        continueToNext(expected);
      }, 800); // Brief delay to show success state
    }
  };

  const continueToNext = (row: TraceTableRow) => {
    // Lock in the row
    setVisibleRows(prev => [...prev, row]);
    setCurrentStep(prev => prev + 1);

    // Clear practice state
    setPracticeInput({});
    setValidationResult({});
    setIsValidated(false);
    setExpectedRow(null);
  };

  const showAnswer = () => {
    if (expectedRow) {
      const filledInput: { [key: string]: string } = {};
      columns.forEach(col => {
        filledInput[col.key] = String(expectedRow[col.key]);
      });
      setPracticeInput(filledInput);

      // Mark all as correct
      const results: ValidationResult = {};
      columns.forEach(col => {
        results[col.key] = true;
      });
      setValidationResult(results);
    }
  };

  const reset = () => {
    setVisibleRows([]);
    setCurrentStep(0);
    setPracticeInput({});
    setValidationResult({});
    setIsValidated(false);
    setExpectedRow(null);
  };

  const isComplete = currentStep >= fullTrace.length;
  const allCorrect = Object.values(validationResult).every(v => v === true);

  return (
    <div>
      <CodeDisplay title={`Algorithm: ${name}`} code={code} />

      {/* Practice Table */}
      <div className="w-full overflow-x-auto my-5">
        <table className="w-full border-collapse font-mono shadow-lg">
          <thead className="bg-slate-700 text-white">
            <tr>
              <th className="px-4 py-3 text-left font-semibold border border-slate-600 w-20 text-center bg-slate-200 text-slate-900">
                Step
              </th>
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3 text-left font-semibold border border-slate-600">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Locked-in rows */}
            {visibleRows.map((row, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
              >
                <td className="px-4 py-2.5 border border-gray-300 font-semibold bg-gray-100 text-center">
                  {index + 1}
                </td>
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-2.5 border border-gray-300">
                    {String(row[col.key])}
                  </td>
                ))}
              </tr>
            ))}

            {/* Current input row */}
            {!isComplete && (
              <tr className="bg-yellow-50">
                <td className="px-4 py-2.5 border border-gray-300 font-semibold bg-gray-100 text-center">
                  {visibleRows.length + 1}
                </td>
                {columns.map((col) => {
                  const validation = validationResult[col.key];
                  const borderColor = validation === true
                    ? 'border-green-500'
                    : validation === false
                    ? 'border-red-500'
                    : 'border-gray-400';

                  return (
                    <td key={col.key} className="px-4 py-2.5 border border-gray-300">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={practiceInput[col.key] || ''}
                          onChange={(e) => handleInputChange(col.key, e.target.value)}
                          className={`w-full px-2 py-1 border-2 ${borderColor} rounded focus:outline-none focus:ring-2 focus:ring-blue-400`}
                          disabled={allCorrect && isValidated}
                        />
                        {validation === true && <span className="text-green-600 font-bold">✓</span>}
                        {validation === false && <span className="text-red-600 font-bold">✗</span>}
                      </div>
                    </td>
                  );
                })}
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Controls */}
      <div className="mt-5 flex gap-3">
        {!isComplete && !isValidated && (
          <button
            onClick={checkAnswer}
            disabled={Object.keys(practiceInput).length !== columns.length}
            className="px-5 py-2.5 text-base cursor-pointer rounded border border-slate-700 bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed disabled:border-gray-500"
          >
            Check Answer
          </button>
        )}

        {isValidated && !allCorrect && (
          <>
            <button
              onClick={checkAnswer}
              className="px-5 py-2.5 text-base cursor-pointer rounded border border-slate-700 bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={showAnswer}
              className="px-5 py-2.5 text-base cursor-pointer rounded border border-slate-700 bg-yellow-500 text-white hover:bg-yellow-600 transition-colors"
            >
              Show Answer
            </button>
          </>
        )}

        {visibleRows.length > 0 && (
          <button
            onClick={reset}
            className="px-5 py-2.5 text-base cursor-pointer rounded border border-slate-700 bg-gray-500 text-white hover:bg-gray-600 transition-colors"
          >
            Reset
          </button>
        )}
      </div>

      {isComplete && (
        <div className="mt-5 p-4 bg-green-100 border border-green-500 rounded">
          <p className="text-green-800 font-semibold">
            🎉 Great job! You've completed the trace table!
          </p>
        </div>
      )}
    </div>
  );
};
