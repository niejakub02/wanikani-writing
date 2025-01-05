import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook } from 'react-redux';
import { useSelector } from 'react-redux';
import reducer from './reducers';
import { useDispatch } from 'react-redux';
import { waniKaniApi } from './waniKaniApi';

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(waniKaniApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch: () => AppDispatch = useDispatch;

export default store;
