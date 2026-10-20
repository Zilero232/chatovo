import type { UpdateRoomRequest } from '@chatovo/schemas';
import type { Control } from 'react-hook-form';

export type EditRoomPrivacyFieldProps = {
  control: Control<UpdateRoomRequest>;
  isPrivate: boolean;
};
