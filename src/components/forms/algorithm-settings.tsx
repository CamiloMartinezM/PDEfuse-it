import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store'
import { setSelectedAlgorithm, updateAlgorithmParam } from '../../store/algorithmSlice'
import { setProcessedImage } from '../../store/imageSlice'
// import { Algorithm } from '../components/forms/diffusion-algorithm-settings'

// Import your image processing functions here
// import { applyAlgorithm } from '../core/diffusion-filters/algorithm-helpers';

const AlgorithmSettings: React.FC = () => {
  const dispatch = useDispatch()
  const { algorithms, selectedAlgorithm, algorithmParams } = useSelector(
    (state: RootState) => state.algorithm
  )
  const { editedImage } = useSelector((state: RootState) => state.image)

  const handleAlgorithmChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedAlgorithmName = e.target.value
      const algorithm = algorithms.find((alg) => alg.name === selectedAlgorithmName)
      if (algorithm) {
        dispatch(setSelectedAlgorithm(algorithm))
      }
    },
    [dispatch, algorithms]
  )

  const handleParamChange = useCallback(
    (label: string, value: number) => {
      dispatch(updateAlgorithmParam({ label, value }))
    },
    [dispatch]
  )

  const handleApplyAlgorithm = useCallback(() => {
    if (editedImage && selectedAlgorithm) {
      // Apply the algorithm to the edited image
      // const processedImageData = applyAlgorithm(editedImage, selectedAlgorithm, algorithmParams);
      // dispatch(setProcessedImage(processedImageData));

      // TODO: Implement the actual algorithm application
      console.log('Applying algorithm:', selectedAlgorithm.name, 'with params:', algorithmParams)
    }
  }, [editedImage, selectedAlgorithm, algorithmParams, dispatch])

  return (
    <div className="bg-white shadow-md rounded-lg p-6 space-y-6 dark:text-black">
      <h2 className="text-2xl font-bold text-gray-800">Algorithm Settings</h2>

      <div>
        <label htmlFor="algorithm-select" className="block text-sm font-medium text-gray-700 mb-2">
          Select Algorithm
        </label>
        <select
          id="algorithm-select"
          value={selectedAlgorithm?.name || ''}
          onChange={handleAlgorithmChange}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">Select an algorithm</option>
          {algorithms.map((algorithm) => (
            <option key={algorithm.name} value={algorithm.name}>
              {algorithm.name}
            </option>
          ))}
        </select>
      </div>

      {selectedAlgorithm && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">Parameters</h3>
          {selectedAlgorithm.parameters.map((param) => (
            <div key={param.label}>
              <label htmlFor={param.label} className="block text-sm font-medium text-gray-700 mb-1">
                {param.label}
              </label>
              <input
                type="range"
                id={param.label}
                // min={param.min}
                // max={param.max}
                step={param.step}
                value={algorithmParams[param.label] || param.value}
                onChange={(e) => handleParamChange(param.label, parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm text-gray-600">
                {algorithmParams[param.label] || param.value}
              </span>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={handleApplyAlgorithm}
        disabled={!selectedAlgorithm || !editedImage}
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        Apply Algorithm
      </button>
    </div>
  )
}

export default AlgorithmSettings
