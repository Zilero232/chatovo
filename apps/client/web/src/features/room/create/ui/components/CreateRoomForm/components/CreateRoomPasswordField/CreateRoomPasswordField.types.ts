import type { CreateRoomRequest } from '@chatovo/schemas';
import type { UseFormRegister } from 'react-hook-form';

export type CreateRoomPasswordFieldProps = {
  isPrivate: boolean;
  register: UseFormRegister<CreateRoomRequest>;
  error?: string;
};
