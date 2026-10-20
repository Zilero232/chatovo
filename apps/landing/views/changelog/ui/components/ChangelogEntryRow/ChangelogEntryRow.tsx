import { Text } from '@chatovo/ui-kit';
import { clsx } from 'clsx';
import { ArrowUpRight, Bug, ShieldCheck, Sparkles } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import type { ChangelogEntryKind } from '../../../config';
import type { ChangelogEntryRowProps } from './ChangelogEntryRow.types';

import s from '../../ChangelogPage.module.scss';

const KIND_ICON = {
  feature: Sparkles,
  fix: Bug,
  improvement: ArrowUpRight,
  security: ShieldCheck
} satisfies Record<ChangelogEntryKind, typeof Sparkles>;

const KIND_CLASS = {
  feature: s.kindFeature,
  fix: s.kindFix,
  improvement: s.kindImprovement,
  security: s.kindSecurity
} satisfies Record<ChangelogEntryKind, string>;

export const ChangelogEntryRow = async ({ entry, locale }: ChangelogEntryRowProps) => {
  const t = await getTranslations({ locale, namespace: 'changelog' });

  const Icon = KIND_ICON[entry.kind];

  return (
    <li className={s.entry}>
      <span aria-hidden className={clsx(s.entryIcon, KIND_CLASS[entry.kind])}>
        <Icon />
      </span>

      <div className={s.entryBody}>
        <Text as='h3' className={s.entryTitle} size='sm' weight='medium'>
          {t(`entries.${entry.key}.title`)}
        </Text>
        <Text size='sm' tone='muted'>
          {t(`entries.${entry.key}.description`)}
        </Text>
      </div>

      <span className={clsx(s.entryKind, KIND_CLASS[entry.kind])}>{t(`kinds.${entry.kind}`)}</span>
    </li>
  );
};
