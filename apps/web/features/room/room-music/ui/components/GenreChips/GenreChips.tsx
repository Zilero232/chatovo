'use client';

import { useTranslations } from 'next-intl';

import type { GenreChipsProps } from './GenreChips.types';

import { RADIO_GENRES } from '../../../config/music';

import s from './GenreChips.module.scss';

export const GenreChips = ({ onPick }: GenreChipsProps) => {
  const t = useTranslations('room.music.genres');

  return (
    <section className={s.root}>
      <h3 className={s.heading}>{t('title')}</h3>

      <ul className={s.list}>
        {RADIO_GENRES.map((genre) => (
          <li key={genre.id}>
            <button className={s.chip} type='button' onClick={() => onPick(genre)}>
              {t(`items.${genre.id}`)}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};
