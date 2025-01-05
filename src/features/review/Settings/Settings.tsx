import { useAppDispatch, useAppSelector } from '@app/store';
import {
  initalizeSettings,
  navigate,
  Settings as SettingsType,
} from '@features/globalSlice';
import { Button, Slider, Switch, TextField } from '@mui/material';
import { ChangeEvent, useState } from 'react';
import './Settings.scss';
import { useReviewSubjectsQuery } from '@app/waniKaniApi';
import { clearAnswers } from '../reviewSlice';
import { isEqual } from 'lodash';

export const Settings = () => {
  const { settings } = useAppSelector((state) => state.global);
  const [settingsDraft, setSettingsDraft] = useState<SettingsType>(settings);
  const { refetch } = useReviewSubjectsQuery();
  const dispatch = useAppDispatch();

  const handleOnChange = (e: ChangeEvent | Event) => {
    const target = e.target as HTMLInputElement;
    if (target.name === 'allowManualAnswerReview') {
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
