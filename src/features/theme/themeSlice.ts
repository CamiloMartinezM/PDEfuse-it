import { createSlice } from '@reduxjs/toolkit'
import { PaletteMode } from '@mui/material/styles';

const LOCAL_STORAGE_PALETTE_MODE_KEY = 'mode';

export interface ThemeState {
  mode: PaletteMode
}

// User preferred mode in localStorage
// Current implementation can be improved by using redux-persist
// Due to the simplicity of the app, it's not yet necessary
const userPreferencePaletteMode = localStorage.getItem(LOCAL_STORAGE_PALETTE_MODE_KEY);

// System preference
const systemPrefersDark = window.matchMedia(
  '(prefers-color-scheme: dark)',
).matches;

// Try use user preference, if no preference is found, it uses system preference
const initialState: ThemeState = {
  mode: userPreferencePaletteMode as PaletteMode ?? (systemPrefersDark ? 'dark' : 'light')
}

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggle: state => {
      const newMode = state.mode === 'dark' ? 'light' : 'dark';
      // Persist user selected mode
      localStorage.setItem(LOCAL_STORAGE_PALETTE_MODE_KEY, newMode);
      state.mode = newMode;
    }
  }
})

export const { toggle } = themeSlice.actions

export default themeSlice.reducer