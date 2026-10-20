import type { UpdateInfo } from '../../model/types';

export type UpdateDialogProps = Omit<UpdateInfo, 'dismiss' | 'install'> & {
  onInstall: () => void;
  onDismiss: () => void;
};
