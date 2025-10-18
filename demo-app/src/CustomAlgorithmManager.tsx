import { useState } from 'react';
import type { Algorithm } from './algorithms';
import type { SerializedAlgorithm } from './createCustomAlgorithm';

interface CustomAlgorithmManagerProps {
  customAlgorithms: Algorithm[];
  onEdit: (algorithm: Algorithm) => void;
  onDelete: (algorithmId: string) => void;
  onClose: () => void;
}

export const CustomAlgorithmManager = ({
  customAlgorithms,
  onEdit,
  onDelete,
  onClose
}: CustomAlgorithmManagerProps) => {
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleDelete = (algorithmId: string) => {
    onDelete(algorithmId);
    setConfirmDelete(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-3xl font-bold mb-6">Manage Custom Algorithms</h2>

          {customAlgorithms.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No custom algorithms yet.</p>
              <p className="text-sm mt-2">Click "Create Custom" to add your first algorithm!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {customAlgorithms.map((algo) => (
                <div
                  key={algo.id}
                  className="border border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900">{algo.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{algo.description}</p>
                      <div className="mt-2 flex gap-2 text-xs text-gray-500">
                        <span>{algo.columns.length} columns</span>
                        <span>•</span>
                        <span>{algo.generateTrace().length} steps</span>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => onEdit(algo)}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
                      >
                        Edit
                      </button>
                      {confirmDelete === algo.id ? (
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleDelete(algo.id)}
                            className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setConfirmDelete(null)}
                            className="px-3 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition-colors text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDelete(algo.id)}
                          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Show code preview */}
                  {algo.code && (
                    <pre className="mt-3 p-3 bg-gray-100 rounded text-xs overflow-x-auto">
                      {algo.code}
                    </pre>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
