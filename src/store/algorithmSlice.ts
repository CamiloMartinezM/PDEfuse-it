import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Algorithm } from '../components/forms/diffusion-algorithm-settings';
import { algorithms } from './algorithms';

interface AlgorithmState {
    algorithms: Algorithm[];
    selectedAlgorithm: Algorithm | null;
    algorithmParams: Record<string, number>;
}

const initialState: AlgorithmState = {
    algorithms: algorithms,
    selectedAlgorithm: null,
    algorithmParams: {},
};

const algorithmSlice = createSlice({
    name: 'algorithm',
    initialState,
    reducers: {
        setSelectedAlgorithm: (state, action: PayloadAction<Algorithm>) => {
            state.selectedAlgorithm = action.payload;
            state.algorithmParams = action.payload.parameters.reduce(
                (acc, param) => {
                    acc[param.label] = typeof param.value === 'number' ? param.value : parseFloat(param.value);
                    return acc;
                },
                {} as Record<string, number>
            );
        },
        updateAlgorithmParam: (state, action: PayloadAction<{ label: string; value: number }>) => {
            state.algorithmParams[action.payload.label] = action.payload.value;
        },
    },
});

export const { setSelectedAlgorithm, updateAlgorithmParam } = algorithmSlice.actions;
export default algorithmSlice.reducer;