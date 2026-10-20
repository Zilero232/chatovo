import type { AriaAttributes } from 'react';

export type FilePickerProps = Pick<AriaAttributes, 'aria-describedby'> & {
  accept?: string;
  className?: string;
  file?: File;
  id?: string;
  placeholder?: string;
  onSelect: (file: File | undefined) => void;
};
