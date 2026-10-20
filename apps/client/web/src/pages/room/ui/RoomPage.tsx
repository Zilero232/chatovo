import { match, P } from 'ts-pattern';

import { useErrorMessage } from '@/entities/app/locale';

import { useRoomPage } from '../model/hooks';
import { RoomConnecting, RoomLoadingFallback, RoomNotFound, RoomPasswordForm } from './components';

export const RoomPage = () => {
  const errorMessage = useErrorMessage();

  const {
    isLoading,
    isSessionOpen,
    passwordError,
    room,
    roomId,
    roomTitle,
    showPasswordForm,
    submitPassword,
    tokenFetching
  } = useRoomPage();

  return match({ roomId, isLoading, room, isSessionOpen, showPasswordForm })
    .with({ roomId: P.nullish }, () => null)
    .with({ isSessionOpen: true }, () => null)
    .with({ room: P.nullish, isLoading: true }, () => <RoomLoadingFallback />)
    .with({ room: P.nullish }, () => <RoomNotFound />)
    .with({ showPasswordForm: true }, () => (
      <RoomPasswordForm
        displayName={roomTitle}
        error={passwordError ? errorMessage(passwordError) : undefined}
        isSubmitting={tokenFetching}
        onSubmit={submitPassword}
      />
    ))
    .otherwise(() => <RoomConnecting />);
};
