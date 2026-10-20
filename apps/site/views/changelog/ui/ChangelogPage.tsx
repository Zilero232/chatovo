import { getTranslations } from 'next-intl/server';

import { ROUTES } from '@/shared/constants';
import {
  MarketingHero,
  MarketingSection,
  MarketingShell
} from '@/widgets/marketing/marketing-shell';

import type { ChangelogPageProps } from './ChangelogPage.types';

import { CHANGELOG_RELEASES } from '../config';
import { summarizeReleases } from '../lib';
import { ChangelogReleaseCard, ChangelogStats } from './components';

import s from './ChangelogPage.module.scss';

export const ChangelogPage = async ({ locale }: ChangelogPageProps) => {
  const t = await getTranslations({ locale, namespace: 'changelog.hero' });

  const summary = summarizeReleases(CHANGELOG_RELEASES);

  return (
    <MarketingShell locale={locale} path={ROUTES.changelog}>
      <MarketingHero
        chato='wink'
        description={t('description')}
        eyebrow={t('eyebrow')}
        title={t('title')}
      >
        <ChangelogStats locale={locale} summary={summary} />
      </MarketingHero>

      <MarketingSection>
        <div className={s.timeline}>
          {CHANGELOG_RELEASES.map((release, index) => (
            <ChangelogReleaseCard
              key={release.version}
              isLatest={index === 0}
              locale={locale}
              release={release}
            />
          ))}
        </div>
      </MarketingSection>
    </MarketingShell>
  );
};
