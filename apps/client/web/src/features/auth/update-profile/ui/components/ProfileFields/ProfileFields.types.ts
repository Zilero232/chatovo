import type { Control, FieldErrors, UseFormRegister } from 'react-hook-form';

import type { ProfileValues } from '@/entities/auth/user';

export type ProfileFieldsProps = {
  control: Control<ProfileValues>;
  errors: FieldErrors<ProfileValues>;
  register: UseFormRegister<ProfileValues>;
};
