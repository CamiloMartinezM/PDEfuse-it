import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ImageState {
  processedImage: string | null
  editedImage: string | null
  exposure: number
  offset: number
  gamma: number
  isInverted: boolean
  paintedAreas: boolean[][]
  isPainting: boolean
  paintSquareSize: number
  isDrawingMode: boolean
  comparisonMode: 'side-by-side' | 'juxtaposed'
  sliderPosition: number
  zoom: number
}

const initialState: ImageState = {
  processedImage: null,
  editedImage: null,
  exposure: 0,
  offset: 0,
  gamma: 1,
  isInverted: false,
  paintedAreas: [],
  isPainting: false,
  paintSquareSize: 50,
  isDrawingMode: false,
  comparisonMode: 'side-by-side',
  sliderPosition: 50,
  zoom: 1
}

const imageSlice = createSlice({
  name: 'image',
  initialState,
  reducers: {
    setProcessedImage: (state, action: PayloadAction<string | null>) => {
      state.processedImage = action.payload
    },
    setEditedImage: (state, action: PayloadAction<string | null>) => {
      state.editedImage = action.payload
    },
    setExposure: (state, action: PayloadAction<number>) => {
      state.exposure = action.payload
    },
    setOffset: (state, action: PayloadAction<number>) => {
      state.offset = action.payload
    },
    setGamma: (state, action: PayloadAction<number>) => {
      state.gamma = action.payload
    },
    toggleInvert: (state) => {
      state.isInverted = !state.isInverted
    },
    setPaintedAreas: (state, action: PayloadAction<boolean[][]>) => {
      state.paintedAreas = action.payload
    },
    setIsPainting: (state, action: PayloadAction<boolean>) => {
      state.isPainting = action.payload
    },
    setPaintSquareSize: (state, action: PayloadAction<number>) => {
      state.paintSquareSize = action.payload
    },
    toggleDrawingMode: (state) => {
      state.isDrawingMode = !state.isDrawingMode
    },
    setComparisonMode: (state, action: PayloadAction<'side-by-side' | 'juxtaposed'>) => {
      state.comparisonMode = action.payload
    },
    setSliderPosition: (state, action: PayloadAction<number>) => {
      state.sliderPosition = action.payload
    },
    setZoom: (state, action: PayloadAction<number>) => {
      state.zoom = action.payload
    }
  }
})

export const {
  setProcessedImage,
  setEditedImage,
  setExposure,
  setOffset,
  setGamma,
  toggleInvert,
  setPaintedAreas,
  setIsPainting,
  setPaintSquareSize,
  toggleDrawingMode,
  setComparisonMode,
  setSliderPosition,
  setZoom
} = imageSlice.actions

export default imageSlice.reducer
