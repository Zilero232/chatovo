import type { AdminUser, UpdateAdminUserValues } from '@chatovo/schemas';
import type { Control } from 'react-hook-form';

export type EditUserAccessFieldsProps = {
  control: Control<UpdateAdminUserValues>;
  user: AdminUser;
};
