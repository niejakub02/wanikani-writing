import { useAppDispatch, useAppSelector } from '@app/store';
import { useReviewSubjectsQuery, useSubjectQuery } from '@app/waniKaniApi';
import { Canvas } from '@components/Canvas';
import useCanvasControlContext from '@context/CanvasContext';
import { createContext, FC, useContext, useState } from 'react';
import { nextSubject, previousSubject } from '../reviewSlice';
import './Review.scss';
import { SubjectDetails } from './SubjectDetails';
import { AnswersCounter } from './AnswersCounter';
import { ResourceReferenceButton } from './ResourceReferenceButton';
import { CanvasControls } from './CanvasControls';
import { Button } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { Overlay } from './Overlay';

interface ReviewContext {
  showOverlay: boolean;
  setShowOverlay: (value: boolean) => void;
  isCorrectAnswer: boolean;
  setIsCorrectAnswer: (value: boolean) => void;
  subjectId: number | undefined;
  assignmentId: number | undefined;
}

const reviewContext = createContext<ReviewContext>({} as ReviewContext);

export const useReviewContext = () => useContext(reviewContext);

export const Review: FC = () => {
  const [showOverlay, setShowOverlay] = useState(false);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);
  const { ref, reset } = useCanvasControlContext();
  const { subjectIndex } = useAppSelector((state) => state.review);
  const dispatch = useAppDispatch();
  const { data: reviewSubjects, isFetching: isFetchingReviewSubjects } =
    useReviewSubjectsQuery();
  const subjectId = reviewSubjects?.data?.[subjectIndex]?.data?.subject_id;
  const { isFetching: isFetchingSubject } = useSubjectQuery(subjectId!, {
    skip: !subjectId,
  });
  const [key, setKey] = useState(0);
  const assignmentId = reviewSubjects?.data?.[subjectIndex]?.id;

  const handleOnPreviousSubject = () => {
    if (subjectIndex > 0) {
      dispatch(previousSubject());
      setKey((prev) => prev + 1);
      reset();
    }
  };

  const handleOnNextSubject = () => {
    if (reviewSubjects && subjectIndex < reviewSubjects.data.length - 1) {
      dispatch(nextSubject());
      setKey((prev) => prev + 1);
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
      }}
    >
      <div
        className="review-container"
        data-show-overlay={showOverlay ? '' : undefined}
        data-is-correct-answer={isCorrectAnswer ? '' : undefined}
      >
        <Overlay />
        <div className="details-container">
          <div
            className="details-container__header"
            data-disabled={
              isFetchingReviewSubjects || isFetchingSubject ? '' : undefined
            }
          >
            <span className="current-subject-index">{subjectId ?? '000'}</span>
            <AnswersCounter />
            <ResourceReferenceButton id={subjectId} />
          </div>
          <SubjectDetails id={subjectId} key={key} />
        </div>
        <Canvas ref={ref} />
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
