import type { AdminUser } from '@chatovo/schemas';

export type BlockUserDialogProps = {
  user: AdminUser;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};
