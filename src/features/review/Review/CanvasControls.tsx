import { useAppDispatch, useAppSelector } from '@app/store';
import {
  useReviewSubjectsQuery,
  useSubjectQuery,
  waniKaniApi,
} from '@app/waniKaniApi';
import useCanvasControlContext from '@context/CanvasContext';
import useModelContext from '@context/ModelContext';
import { convertCanvasToTensor } from '@utils/canvasUtils';
import { FC } from 'react';
import { previousSubject, setPredictions, updateAnswer } from '../reviewSlice';
import { navigate } from '@features/globalSlice';
import { Button } from '@mui/material';
import { useReviewContext } from './Review';

export const CanvasControls: FC = () => {
  const { setIsCorrectAnswer, setShowOverlay, subjectId, assignmentId } =
    useReviewContext();
  const { getCompoundImage, reset, undo } = useCanvasControlContext();
  const { subjectIndex } = useAppSelector((state) => state.review);
  const { settings } = useAppSelector((state) => state.global);
  const { predict } = useModelContext();
  const dispatch = useAppDispatch();
  const {
    data: reviewSubjects,
    isSuccess,
    isFetching,
  } = useReviewSubjectsQuery();

  const { data: subject } = useSubjectQuery(subjectId!, {
    skip: !isSuccess || isFetching || !subjectId,
  });

  const predictFromImage = async () => {
    const canvas = getCompoundImage(true, true);
    if (!canvas) return;

    const tensor = convertCanvasToTensor(canvas);
    if (!tensor) return;

    const predictions = await predict(tensor);
    if (!assignmentId || !predictions || !reviewSubjects?.data) return;

    const acceptablePredicitons = predictions
      ?.filter((_, i) => i < settings.topInferredValuesUsed)
      .map((prediciton) => prediciton.literal);

    if (
      subject?.data &&
      acceptablePredicitons?.includes(subject.data.characters)
    ) {
      if (!settings.allowManualAnswerReview) {
        dispatch(updateAnswer({ id: assignmentId, isCorrect: true }));
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
      }

      setIsCorrectAnswer(true);

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
    } else {
      dispatch(updateAnswer({ id: assignmentId, isCorrect: false }));
      setIsCorrectAnswer(false);
    }
    dispatch(setPredictions(predictions));
    setShowOverlay(true);
    if (!settings.allowManualAnswerReview) {
      setTimeout(() => setShowOverlay(false), 800);
    }
  };

  return (
    <div className="canvas-controls">
      <Button variant="text" onClick={reset}>
        Clear
      </Button>
      <Button variant="contained" onClick={predictFromImage}>
        Check
      </Button>
      <Button variant="text" onClick={undo}>
        Undo
      </Button>
    </div>
  );
};