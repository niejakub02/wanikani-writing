import { useAppDispatch, useAppSelector } from '@app/store';
import {
  useReviewSubjectsQuery,
  useSubjectQuery,
  waniKaniApi,
} from '@app/waniKaniApi';
import { Canvas } from '@components/Canvas';
import useCanvasControlContext from '@context/CanvasContext';
import { createContext, FC, useContext, useState } from 'react';
import { nextSubject, previousSubject, updateAnswer } from '../reviewSlice';
import './Review.scss';
import { SubjectDetails } from './SubjectDetails';
import { AnswersCounter } from './AnswersCounter';
import { ResourceReferenceButton } from './ResourceReferenceButton';
import { CanvasControls } from './CanvasControls';
import { Button } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { Overlay } from './Overlay';
import { Progress } from './Progress';
import { setAttribute } from '@utils/dom';
import { navigate } from '@features/globalSlice';

interface ReviewContext {
  showOverlay: boolean;
  setShowOverlay: (value: boolean) => void;
  isCorrectAnswer: boolean;
  setIsCorrectAnswer: (value: boolean) => void;
  subjectId: number | undefined;
  assignmentId: number | undefined;
  pauseAutoActions: boolean;
  setPauseAutoActions: (value: boolean) => void;
}

const reviewContext = createContext<ReviewContext>({} as ReviewContext);

export const useReviewContext = () => useContext(reviewContext);

export const Review: FC = () => {
  const [showOverlay, setShowOverlay] = useState(false);
  const [pauseAutoActions, setPauseAutoActions] = useState(false);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);
  const { ref, reset } = useCanvasControlContext();
  const { subjectIndex, predictions } = useAppSelector((state) => state.review);
  const { settings } = useAppSelector((state) => state.global);
  const dispatch = useAppDispatch();
  const { data: reviewSubjects, isFetching: isFetchingReviewSubjects } =
    useReviewSubjectsQuery();
  const subjectId = reviewSubjects?.data?.[subjectIndex]?.data?.subject_id;
  const { isFetching: isFetchingSubject } = useSubjectQuery(subjectId!, {
    skip: !subjectId,
  });
  const assignmentId = reviewSubjects?.data?.[subjectIndex]?.id;

  const handleOnPreviousSubject = () => {
    if (subjectIndex > 0) {
      dispatch(previousSubject());
      reset();
    }
  };

  const handleOnNextSubject = () => {
    if (reviewSubjects && subjectIndex < reviewSubjects.data.length - 1) {
      dispatch(nextSubject());
      reset();
    }
  };

  return (
    <reviewContext.Provider
      value={{
        showOverlay,
        setShowOverlay,
        isCorrectAnswer,
        setIsCorrectAnswer,
        assignmentId,
        subjectId,
        pauseAutoActions,
        setPauseAutoActions,
      }}
    >
      <div
        className="review-container"
        data-show-overlay={setAttribute(showOverlay)}
        data-is-correct-answer={setAttribute(isCorrectAnswer)}
        data-pause-auto-actions={setAttribute(pauseAutoActions)}
        onMouseDown={() => {
          if (!showOverlay || !isCorrectAnswer) return;
          setPauseAutoActions(true);
        }}
        onMouseUp={() => {
          setPauseAutoActions(false);
          if (!showOverlay || !assignmentId) return;
          setTimeout(() => {
            setShowOverlay(false);
            reset();

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
          }, 400);
        }}
      >
        <Overlay />
        <div className="details-container">
          <div
            className="details-container__header"
            data-disabled={setAttribute(
              isFetchingReviewSubjects || isFetchingSubject
            )}
          >
            <span className="current-subject-index">{subjectId ?? '000'}</span>
            <AnswersCounter />
            <div>
              <ResourceReferenceButton id={subjectId} />
            </div>
          </div>
          <SubjectDetails id={subjectId} />
        </div>
        <div className="canvas-wrapper">
          {!settings.allowManualAnswerReview && (
            <div className="canvas-wrapper__overlay">
              <span>{isCorrectAnswer ? predictions[0]?.literal : ''}</span>
              {isCorrectAnswer && (
                <Progress
                  startCondition={pauseAutoActions}
                  resetOnChangeOf={showOverlay}
                  onFinish={() => {
                    setShowOverlay(false);
                    setPauseAutoActions(false);
                    console.warn(
                      'user marked this kanji as self written incorrectly'
                    );
                  }}
                />
              )}
            </div>
          )}
          <Canvas ref={ref} />
        </div>
        <CanvasControls />
        <div>
          <Button
            onClick={handleOnPreviousSubject}
            startIcon={<NavigateBeforeIcon />}
          >
            Previous
          </Button>
          <Button onClick={handleOnNextSubject} endIcon={<NavigateNextIcon />}>
            Next
          </Button>
        </div>
      </div>
    </reviewContext.Provider>
  );
};
