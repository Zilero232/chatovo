import { clsx } from 'clsx';
import { getFormatter, getTranslations } from 'next-intl/server';

import { RevealOnScroll, Text } from '@/ui-kit';

import type { ChangelogReleaseCardProps } from './ChangelogReleaseCard.types';

import { ChangelogEntryRow } from '../ChangelogEntryRow/ChangelogEntryRow';

import s from '../../ChangelogPage.module.scss';

export const ChangelogReleaseCard = async ({
  isLatest,
  locale,
  release
}: ChangelogReleaseCardProps) => {
  const t = await getTranslations({ locale, namespace: 'changelog' });
  const format = await getFormatter({ locale });

  const releasedOn = format.dateTime(new Date(release.date), {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <RevealOnScroll as='article' className={s.release}>
      <header className={s.releaseHead}>
        <div className={s.releaseTitleRow}>
          <Text as='h2' className={clsx(s.releaseVersion, isLatest && s.releaseVersionLatest)}>
            {release.version}
          </Text>

          <span className={clsx(s.releaseTone, release.tone === 'major' && s.releaseToneMajor)}>
            {t(`tones.${release.tone}`)}
          </span>
        </div>

        <time className={s.releaseDate} dateTime={release.date}>
          {releasedOn}
        </time>
      </header>

      {release.highlights.length > 0 && (
        <div className={s.highlights}>
          {release.highlights.map((highlight) => (
            <span key={highlight} className={s.highlight}>
              {t(`highlights.${highlight}`)}
            </span>
          ))}
        </div>
      )}

      <ul className={s.entries}>
        {release.entries.map((entry) => (
          <ChangelogEntryRow key={entry.key} entry={entry} locale={locale} />
        ))}
      </ul>
    </RevealOnScroll>
  );
};
