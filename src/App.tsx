import { FC } from 'react';
import './App.scss';
import { useReviewSubjectsQuery } from '@app/waniKaniApi';
import { useAppDispatch, useAppSelector } from '@app/store';
import { navigate } from '@features/globalSlice';
import { Review } from '@features/review/Review/Review';
import { Button } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { clearAnswers } from '@features/review/reviewSlice';
import HomeIcon from '@mui/icons-material/Home';
import DrawIcon from '@mui/icons-material/Draw';
import SettingsIcon from '@mui/icons-material/Settings';
import { LoaderWrapper } from '@HOC/LoaderWrapper/LoaderWrapper';
import { useSettings } from '@hooks/useSettings';
import { Settings } from '@features/review/Settings/Settings';

const App: FC = () => {
  const { step } = useAppSelector((state) => state.global);
  const {
    data: reviewSubjects,
    refetch,
    isFetching,
    isError,
  } = useReviewSubjectsQuery();
  const dispatch = useAppDispatch();
  const buttonsDisabled = isFetching || isError;
  useSettings();

  const handleOnRefresh = () => {
    refetch();
    dispatch(clearAnswers());
  };

  const handleOnNavigateHome = () => dispatch(navigate('home'));
  const handleOnNavigateReview = () => dispatch(navigate('review'));
  const handleOnNavigateSettings = () => dispatch(navigate('settings'));

  return (
    <div className="main-frame">
      {step === 'home' && (
        <div className="main-frame__controls">
          <LoaderWrapper isLoading={isFetching} flexyContainer={false}>
            {isError ? (
              <span className="welcome-info">
                It seems something went wrong while fetching WaniKani resources.
                Please check your settings and try again.
              </span>
            ) : (
              <span className="welcome-info">
                You have <strong>{reviewSubjects?.data.length ?? 0}</strong>{' '}
                elements to study from WaniKani!
              </span>
            )}
          </LoaderWrapper>
          <div className="clamp">
            <Button
              onClick={handleOnNavigateReview}
              disabled={reviewSubjects?.data.length === 0 || buttonsDisabled}
              variant="contained"
              startIcon={<DrawIcon />}
            >
              Start
            </Button>
          </div>
          <Button
            onClick={handleOnRefresh}
            startIcon={<RefreshIcon />}
            disabled={buttonsDisabled}
          >
            Refresh review
          </Button>
          <Button
            onClick={handleOnNavigateSettings}
            startIcon={<SettingsIcon />}
          >
            Settings
          </Button>
        </div>
      )}

      {step === 'review' && (
        <div className="main-frame__review">
          <Review />
          <Button
            onClick={handleOnNavigateHome}
            variant="outlined"
            startIcon={<HomeIcon />}
          >
            Home
          </Button>
        </div>
      )}

      {step === 'settings' && (
        <div className="main-frame__settings">
          <Settings />
          <Button
            onClick={handleOnNavigateHome}
            variant="outlined"
            startIcon={<HomeIcon />}
          >
            Home
          </Button>
        </div>
      )}
    </div>
  );
};

export default App;
