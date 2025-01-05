import { useAppDispatch } from '@app/store';
import { initalizeSettings } from '@features/globalSlice';
import { useEffect } from 'react';
import { Settings } from 'src/types/common';

export const defaultSettings: Settings = {
  waniKaniAccessToken: '',
  allowManualAnswerReview: false,
  topInferredValuesUsed: 1,
};

export const useSettings = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.warn('Settings initalized!');
    const token = localStorage.getItem('waniKaniAccessToken');
    const manualResolution = Boolean(
      localStorage.getItem('allowManualAnswerReview')
    );
    const topInferredValuesUsed = Number(
      localStorage.getItem('topInferredValuesUsed') ??
        defaultSettings.topInferredValuesUsed
    );

    dispatch(
      initalizeSettings({
        waniKaniAccessToken: token ?? defaultSettings.waniKaniAccessToken,
        allowManualAnswerReview:
          manualResolution ?? defaultSettings.allowManualAnswerReview,
        topInferredValuesUsed:
          topInferredValuesUsed ?? defaultSettings.topInferredValuesUsed,
      })
    );
  }, [dispatch]);

  return {};
};
