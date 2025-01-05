import { Prediction } from '@context/ModelContext';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Step = 'home' | 'review';

interface ReviewState {
  subjectIndex: number;
  providedAnswers: Record<string, boolean>;
  predictions: Prediction[];
}

const initialState: ReviewState = {
  subjectIndex: 0,
  providedAnswers: {},
  predictions: [],
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
    },
    setPredictions(state, action: PayloadAction<Prediction[]>) {
      state.predictions = action.payload;
    },
  },
});

export const {
  nextSubject,
  previousSubject,
  updateAnswer,
  clearAnswers,
  setPredictions,
} = reviewSlice.actions;
export default reviewSlice;
