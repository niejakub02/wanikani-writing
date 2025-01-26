import { CircularProgress } from '@mui/material';
import { FC, useEffect, useState } from 'react';

interface ProgressProps {
  onFinish: () => void;
  startCondition?: boolean;
  resetOnChangeOf?: unknown;
}

export const Progress: FC<ProgressProps> = ({
  onFinish,
  startCondition,
  resetOnChangeOf,
}) => {
  const [progress, setProgress] = useState(0);
  const [isAnimationForward, setIsAnimationForward] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setProgress(0);
      setIsAnimationForward(false);
    }, 200);
  }, [resetOnChangeOf]);

  return (
    <CircularProgress
      value={progress}
      variant="determinate"
      className="progress"
      size={64}
      thickness={6}
      onMouseEnter={() => {
        console.log('mouseenter');
        if (!startCondition) return;
        setProgress(100);
        setIsAnimationForward(true);
      }}
      onMouseLeave={() => {
        if (!startCondition) return;
        setProgress(0);
        setIsAnimationForward(false);
      }}
      onTransitionEnd={(e) => {
        if (e.propertyName === 'stroke-dashoffset' && isAnimationForward)
          onFinish();
      }}
      onMouseDown={() => {
        console.log('mousedown');
        setProgress(100);
        setIsAnimationForward(true);
      }}
    />
  );
};
