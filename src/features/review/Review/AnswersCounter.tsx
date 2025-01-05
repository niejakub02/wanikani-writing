import { useAppSelector } from '@app/store';
import { useReviewSubjectsQuery } from '@app/waniKaniApi';
import { FC } from 'react';

export const AnswersCounter: FC = () => {
  const { data: reviewSubjects } = useReviewSubjectsQuery();
  const { providedAnswers } = useAppSelector((state) => state.review);
  const correctAnswers =
    Object.values(providedAnswers).filter((answer) => !!answer).length ?? 0;

  return (
    <div className="answers-counter">
      <span>{correctAnswers}</span>
      <span>/</span>
      <span>{correctAnswers + (reviewSubjects?.data.length ?? 0)}</span>
    </div>
  );
};
