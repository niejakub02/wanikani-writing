import { useAppSelector } from '@app/store';
import { useSubjectQuery } from '@app/waniKaniApi';
import { IconButton, Skeleton } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

interface SubjectDetailsProps {
  id?: number;
}

export const SubjectDetails: FC<SubjectDetailsProps> = ({ id }) => {
  const { settings } = useAppSelector((state) => state.global);
  const [hideMeanings, setHideMeanings] = useState<boolean>(
    settings.hideMeaningsByDefault
  );
  const [hideReadings, setHideReadings] = useState<boolean>(
    settings.hideReadingsByDefault
  );
  const { data: subject, isFetching } = useSubjectQuery(id!, {
    skip: !id,
  });

  useEffect(() => {
    setHideMeanings(settings.hideMeaningsByDefault);
    setHideReadings(settings.hideReadingsByDefault);
  }, [id, settings.hideMeaningsByDefault, settings.hideReadingsByDefault]);

  return (
    <div className="subject-details">
      <div className="subject-details__meanings">
        <div className="clamp clamp--tight">
          <h2>Meanings</h2>
          <IconButton onClick={() => setHideMeanings((prev) => !prev)}>
            {hideMeanings ? <VisibilityOffIcon /> : <VisibilityIcon />}
          </IconButton>
        </div>
        <span
          className={`details ${
            hideMeanings && !isFetching ? 'details--hidden' : ''
          }`}
        >
          {isFetching ? (
            <Skeleton />
          ) : (
            subject?.data.meanings.map(({ meaning }) => meaning).join(', ')
          )}
        </span>
      </div>
      <hr />
      <div className="subject-details__readings">
        <div className="clamp clamp--tight">
          <h2>Readings</h2>
          <IconButton onClick={() => setHideReadings((prev) => !prev)}>
            {hideReadings ? <VisibilityOffIcon /> : <VisibilityIcon />}
          </IconButton>
        </div>
        <span
          className={`details ${
            hideReadings && !isFetching ? 'details--hidden' : ''
          }`}
        >
          {isFetching ? (
            <Skeleton />
          ) : (
            subject?.data.readings
              .map(({ reading, type }) => `${reading} (${type})`)
              .join(', ')
          )}
        </span>
      </div>
    </div>
  );
};
