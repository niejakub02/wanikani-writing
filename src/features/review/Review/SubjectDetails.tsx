import { useSubjectQuery } from '@app/waniKaniApi';
import { LoaderWrapper } from '@HOC/LoaderWrapper/LoaderWrapper';
import { FC } from 'react';

interface SubjectDetailsProps {
  id?: number;
}

export const SubjectDetails: FC<SubjectDetailsProps> = ({ id }) => {
  const { data: subject, isFetching } = useSubjectQuery(id!, {
    skip: !id,
  });

  return (
    <LoaderWrapper isLoading={isFetching || !id}>
      <div className="subject-details">
        <div className="subject-details__meanings">
          <h2>Meanings</h2>
          <span>
            {subject?.data.meanings.map(({ meaning }) => meaning).join(', ')}
          </span>
        </div>
        <hr />
        <div className="subject-details__readings">
          <h2>Readings</h2>
          <span>
            {subject?.data.readings
              .map(({ reading, type }) => `${reading} (${type})`)
              .join(', ')}
          </span>
        </div>
      </div>
    </LoaderWrapper>
  );
};
