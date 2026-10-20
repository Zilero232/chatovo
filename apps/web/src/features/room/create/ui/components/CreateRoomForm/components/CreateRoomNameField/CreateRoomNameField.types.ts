import type { CreateRoomRequest } from '@chatovo/schemas';
import type { UseFormRegister } from 'react-hook-form';

export type CreateRoomNameFieldProps = {
  register: UseFormRegister<CreateRoomRequest>;
  value: string;
  error?: string;
};
