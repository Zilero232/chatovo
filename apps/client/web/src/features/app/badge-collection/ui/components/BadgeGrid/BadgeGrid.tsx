import { clsx } from 'clsx';
import { useTranslations } from 'use-intl';

import { BadgeIcon } from '@/entities/app/badges';

import type { BadgeGridProps } from './BadgeGrid.types';

import s from '../../BadgeCollection.module.scss';

export const BadgeGrid = ({ title, badges, selectedId, onSelect }: BadgeGridProps) => {
  const t = useTranslations('badges');

  return (
    <section className={s.group}>
      <h3 className={s.groupTitle}>{title}</h3>

      <div className={s.grid}>
        {badges.map(({ id, tier }) => (
          <button
            key={id}
            aria-pressed={id === selectedId}
            className={clsx(s.cell, { [s.cellSelected]: id === selectedId })}
            type='button'
            onClick={() => onSelect(id)}
          >
            <BadgeIcon id={id} tier={tier} />
            <span className={s.cellName}>{t(`items.${id}.name`)}</span>
          </button>
        ))}
      </div>
    </section>
  );
};
