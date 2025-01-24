import { CircularProgress, Skeleton } from '@mui/material';
import { ComponentProps, FC, ReactNode } from 'react';
import './LoaderWrapper.scss';
interface LoaderWrapperProps extends ComponentProps<typeof CircularProgress> {
  isLoading: boolean;
  children: ReactNode;
  flexyContainer?: boolean;
  type?: 'CircularProgress' | 'Skeleton';
}

const defaultLoaderSettings: ComponentProps<typeof CircularProgress> = {
  size: 24,
  thickness: 6,
};

export const LoaderWrapper: FC<LoaderWrapperProps> = ({
  isLoading,
  children,
  flexyContainer = true,
  type = 'Skeleton',
  ...rest
}) => {
  return isLoading ? (
    <div
      className={`loader-wrapper ${
        flexyContainer ? 'loader-wrapper--flexy' : ''
      }`}
    >
      {type === 'Skeleton' ? (
        <Skeleton width="100%" />
      ) : (
        <CircularProgress {...defaultLoaderSettings} {...rest} />
      )}
    </div>
  ) : (
    children
  );
};
