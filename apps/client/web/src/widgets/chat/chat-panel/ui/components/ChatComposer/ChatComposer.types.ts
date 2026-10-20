import type { ClipboardEvent } from 'react';

export type ChatComposerProps = {
  isUploading: boolean;
  onAttach: () => void;
  onPaste: (event: ClipboardEvent) => void;
  onSend: (value: string) => Promise<void>;
};
