'use client';

import { CircleAlert, Clock3 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import type { MessageStatusProps } from './MessageStatus.types';

import { useChatMessage } from '../../../../../model/contexts';

import s from './MessageStatus.module.scss';

export const MessageStatus = ({ status }: MessageStatusProps) => {
  const t = useTranslations('chat');
  const { retry, discard } = useChatMessage();

  return match(status)
    .with('sending', () => (
      <span className={s.root}>
        <Clock3 className={s.icon} />
        {t('sending')}
      </span>
    ))
    .with('failed', () => (
      <span data-failed className={s.root}>
        <CircleAlert className={s.icon} />
        {t('sendFailed')}

        <button className={s.action} type='button' onClick={retry}>
          {t('retry')}
        </button>

        <button className={s.action} type='button' onClick={discard}>
          {t('discard')}
        </button>
      </span>
    ))
    .exhaustive();
};
