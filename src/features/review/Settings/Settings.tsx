import { useAppDispatch, useAppSelector } from '@app/store';
import { initalizeSettings, navigate } from '@features/globalSlice';
import { Button, Slider, Switch, TextField } from '@mui/material';
import { ChangeEvent, useState } from 'react';
import './Settings.scss';
import { useReviewSubjectsQuery } from '@app/waniKaniApi';
import { clearAnswers } from '../reviewSlice';
import { isEqual } from 'lodash';
import { Settings as SettingsType } from '@common-types/common';

export const Settings = () => {
  const { settings } = useAppSelector((state) => state.global);
  const [settingsDraft, setSettingsDraft] = useState<SettingsType>(settings);
  const { refetch } = useReviewSubjectsQuery();
  const dispatch = useAppDispatch();

  const handleOnChange = (e: ChangeEvent | Event) => {
    const target = e.target as HTMLInputElement;
    if (
      [
        'allowManualAnswerReview',
        'hideMeaningsByDefault',
        'hideReadingsByDefault',
        'shouldShuffleReview',
        'liteMode',
      ].includes(target.name)
    ) {
      setSettingsDraft((prev) => ({
        ...prev,
        [target.name]: target.checked,
      }));
    } else {
      setSettingsDraft((prev) => ({
        ...prev,
        [target.name]: target.value,
      }));
    }
  };

  const handleOnSettingsUpdate = () => {
    Object.entries(settingsDraft).forEach(([name, value]) => {
      localStorage.setItem(name, value.toString());
    });
    if (settingsDraft.liteMode) {
      document.body.setAttribute('lite-mode', '');
    } else {
      document.body.removeAttribute('lite-mode');
    }
    dispatch(initalizeSettings(settingsDraft));
    dispatch(navigate('home'));
    dispatch(clearAnswers());
    refetch();
  };

  return (
    <div className="settings-container">
      <div className="settings-container__column">
        <span>WaniKani access token</span>
        <TextField
          name="waniKaniAccessToken"
          value={settingsDraft.waniKaniAccessToken}
          variant="standard"
          size="small"
          onChange={handleOnChange}
        />
      </div>
      <hr />
      <div className="settings-container__column">
        <span>
          Top inferred values used:{' '}
          <strong>{settingsDraft.topInferredValuesUsed}</strong>
        </span>
        <Slider
          name="topInferredValuesUsed"
          onChange={handleOnChange}
          value={settingsDraft.topInferredValuesUsed}
          min={1}
          max={10}
          step={1}
          marks
        />
      </div>
      <hr />
      <div className="settings-container__row">
        <span>Manual answer resolution</span>
        <Switch
          name="allowManualAnswerReview"
          checked={settingsDraft.allowManualAnswerReview}
          onChange={handleOnChange}
          disabled
        />
      </div>
      <div className="settings-container__row">
        <span>Hide meanings by default:</span>
        <Switch
          name="hideMeaningsByDefault"
          checked={settingsDraft.hideMeaningsByDefault}
          onChange={handleOnChange}
        />
      </div>
      <div className="settings-container__row">
        <span>Hide readings by default:</span>
        <Switch
          name="hideReadingsByDefault"
          checked={settingsDraft.hideReadingsByDefault}
          onChange={handleOnChange}
        />
      </div>
      <div className="settings-container__row">
        <span>Should shuffle review:</span>
        <Switch
          name="shouldShuffleReview"
          checked={settingsDraft.shouldShuffleReview}
          onChange={handleOnChange}
        />
      </div>
      <div className="settings-container__row">
        <span>Lite mode:</span>
        <Switch
          name="liteMode"
          checked={settingsDraft.liteMode}
          onChange={handleOnChange}
        />
      </div>
      <Button
        variant="contained"
        onClick={handleOnSettingsUpdate}
        disabled={isEqual(settings, settingsDraft)}
      >
        Save
      </Button>
    </div>
  );
};
