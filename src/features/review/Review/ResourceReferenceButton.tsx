import { IconButton } from '@mui/material';
import ReplyIcon from '@mui/icons-material/Reply';
import { FC } from 'react';
import { useSubjectQuery } from '@app/waniKaniApi';

interface ResourceReferenceButtonProps {
  id?: number;
}

export const ResourceReferenceButton: FC<ResourceReferenceButtonProps> = ({
  id,
}) => {
  const { data: subject } = useSubjectQuery(id!, {
    skip: !id,
  });
  const isButtonDisabled = !!id && !!subject;

  const handleOnClick = () => {
    const element = document.createElement('a');
    element.href = subject!.data.document_url;
    element.target = '_blank';
    element.click();
  };

  return (
    <IconButton
      onClick={handleOnClick}
      disabled={isButtonDisabled}
      className="reference-button"
    >
      <ReplyIcon />
    </IconButton>
  );
};
