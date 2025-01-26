import { useAppDispatch } from '@app/store';
import { initalizeSettings } from '@features/globalSlice';
import { useEffect } from 'react';
import { Settings } from 'src/types/common';

export const defaultSettings: Settings = {
  waniKaniAccessToken: '',
  allowManualAnswerReview: false,
  topInferredValuesUsed: 1,
  hideMeaningsByDefault: false,
  hideReadingsByDefault: false,
  shouldShuffleReview: false,
};

export const useSettings = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.warn('Settings initalized!');
    const token = localStorage.getItem('waniKaniAccessToken');
    const manualResolution =
      // localStorage.getItem('allowManualAnswerReview') === 'true';
      false;
    const topInferredValuesUsed = Number(
      localStorage.getItem('topInferredValuesUsed') ??
        defaultSettings.topInferredValuesUsed
    );
    const hideMeaningsByDefault =
      localStorage.getItem('hideMeaningsByDefault') === 'true';
    const hideReadingsByDefault =
      localStorage.getItem('hideReadingsByDefault') === 'true';
    const shouldShuffleReview =
      localStorage.getItem('shouldShuffleReview') === 'true';

    dispatch(
      initalizeSettings({
        waniKaniAccessToken: token ?? defaultSettings.waniKaniAccessToken,
        allowManualAnswerReview:
          manualResolution ?? defaultSettings.allowManualAnswerReview,
        topInferredValuesUsed:
          topInferredValuesUsed ?? defaultSettings.topInferredValuesUsed,
        hideMeaningsByDefault:
          hideMeaningsByDefault ?? defaultSettings.hideMeaningsByDefault,
        hideReadingsByDefault:
          hideReadingsByDefault ?? defaultSettings.hideReadingsByDefault,
        shouldShuffleReview:
          shouldShuffleReview ?? defaultSettings.shouldShuffleReview,
      })
    );
  }, [dispatch]);

  return {};
};
