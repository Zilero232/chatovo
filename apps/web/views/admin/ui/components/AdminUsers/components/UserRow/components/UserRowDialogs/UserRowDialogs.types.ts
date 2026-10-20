import type { AdminUser } from '@chatovo/schemas';

export type UserRowDialogsProps = {
  isBlockOpen: boolean;
  isDetailsOpen: boolean;
  isEditOpen: boolean;
  user: AdminUser;
  onBlockOpenChange: (open: boolean) => void;
  onDetailsOpenChange: (open: boolean) => void;
  onEditOpenChange: (open: boolean) => void;
};
