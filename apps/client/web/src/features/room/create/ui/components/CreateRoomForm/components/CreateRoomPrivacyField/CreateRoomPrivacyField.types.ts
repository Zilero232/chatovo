import type { CreateRoomRequest } from '@chatovo/schemas';
import type { Control } from 'react-hook-form';

export type CreateRoomPrivacyFieldProps = {
  control: Control<CreateRoomRequest>;
  isPrivate: boolean;
};
