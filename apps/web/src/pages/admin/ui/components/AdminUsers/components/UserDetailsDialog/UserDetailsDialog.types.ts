import type { AdminUser } from '@chatovo/schemas';

export type UserDetailsDialogProps = {
  user: AdminUser;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export type UserPanelProps = {
  userId: string;
  enabled: boolean;
};
