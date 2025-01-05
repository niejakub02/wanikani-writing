import { defaultSettings } from '@hooks/useSettings';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type Step = 'home' | 'review' | 'settings';

export type Settings = {
  waniKaniAccessToken: string;
  allowManualAnswerReview: boolean;
  topInferredValuesUsed: number;
};

interface GlobalState {
  step: Step;
  settings: Settings;
}

const initialState: GlobalState = {
  step: 'home',
  settings: defaultSettings,
};

export const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    navigate(state, action: PayloadAction<Step>) {
      state.step = action.payload;
    },
    initalizeSettings(state, action: PayloadAction<Settings>) {
      state.settings = action.payload;
    },
  },
});

export const { navigate, initalizeSettings } = globalSlice.actions;
export default globalSlice;
