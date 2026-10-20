import { Button, CenteredState } from '@chatovo/ui-kit';
import { useNavigate } from '@tanstack/react-router';
import { DoorClosed } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { ROUTES } from '@/shared/constants';

import s from './RoomNotFound.module.scss';

export const RoomNotFound = () => {
  const t = useTranslations('room');
  const navigate = useNavigate();

  return (
    <CenteredState
      action={
        <Button onClick={() => navigate({ to: ROUTES.lobby, replace: true })}>
          {t('backToLobby')}
        </Button>
      }
      description={t('notFoundHint')}
      icon={<DoorClosed className={s.icon} />}
      pattern='waves'
      title={t('notFound')}
    />
  );
};
