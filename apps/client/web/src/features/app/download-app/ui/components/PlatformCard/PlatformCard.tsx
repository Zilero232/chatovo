import { clsx } from 'clsx';
import { useTranslations } from 'use-intl';

import type { PlatformCardProps } from './PlatformCard.types';

import s from './PlatformCard.module.scss';

export const PlatformCard = ({ Icon, label, link }: PlatformCardProps) => {
  const t = useTranslations('downloadApp');

  if (!link) {
    return (
      <div className={clsx(s.root, s.unavailable)}>
        <span aria-hidden className={s.iconBox}>
          <Icon className={s.icon} />
        </span>

        <span className={s.name}>{label}</span>
        <span className={s.unavailableLabel}>{t('notAvailable')}</span>
      </div>
    );
  }

  const { actionLabel, caption, download, href, ActionIcon } = link;

  return (
    <a
      className={clsx(s.root, s.available)}
      download={download}
      href={href}
      rel='noopener noreferrer'
      target='_blank'
    >
      <span aria-hidden className={s.iconBox}>
        <Icon className={s.icon} />
      </span>

      <span className={s.meta}>
        <span className={s.name}>{label}</span>
        <span className={s.caption}>{caption}</span>
      </span>

      <span aria-hidden className={s.action}>
        <ActionIcon className={s.actionIcon} />
        {actionLabel}
      </span>
    </a>
  );
};
