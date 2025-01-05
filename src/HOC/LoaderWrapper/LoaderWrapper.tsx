import { CircularProgress } from '@mui/material';
import { ComponentProps, FC, ReactNode } from 'react';
import './LoaderWrapper.scss';
interface LoaderWrapperProps extends ComponentProps<typeof CircularProgress> {
  isLoading: boolean;
  children: ReactNode;
  flexyContainer?: boolean;
}

const defaultLoaderSettings: ComponentProps<typeof CircularProgress> = {
  size: 24,
  thickness: 6,
};

export const LoaderWrapper: FC<LoaderWrapperProps> = ({
  isLoading,
  children,
  flexyContainer = true,
  ...rest
}) => {
  return isLoading ? (
    <div
      className={`loader-wrapper ${
        flexyContainer ? 'loader-wrapper--flexy' : ''
      }`}
    >
      <CircularProgress {...defaultLoaderSettings} {...rest} />
    </div>
  ) : (
    children
  );
};
