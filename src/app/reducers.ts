import { combineReducers } from '@reduxjs/toolkit';
import { waniKaniApi } from './waniKaniApi';
// import { kanjiApi } from './api';
// import authSlice from '@features/auth/auth.slice';
import globalSlice from '../features/globalSlice';
import reviewSlice from '@features/review/reviewSlice';

export const rootReducer = combineReducers({
  [waniKaniApi.reducerPath]: waniKaniApi.reducer,
  global: globalSlice.reducer,
  review: reviewSlice.reducer,
});

export default rootReducer;
