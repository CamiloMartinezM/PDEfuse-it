import { configureStore } from '@reduxjs/toolkit';
import fileReducer from './fileSlice';
import imageReducer from './imageSlice';
import algorithmReducer from './algorithmSlice';

export const store = configureStore({
    reducer: {
        file: fileReducer,
        image: imageReducer,
        algorithm: algorithmReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;