import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import ModeNightRoundedIcon from '@mui/icons-material/ModeNightRounded';
import WbSunnyRoundedIcon from '@mui/icons-material/WbSunnyRounded';
import { useAppDispatch, useAppSelector } from '../hooks';
import { toggle } from '../features/theme/themeSlice';

export default function ToggleColorMode() {
  const mode = useAppSelector((state) => state.theme.mode);
  const dispatch = useAppDispatch();

  return (
    <IconButton
      onClick={() => dispatch(toggle())}
      color="primary"
      size="small"
      aria-label="Theme toggle button"
      data-screenshot="toggle-mode"
    >
      {mode === 'dark' ? (
        <WbSunnyRoundedIcon fontSize="small" />
      ) : (
        <ModeNightRoundedIcon fontSize="small" />
      )}
    </IconButton>
  );
}
