'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { isEmpty } from 'remeda';

import { useContributors } from '@/entities/app/release';
import { openExternal } from '@/shared/lib';
import { RevealOnScroll } from '@/ui-kit';

import type { MarketingContributorsListProps } from './MarketingContributorsList.types';

import { MarketingSection } from '../MarketingSection/MarketingSection';
import { MarketingSectionHead } from '../MarketingSectionHead/MarketingSectionHead';

import s from './MarketingContributorsList.module.scss';

export const MarketingContributorsList = ({
  heading,
  description
}: MarketingContributorsListProps) => {
  const t = useTranslations('common');

  const { data: contributors } = useContributors();

  if (!contributors || isEmpty(contributors)) {
    return null;
  }

  return (
    <MarketingSection id='contributors'>
      <MarketingSectionHead description={description} heading={heading} />

      <RevealOnScroll delay={0.08}>
        <ul className={s.list}>
          {contributors.map((contributor) => (
            <li key={contributor.login}>
              <button
                className={s.item}
                title={t('commits', { count: contributor.contributions })}
                type='button'
                onClick={() => openExternal(contributor.html_url)}
              >
                <Image
                  alt={contributor.login}
                  className={s.avatar}
                  height={28}
                  src={contributor.avatar_url}
                  width={28}
                />
                <span className={s.name}>{contributor.login}</span>
              </button>
            </li>
          ))}
        </ul>
      </RevealOnScroll>
    </MarketingSection>
  );
};
