import { Prediction } from '@context/ModelContext';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Step = 'home' | 'review';

interface ReviewState {
  subjectIndex: number;
  providedAnswers: Record<string, boolean>;
  predictions: Prediction[];
  hideMeanings: boolean;
  hideReadings: boolean;
}

const initialState: ReviewState = {
  subjectIndex: 0,
  providedAnswers: {},
  predictions: [],
  hideMeanings: false,
  hideReadings: false,
};

export const reviewSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {
    nextSubject(state) {
      state.subjectIndex += 1;
    },
    previousSubject(state) {
      state.subjectIndex -= 1;
    },
    updateAnswer(
      state,
      action: PayloadAction<{ id: number; isCorrect: boolean }>
    ) {
      state.providedAnswers[action.payload.id] = action.payload.isCorrect;
    },
    clearAnswers(state) {
      state.providedAnswers = {};
      state.subjectIndex = 0;
    },
    setPredictions(state, action: PayloadAction<Prediction[]>) {
      state.predictions = action.payload;
    },
    toggleMeaningsVisibility(state) {
      state.hideMeanings = !state.hideMeanings;
    },
    toggleReadingsVisibility(state) {
      state.hideReadings = !state.hideReadings;
    },
  },
});

export const {
  nextSubject,
  previousSubject,
  updateAnswer,
  clearAnswers,
  setPredictions,
  toggleMeaningsVisibility,
  toggleReadingsVisibility,
} = reviewSlice.actions;
export default reviewSlice;
