import type { ReactNode } from 'react';

export type CreateRoomFormProps = {
  hint?: ReactNode;
  onCreated?: () => void;
};
