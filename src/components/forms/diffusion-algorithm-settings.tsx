import 'katex/dist/katex.min.css';
import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import { applyToImageData as applyHomogeneousDiffusion } from '../../core/diffusion-filters/homogeneous-diffusion';
import { applyToImageData as applyPeronaMalikCatte } from '../../core/diffusion-filters/perona-malik-catte';
import { InputField } from "./input-field";

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
    descriptionFile: string;
    applyFunction: (imageData: ImageData, ...args: any[]) => ImageData;
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
        descriptionFile: 'homogeneous-diffusion.md',
        applyFunction: applyHomogeneousDiffusion,
    },
    {
        name: 'Perona-Malik with Catte',
        parameters: [
            { label: 'Number of Iterations:', type: 'number', value: 10 },
            { label: 'Time-step:', type: 'number', value: 0.24, step: '0.01' },
            { label: 'Lambda:', type: 'number', value: 5, step: '0.1' },
            { label: 'Sigma:', type: 'number', value: 1, step: '0.1' },
        ],
        descriptionFile: 'perona-malik-catte.md',
        applyFunction: applyPeronaMalikCatte,
    },
    // Add more algorithms here
];

export const algorithmFunctions = {
    'Homogeneous Diffusion': applyHomogeneousDiffusion,
    'Perona-Malik with Catte': applyPeronaMalikCatte,
};

export const DiffusionAlgorithmSettings: React.FC<DiffusionAlgorithmSettingsProps> = ({ onApply, onAlgorithmChange }) => {
    const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm>(algorithms[0]);
    const [parameters, setParameters] = useState<AlgorithmParameter[]>([]);
    const [description, setDescription] = useState('');

    useEffect(() => {
        // Update the parameters and load description based on the selected algorithm
        setParameters(selectedAlgorithm.parameters);
        loadDescription(selectedAlgorithm.descriptionFile);
    }, [selectedAlgorithm]);

    const loadDescription = async (filename: string) => {
        try {
            const response = await fetch(`/descriptions/${filename}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const text = await response.text();
            setDescription(text);
        } catch (error) {
            console.error("Failed to load description:", error);
            setDescription("Failed to load description.");
        }
    };

    const handleAlgorithmChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newAlgorithm = algorithms.find(alg => alg.name === e.target.value);
        if (newAlgorithm) {
            setSelectedAlgorithm(newAlgorithm);
            onAlgorithmChange(newAlgorithm.name, newAlgorithm.parameters.reduce((acc, param) => {
                acc[param.label] = param.value;
                return acc;
            }, {} as { [key: string]: any }));
        }
    };

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

        console.log("Applying algorithm:", selectedAlgorithm.name, "with params:", params);
        onApply(selectedAlgorithm.name, params);
    };

    return (
        <div className="p-4 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-4">Diffusion Algorithm</h2>
            <select
                className="w-full p-2 mb-4 border rounded"
                value={selectedAlgorithm.name}
                onChange={handleAlgorithmChange}
            >
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
            <button
                className="w-full p-2 mt-4 bg-blue-500 text-black rounded hover:bg-blue-600"
                onClick={handleApply}
            >
                Apply {selectedAlgorithm.name}
            </button>
            <div className="mt-8">
                <h3 className="text-xl font-semibold mb-2">Description</h3>
                <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                    className="prose"
                >
                    {description}
                </ReactMarkdown>
            </div>
        </div>
    );
};

export default DiffusionAlgorithmSettings;