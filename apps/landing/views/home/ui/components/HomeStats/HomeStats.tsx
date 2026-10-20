import { RevealOnScroll } from '@chatovo/ui-kit';
import { getTranslations } from 'next-intl/server';

import type { HomePageProps } from '../../HomePage.types';

import { HOME_STAT_KEYS } from '../../../config';

import s from './HomeStats.module.scss';

export const HomeStats = async ({ locale }: HomePageProps) => {
  const t = await getTranslations({ locale, namespace: 'home.stats.items' });

  return (
    <section className={s.band}>
      <RevealOnScroll>
        <ul className={s.list}>
          {HOME_STAT_KEYS.map((key) => (
            <li key={key} className={s.item}>
              <span className={s.value}>{t(`${key}.value`)}</span>
              <span className={s.label}>{t(`${key}.label`)}</span>
            </li>
          ))}
        </ul>
      </RevealOnScroll>
    </section>
  );
};
