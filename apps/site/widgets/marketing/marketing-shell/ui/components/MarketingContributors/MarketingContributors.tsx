import { RevealOnScroll } from '@chatovo/ui-kit';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';

import { getContributors } from '@/entities/release';

import type { MarketingContributorsProps } from './MarketingContributors.types';

import { MarketingSection } from '../MarketingSection/MarketingSection';
import { MarketingSectionHead } from '../MarketingSectionHead/MarketingSectionHead';

import s from './MarketingContributors.module.scss';

export const MarketingContributors = async ({ locale }: MarketingContributorsProps) => {
  const t = await getTranslations({ locale, namespace: 'about.contributors' });

  const contributors = await getContributors();

  if (contributors.length === 0) {
    return null;
  }

  return (
    <MarketingSection id='contributors'>
      <MarketingSectionHead description={t('subheading')} heading={t('heading')} />

      <RevealOnScroll delay={0.08}>
        <ul className={s.list}>
          {contributors.map(({ login, avatar_url: avatarUrl, html_url: url, contributions }) => (
            <li key={login}>
              <a
                className={s.item}
                href={url}
                rel='noopener noreferrer'
                target='_blank'
                title={t('commits', { count: contributions })}
              >
                <Image alt={login} className={s.avatar} height={28} src={avatarUrl} width={28} />
                <span className={s.name}>{login}</span>
              </a>
            </li>
          ))}
        </ul>
      </RevealOnScroll>
    </MarketingSection>
  );
};
