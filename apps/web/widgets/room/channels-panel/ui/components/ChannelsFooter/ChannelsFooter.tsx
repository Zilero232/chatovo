'use client';

import { useTranslations } from 'next-intl';

import { useCurrentUser, UserAvatar, UserName } from '@/entities/auth/user';
import { ReportProblemButton } from '@/features/app/report-problem';
import { AppSettingsButton } from '@/widgets/app/app-settings';

import s from './ChannelsFooter.module.scss';

export const ChannelsFooter = () => {
  const t = useTranslations('channels');
  const { avatarUrl, developer, displayName, verified } = useCurrentUser();

  return (
    <div className={s.root}>
      <UserAvatar
        className={s.avatar}
        fallbackClassName={s.fallback}
        name={displayName}
        src={avatarUrl}
      />
      <div className={s.info}>
        <UserName className={s.name} developer={developer} name={displayName} verified={verified} />
        <span className={s.status}>
          <span className={s.dot}>
            <span className={s.dotPing} />
            <span className={s.dotCore} />
          </span>
          {t('online')}
        </span>
      </div>

      <div className={s.actions}>
        {' '}
        <ReportProblemButton />
        <AppSettingsButton />
      </div>
    </div>
  );
};
