import React, { useState, useEffect } from 'react';
import { InputField } from "./input-field";
import { processImageWithHomogeneousDiffusion } from '../diffusion-algorithms/homogeneous-diffusion';

/* Custom Types */

type AlgorithmParameter = {
    label: string;
    type: string;
    value: number | string;
    step?: string;
};

type Algorithm = {
    name: string;
    parameters: AlgorithmParameter[];
};

type DiffusionAlgorithmSettingsProps = {
    onApply: (algorithmName: string, algorithmParams: any) => void;
    onAlgorithmChange: (algorithmName: string, defaultParams: any) => void;
};

/* Available Diffusion-Algorithms */

const algorithms: Algorithm[] = [
    {
        name: 'Homogeneous Diffusion',
        parameters: [
            { label: 'Number of Iterations:', type: 'number', value: 10 },
            { label: 'Time-step:', type: 'number', value: 0.25, step: '0.01' },
        ],
    },
    {
        name: 'Other Algorithm',
        parameters: [
            { label: 'A parameter:', type: 'number', value: 10 }
        ],
    },
    // Add more algorithms here
];

export const algorithmFunctions = {
    'Homogeneous Diffusion': processImageWithHomogeneousDiffusion,
};
  
export const DiffusionAlgorithmSettings: React.FC<DiffusionAlgorithmSettingsProps> = ({ onApply, onAlgorithmChange }) => {  
    const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>(algorithms[0].name);
    const [parameters, setParameters] = useState<AlgorithmParameter[]>([]);

    useEffect(() => {
        // Update the parameters based on the selected algorithm
        const algorithm = algorithms.find((alg) => alg.name === selectedAlgorithm);
        if (algorithm) {
            setParameters(algorithm.parameters);
        }
    }, [selectedAlgorithm]);

    const handleParameterChange = (index: number, value: number | string) => {
        setParameters((prevParams) => {
            const newParams = [...prevParams];
            newParams[index] = { ...newParams[index], value };
            return newParams;
        });
    };

    const handleApply = () => {
        // Construct parameter object to pass to the onApply callback
        const params: { [key: string]: any } = parameters.reduce((acc, param) => {
            acc[param.label] = param.value;
            return acc;
        }, {} as { [key: string]: any });

        console.log("Applying algorithm:", selectedAlgorithm, "with params:", params);
        onAlgorithmChange(selectedAlgorithm, params);   
        onApply(selectedAlgorithm, params); // Call the onApply callback
    };

    return (
        <div className="settings-panel">
            <h3>Diffusion Algorithm</h3>
            <select onChange={(e) => setSelectedAlgorithm(e.target.value)}>
                {algorithms.map((alg) => (
                    <option key={alg.name} value={alg.name}>
                        {alg.name}
                    </option>
                ))}
            </select>
            {parameters.map((param, index) => (
                <InputField
                    key={param.label}
                    type={param.type}
                    label={param.label}
                    className="input-style-class"
                    value={param.value}
                    step={param.step}
                    onChange={(e) => handleParameterChange(index, e.target.value)}
                />
            ))}
            <button onClick={handleApply}>Apply {selectedAlgorithm}</button>
        </div>
    );
};

export default DiffusionAlgorithmSettings;