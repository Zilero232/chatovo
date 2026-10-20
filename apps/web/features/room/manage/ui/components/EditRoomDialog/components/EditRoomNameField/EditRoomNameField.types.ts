import type { UpdateRoomRequest } from '@chatovo/schemas';
import type { UseFormRegister } from 'react-hook-form';

export type EditRoomNameFieldProps = {
  register: UseFormRegister<UpdateRoomRequest>;
  value: string;
  error?: string;
};
