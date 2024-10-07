import 'katex/dist/katex.min.css';
import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import { applyToImageData as applyHomogeneousDiffusion } from '../../core/diffusion-filters/homogeneous-diffusion';
import { applyToImageData as applyPeronaMalikCatte } from '../../core/diffusion-filters/perona-malik-catte';
import { applyToImageData as applyHomogeneousDiffusionInpainting } from '../../core/diffusion-filters/homogeneous-diffusion-inpainting';
import { InputField } from "./input-field";

/* Custom Types */

type AlgorithmParameter = {
    label: string;
    type: string;
    value: number | string;
    step?: string;
};

export type Algorithm = {
    name: string;
    parameters: AlgorithmParameter[];
    descriptionFile: string;
    applyFunction: (imageData: ImageData, ...args: any[]) => ImageData;
};

type DiffusionAlgorithmSettingsProps = {
    onApply: (algorithmName: string, algorithmParams: any) => void;
    onAlgorithmChange: (algorithmName: string, defaultParams: any) => void;
};

/**
 * List of available diffusion algorithms
 */
export const algorithms: Algorithm[] = [
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
    {
        name: 'Homogeneous Diffusion Inpainting',
        parameters: [
            { label: 'iterations', value: 10, type: 'number' },
            { label: 'tau', value: 0.24, type: 'number' },
        ],
        descriptionFile: 'homogeneous-diffusion.md',
        applyFunction: applyHomogeneousDiffusionInpainting,
    },
    // Add more algorithms here
];

/**
 * Find an algorithm by its name or index
 * @param identifier The name or index of the algorithm
 * @returns The algorithm object if found, otherwise undefined
 */
export const findAlgorithm = (identifier: string | number): Algorithm | undefined => {
    let algorithm: Algorithm | undefined;

    if (typeof identifier === 'number') {
        // If identifier is a number, treat it as an index
        if (identifier >= 0 && identifier < algorithms.length) {
            algorithm = algorithms[identifier];
        } else {
            console.error("Algorithm index out of range:", identifier);
            return undefined;
        }
    } else {
        // If identifier is a string, treat it as a name
        algorithm = algorithms.find(alg => alg.name === identifier);
    }

    if (!algorithm) {
        console.error("Algorithm not found:", identifier);
        return undefined;
    }

    return algorithm;
};

/**
 * Component for selecting and applying diffusion algorithms
 * @param param0 Props for the component
 * @returns The DiffusionAlgorithmSettings component
 */
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
        const newAlgorithm = findAlgorithm(e.target.value);
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
            acc[param.label] = typeof param.value === 'number' ? param.value : parseFloat(param.value);
            return acc;
        }, {} as { [key: string]: any });

        console.log("Applying algorithm:", selectedAlgorithm.name, "with params:", params);
        onApply(selectedAlgorithm.name, params);
    };

    return (
        <div className="algorithm-settings">
            <div className="algorithm-controls">
                <h2>Diffusion Algorithm</h2>
                <select
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
                <button onClick={handleApply}>
                    Apply {selectedAlgorithm.name}
                </button>
            </div>
            <div className="algorithm-description">
                <h3>Description</h3>
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