import { useState } from 'react';
import { createCustomAlgorithm, type CaptureFunction } from './createCustomAlgorithm';
import type { Algorithm } from './algorithms';
import { TraceTable } from './TraceTable';

interface AlgorithmBuilderProps {
  onSave: (algorithm: Algorithm, executorString: string) => void;
  onCancel: () => void;
}

export const AlgorithmBuilder = ({ onSave, onCancel }: AlgorithmBuilderProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [executorString, setExecutorString] = useState('');
  const [previewAlgorithm, setPreviewAlgorithm] = useState<Algorithm | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTestRun = () => {
    setError(null);
    setPreviewAlgorithm(null);

    if (!name.trim()) {
      setError('Please enter an algorithm name');
      return;
    }

    if (!executorString.trim()) {
      setError('Please enter executor function code');
      return;
    }

    try {
      // Create executor function from string
      // eslint-disable-next-line no-new-func
      const executor = new Function('capture', executorString) as (capture: CaptureFunction) => void;

      const algorithm = createCustomAlgorithm({
        name: name.trim(),
        description: description.trim() || 'Custom algorithm',
        code: code.trim() || 'Custom code',
        executor
      });

      setPreviewAlgorithm(algorithm);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    }
  };

  const handleSave = () => {
    if (!previewAlgorithm) {
      setError('Please test run your algorithm first');
      return;
    }

    onSave(previewAlgorithm, executorString);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-3xl font-bold mb-6">Create Custom Algorithm</h2>

          {/* Name */}
          <div className="mb-4">
            <label htmlFor="algo-name" className="block text-sm font-semibold mb-2">
              Algorithm Name *
            </label>
            <input
              id="algo-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., My Custom Algorithm"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label htmlFor="algo-desc" className="block text-sm font-semibold mb-2">
              Description
            </label>
            <input
              id="algo-desc"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does this algorithm do?"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Code Display */}
          <div className="mb-4">
            <label htmlFor="algo-code" className="block text-sm font-semibold mb-2">
              Code (for display)
            </label>
            <textarea
              id="algo-code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="The code that will be shown to users"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Executor Function */}
          <div className="mb-4">
            <label htmlFor="algo-executor" className="block text-sm font-semibold mb-2">
              Executor Function *
              <span className="text-xs font-normal text-gray-600 ml-2">
                (Call <code className="bg-gray-100 px-1 rounded">capture(vars)</code> at end of each iteration)
              </span>
            </label>
            <textarea
              id="algo-executor"
              value={executorString}
              onChange={(e) => setExecutorString(e.target.value)}
              placeholder={`let sum = 0;
for (let i = 0; i <= 5; i++) {
  sum += i;
  capture({ i, sum, condition: i <= 5 });
}
capture({ i: 6, sum, condition: false });`}
              rows={10}
              className="w-full px-3 py-2 border border-gray-300 rounded font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-300 rounded text-red-800">
              <strong>Error:</strong> {error}
            </div>
          )}

          {/* Preview */}
          {previewAlgorithm && (
            <div className="mb-4 p-4 bg-green-50 border border-green-300 rounded">
              <h3 className="font-semibold text-green-900 mb-2">✓ Preview (Test Run Successful)</h3>
              <div className="max-h-60 overflow-y-auto">
                <TraceTable
                  columns={previewAlgorithm.columns}
                  rows={previewAlgorithm.generateTrace()}
                />
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleTestRun}
              className="px-5 py-2.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Test Run
            </button>
            <button
              onClick={handleSave}
              disabled={!previewAlgorithm}
              className="px-5 py-2.5 bg-green-500 text-white rounded hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Add to Library
            </button>
            <button
              onClick={onCancel}
              className="px-5 py-2.5 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
