import { Play, Radio } from 'lucide-react';
import { useTranslations } from 'use-intl';

import type { StationResultsProps } from './StationResults.types';

import { describeStation } from '../../../lib/index';

import s from './StationResults.module.scss';

export const StationResults = ({
  isError,
  isPopular = false,
  isSearching,
  stations,
  onPlay
}: StationResultsProps) => {
  const t = useTranslations('room.music.radio');

  const isEmpty = !isSearching && !isError && stations.length === 0;

  return (
    <section aria-busy={isSearching} className={s.root}>
      <h3 className={s.heading}>{t(isPopular ? 'popular' : 'label')}</h3>

      {isError && <p className={s.error}>{t('error')}</p>}
      {isEmpty && <p className={s.note}>{t('empty')}</p>}

      <ul className={s.list}>
        {stations.map((station) => (
          <li key={station.id}>
            <button
              aria-label={t('play', { name: station.name })}
              className={s.station}
              type='button'
              onClick={() => onPlay(station)}
            >
              <span aria-hidden className={s.icon}>
                <Radio />
              </span>
              <span className={s.meta}>
                <span className={s.name}>{station.name}</span>
                <span className={s.details}>{describeStation(station)}</span>
              </span>
              <Play aria-hidden className={s.play} />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};
