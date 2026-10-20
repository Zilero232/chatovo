'use client';

import type { ComponentType, SVGProps } from 'react';

import { FlagGbIcon, FlagRuIcon, Tooltip, TooltipContent } from '@chatovo/ui-kit';
import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';

import type { Locale } from '@/shared/i18n';

import { useLocale } from '@/entities/app/locale';
import { LOCALES } from '@/shared/i18n';

import s from './LanguageSwitcher.module.scss';

const LOCALE_FLAGS: Record<Locale, ComponentType<SVGProps<SVGSVGElement>>> = {
  en: FlagGbIcon,
  ru: FlagRuIcon
};

export const LanguageSwitcher = () => {
  const t = useTranslations('language');
  const { locale, setLocale } = useLocale();

  const activeIndex = LOCALES.indexOf(locale);

  return (
    <div aria-label={t('label')} className={s.root} role='group'>
      <span
        aria-hidden
        className={s.indicator}
        style={{ transform: `translateX(${activeIndex * 100}%)` }}
      />

      {LOCALES.map((code) => {
        const Flag = LOCALE_FLAGS[code];
        const isActive = code === locale;

        return (
          <Tooltip key={code}>
            <button
              aria-label={t(code)}
              aria-pressed={isActive}
              className={clsx(s.option, { [s.optionActive]: isActive })}
              type='button'
              onClick={() => setLocale(code)}
            >
              <Flag className={s.flag} />
            </button>
            <TooltipContent>{t(code)}</TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
};
