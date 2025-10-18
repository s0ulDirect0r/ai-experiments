import { useState, useEffect } from 'react'
import { WatchMode } from './WatchMode'
import { PracticeMode } from './PracticeMode'
import { algorithms } from './algorithms'
import { AlgorithmBuilder } from './AlgorithmBuilder'
import { CustomAlgorithmManager } from './CustomAlgorithmManager'
import { loadCustomAlgorithms, addCustomAlgorithm, updateCustomAlgorithm, removeCustomAlgorithm, getExecutorString } from './algorithmStorage'
import type { Algorithm } from './algorithms'

type Mode = 'watch' | 'practice'

function App() {
  const [mode, setMode] = useState<Mode>('watch');
  const [customAlgorithms, setCustomAlgorithms] = useState<Algorithm[]>([]);
  const [executorStrings, setExecutorStrings] = useState<Map<string, string>>(new Map());
  const [showBuilder, setShowBuilder] = useState(false);
  const [showManager, setShowManager] = useState(false);
  const [algorithmToEdit, setAlgorithmToEdit] = useState<{ algorithm: Algorithm; executorString: string } | undefined>();

  // Load custom algorithms on mount
  useEffect(() => {
    const { algorithms, executorStrings: loadedExecutorStrings } = loadCustomAlgorithms();
    setCustomAlgorithms(algorithms);
    setExecutorStrings(loadedExecutorStrings);
  }, []);

  const allAlgorithms = [...algorithms, ...customAlgorithms];
  const [selectedAlgorithmId, setSelectedAlgorithmId] = useState(allAlgorithms[0]?.id || '');

  const selectedAlgorithm = allAlgorithms.find(a => a.id === selectedAlgorithmId) || allAlgorithms[0];

  const handleSaveCustomAlgorithm = (algorithm: Algorithm, executorString: string, isEdit: boolean) => {
    if (isEdit) {
      updateCustomAlgorithm(algorithm, executorString);
      setCustomAlgorithms(prev => prev.map(a => a.id === algorithm.id ? algorithm : a));
      setExecutorStrings(prev => new Map(prev).set(algorithm.id, executorString));
    } else {
      addCustomAlgorithm(algorithm, executorString);
      setCustomAlgorithms(prev => [...prev, algorithm]);
      setExecutorStrings(prev => new Map(prev).set(algorithm.id, executorString));
    }
    setSelectedAlgorithmId(algorithm.id);
    setShowBuilder(false);
    setAlgorithmToEdit(undefined);
  };

  const handleEditAlgorithm = (algorithm: Algorithm) => {
    const executorString = executorStrings.get(algorithm.id);
    if (executorString) {
      setAlgorithmToEdit({ algorithm, executorString });
      setShowManager(false);
      setShowBuilder(true);
    } else {
      console.error('Could not find executor string for algorithm:', algorithm.id);
      alert('Error: Could not load algorithm for editing');
    }
  };

  const handleDeleteAlgorithm = (algorithmId: string) => {
    removeCustomAlgorithm(algorithmId);
    setCustomAlgorithms(prev => prev.filter(a => a.id !== algorithmId));
    setExecutorStrings(prev => {
      const newMap = new Map(prev);
      newMap.delete(algorithmId);
      return newMap;
    });

    // If deleted algorithm was selected, switch to first available
    if (selectedAlgorithmId === algorithmId) {
      setSelectedAlgorithmId(allAlgorithms[0]?.id || '');
    }
  };

  return (
    <div className="p-5 max-w-screen-xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">Trace Table Demo</h1>

      {/* Algorithm Selector */}
      <div className="mb-6 flex gap-3 items-end">
        <div className="flex-1">
          <label htmlFor="algorithm-select" className="block text-sm font-semibold mb-2 text-gray-700">
            Select Algorithm:
          </label>
          <select
            id="algorithm-select"
            value={selectedAlgorithmId}
            onChange={(e) => setSelectedAlgorithmId(e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <optgroup label="Built-in Algorithms">
              {algorithms.map(algo => (
                <option key={algo.id} value={algo.id}>
                  {algo.name} - {algo.description}
                </option>
              ))}
            </optgroup>
            {customAlgorithms.length > 0 && (
              <optgroup label="Custom Algorithms">
                {customAlgorithms.map(algo => (
                  <option key={algo.id} value={algo.id}>
                    {algo.name} - {algo.description}
                  </option>
                ))}
              </optgroup>
            )}
          </select>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowBuilder(true)}
            className="px-5 py-2 bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-600 transition-colors whitespace-nowrap"
          >
            + Create Custom
          </button>
          {customAlgorithms.length > 0 && (
            <button
              onClick={() => setShowManager(true)}
              className="px-5 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors whitespace-nowrap"
            >
              Manage Custom
            </button>
          )}
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="mb-6 flex gap-2 border-b border-gray-300 pb-2">
        <button
          onClick={() => setMode('watch')}
          className={`px-6 py-2 font-semibold rounded-t transition-colors ${
            mode === 'watch'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Watch Mode
        </button>
        <button
          onClick={() => setMode('practice')}
          className={`px-6 py-2 font-semibold rounded-t transition-colors ${
            mode === 'practice'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Practice Mode
        </button>
      </div>

      {/* Mode Description */}
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
        <p className="text-sm text-blue-900">
          {mode === 'watch' ? (
            <>
              <strong>Watch Mode:</strong> Step through the algorithm and see how variables change at each iteration.
              Changed values are highlighted in green.
            </>
          ) : (
            <>
              <strong>Practice Mode:</strong> Fill in the trace table yourself! Enter your predicted values and
              check if you're correct. Great for learning and testing your understanding.
            </>
          )}
        </p>
      </div>

      {/* Render the selected mode */}
      {mode === 'watch' ? (
        <WatchMode key={selectedAlgorithmId} algorithm={selectedAlgorithm} />
      ) : (
        <PracticeMode key={selectedAlgorithmId} algorithm={selectedAlgorithm} />
      )}

      {/* Algorithm Builder Modal */}
      {showBuilder && (
        <AlgorithmBuilder
          onSave={handleSaveCustomAlgorithm}
          onCancel={() => {
            setShowBuilder(false);
            setAlgorithmToEdit(undefined);
          }}
          algorithmToEdit={algorithmToEdit}
        />
      )}

      {/* Custom Algorithm Manager Modal */}
      {showManager && (
        <CustomAlgorithmManager
          customAlgorithms={customAlgorithms}
          onEdit={handleEditAlgorithm}
          onDelete={handleDeleteAlgorithm}
          onClose={() => setShowManager(false)}
        />
      )}
    </div>
  )
}

export default App
