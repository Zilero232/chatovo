import type { AdminUser } from '@chatovo/schemas';

export type EditUserDialogProps = {
  user: AdminUser;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};
