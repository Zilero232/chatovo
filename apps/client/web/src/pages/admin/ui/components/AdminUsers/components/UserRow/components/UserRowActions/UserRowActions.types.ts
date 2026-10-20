import type { AdminUser } from '@chatovo/schemas';

export type UserRowActionsProps = {
  user: AdminUser;
  onBlock: () => void;
  onEdit: () => void;
  onShowDetails: () => void;
};
