import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FileState {
    uploadedImages: { name: string; dataUrl: string }[];
    selectedImage: string | null;
    selectedClassicCVImage: string | null;
}

const initialState: FileState = {
    uploadedImages: [],
    selectedImage: null,
    selectedClassicCVImage: null,
};

const fileSlice = createSlice({
    name: 'file',
    initialState,
    reducers: {
        addUploadedImage: (state, action: PayloadAction<{ name: string; dataUrl: string }>) => {
            state.uploadedImages.push(action.payload);
        },
        setSelectedImage: (state, action: PayloadAction<string | null>) => {
            state.selectedImage = action.payload;
        },
        setSelectedClassicCVImage: (state, action: PayloadAction<string | null>) => {
            state.selectedClassicCVImage = action.payload;
        },
        deleteImage: (state, action: PayloadAction<string>) => {
            state.uploadedImages = state.uploadedImages.filter(img => img.dataUrl !== action.payload);
            if (state.selectedImage === action.payload) {
                state.selectedImage = null;
            }
        },
    },
});

export const { addUploadedImage, setSelectedImage, setSelectedClassicCVImage, deleteImage } = fileSlice.actions;
export default fileSlice.reducer;