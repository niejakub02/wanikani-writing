import { useAppSelector } from '@app/store';
import { useSubjectQuery } from '@app/waniKaniApi';
import { LoaderWrapper } from '@HOC/LoaderWrapper/LoaderWrapper';
import { IconButton } from '@mui/material';
import { FC, useState } from 'react';
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

  return (
    <LoaderWrapper isLoading={isFetching || !id}>
      <div className="subject-details">
        <div className="subject-details__meanings">
          <div className="clamp clamp--tight">
            <h2>Meanings</h2>
            <IconButton onClick={() => setHideMeanings((prev) => !prev)}>
              {hideMeanings ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </IconButton>
          </div>
          <span className={`details ${hideMeanings ? 'details--hidden' : ''}`}>
            {subject?.data.meanings.map(({ meaning }) => meaning).join(', ')}
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
          <span className={`details ${hideReadings ? 'details--hidden' : ''}`}>
            {subject?.data.readings
              .map(({ reading, type }) => `${reading} (${type})`)
              .join(', ')}
          </span>
        </div>
      </div>
    </LoaderWrapper>
  );
};
