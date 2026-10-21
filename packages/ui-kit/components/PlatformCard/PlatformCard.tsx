import { clsx } from 'clsx';

import type { PlatformCardProps } from './PlatformCard.types';

import s from './PlatformCard.module.scss';

export const PlatformCard = ({ Icon, label, unavailableLabel, link }: PlatformCardProps) => {
  if (!link) {
    return (
      <div className={clsx(s.root, s.unavailable)}>
        <span aria-hidden className={s.iconBox}>
          <Icon className={s.icon} />
        </span>

        <span className={s.name}>{label}</span>
        <span className={s.unavailableLabel}>{unavailableLabel}</span>
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
