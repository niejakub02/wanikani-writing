import { useAppDispatch, useAppSelector } from '@app/store';
import { Button } from '@mui/material';
import { FC } from 'react';
import { previousSubject, updateAnswer } from '../reviewSlice';
import { useReviewSubjectsQuery, waniKaniApi } from '@app/waniKaniApi';
import useCanvasControlContext from '@context/CanvasContext';
import { useReviewContext } from './Review';
import { navigate } from '@features/globalSlice';

export const Overlay: FC = () => {
  const { isCorrectAnswer, subjectId, assignmentId, setShowOverlay } =
    useReviewContext();
  const { settings } = useAppSelector((state) => state.global);
  const { predictions, subjectIndex } = useAppSelector((state) => state.review);
  const { data: reviewSubjects } = useReviewSubjectsQuery();
  const { reset } = useCanvasControlContext();
  const dispatch = useAppDispatch();

  return (
    <div className="overlay">
      <span className="overlay__indicator">
        {isCorrectAnswer ? '✅ Correct' : '❌ Incorrect'}
      </span>
      {settings.allowManualAnswerReview && (
        <>
          <span>Top inferred values:</span>
          <ul className="overlay__predictions">
            {predictions
              .filter((_, i) => i < settings.topInferredValuesUsed)
              .map(({ literal, value }) => (
                <li key={literal}>{`${literal} - ${(value * 100).toFixed(
                  4
                )}%`}</li>
              ))}
          </ul>
          <span>My answer was:</span>
          <div className="overlay__actions">
            <Button onClick={() => setShowOverlay(false)}>Incorrect</Button>
            <Button
              onClick={() => {
                setShowOverlay(false);
                if (!subjectId || !assignmentId || !reviewSubjects?.data)
                  return;

                // should be a shared function
                dispatch(updateAnswer({ id: subjectId, isCorrect: true }));
                dispatch(
                  waniKaniApi.util.updateQueryData(
                    'reviewSubjects',
                    undefined,
                    (response) => {
                      response.data = response.data.filter(
                        (x) => x.id !== assignmentId
                      );
                    }
                  )
                );
                reset();
                if (
                  subjectIndex === reviewSubjects.data.length - 1 &&
                  reviewSubjects.data.length > 0
                ) {
                  // if last review item, but there are some more
                  dispatch(previousSubject());
                }

                if (reviewSubjects.data.length - 1 === 0) {
                  // endgame
                  dispatch(navigate('home'));
                }
              }}
              variant="contained"
            >
              Correct
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
