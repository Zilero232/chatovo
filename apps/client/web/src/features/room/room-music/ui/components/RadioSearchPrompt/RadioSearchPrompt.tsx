import { ArrowRight, Radio } from 'lucide-react';
import { useTranslations } from 'use-intl';

import type { RadioSearchPromptProps } from './RadioSearchPrompt.types';

import s from './RadioSearchPrompt.module.scss';

export const RadioSearchPrompt = ({ query, onSearch }: RadioSearchPromptProps) => {
  const t = useTranslations('room.music.link');

  return (
    <button className={s.root} type='button' onClick={() => onSearch(query)}>
      <span aria-hidden className={s.icon}>
        <Radio />
      </span>
      <span className={s.label}>{t('searchRadio', { query })}</span>
      <ArrowRight aria-hidden className={s.arrow} />
    </button>
  );
};
