import type { UpdateRoomRequest } from '@chatovo/schemas';
import type { UseFormRegister } from 'react-hook-form';

export type EditRoomPasswordFieldProps = {
  isPrivate: boolean;
  register: UseFormRegister<UpdateRoomRequest>;
  error?: string;
};
