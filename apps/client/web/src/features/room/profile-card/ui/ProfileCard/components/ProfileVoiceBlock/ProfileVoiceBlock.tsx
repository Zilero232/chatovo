import { Button, Spinner } from '@chatovo/ui-kit';
import { isNonNullish } from 'remeda';
import { match, P } from 'ts-pattern';
import { useTranslations } from 'use-intl';

import { useCurrentUser } from '@/entities/auth/user';
import { useEnterRoom } from '@/entities/room/room';
import { appEvents } from '@/shared/lib';

import type { ProfileVoiceBlockProps } from './ProfileVoiceBlock.types';

import { useParticipantRoom } from '../../../../model/hooks';

import s from './ProfileVoiceBlock.module.scss';

export const ProfileVoiceBlock = ({ identity, isSelf }: ProfileVoiceBlockProps) => {
  const t = useTranslations('profileCard');

  const { user } = useCurrentUser();

  const { room, isLoading } = useParticipantRoom(identity);
  const { room: myRoom } = useParticipantRoom(user?.id ?? '');
  const { isPending, mutate: enterRoom } = useEnterRoom();

  const inSameRoom = isNonNullish(room) && room.roomId === myRoom?.roomId;

  const join = (roomId: string) => {
    enterRoom({ roomId });
    appEvents.emit.profileCardClose();
  };

  return (
    <div className={s.root}>
      {match({ isLoading, isSelf, room, inSameRoom })
        .with({ isLoading: true }, () => (
          <span className={s.label}>
            <Spinner size='xs' />
          </span>
        ))
        .with({ isSelf: true }, () => (
          <>
            <span className={s.label}>{room ? t('inVoice') : t('notInVoice')}</span>
            {room && <span className={s.room}>{room.roomName}</span>}
            <span className={s.label}>{t('openSettingsHint')}</span>
          </>
        ))
        .with({ room: P.nullish }, () => <span className={s.label}>{t('notInVoice')}</span>)
        .with({ room: P.nonNullable }, ({ room: current, inSameRoom: same }) => (
          <>
            <span className={s.label}>{t('inVoice')}</span>
            <span className={s.room}>{current.roomName}</span>
            {!same && (
              <Button
                className={s.button}
                disabled={isPending}
                size='sm'
                onClick={() => join(current.roomId)}
              >
                {isPending && <Spinner decorative size='xs' />}
                {t('join')}
              </Button>
            )}
          </>
        ))
        .exhaustive()}
    </div>
  );
};
