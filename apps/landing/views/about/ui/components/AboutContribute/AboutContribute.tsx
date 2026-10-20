import { Button, GithubIcon, RevealOnScroll } from '@chatovo/ui-kit';
import { Download } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { EXTERNAL_LINKS } from '@/shared/constants';
import { MarketingIconGrid } from '@/widgets/marketing/marketing-shell';

import type { AboutPageProps } from '../../AboutPage.types';

import { ABOUT_CONTRIBUTE_ICONS, ABOUT_CONTRIBUTE_KEYS } from '../../../config';

import s from '../../AboutPage.module.scss';

export const AboutContribute = async ({ locale }: AboutPageProps) => {
  const t = await getTranslations({ locale, namespace: 'about.contribute' });

  const items = ABOUT_CONTRIBUTE_KEYS.map((key) => ({
    key,
    Icon: ABOUT_CONTRIBUTE_ICONS[key],
    title: t(`items.${key}.title`),
    description: t(`items.${key}.description`)
  }));

  return (
    <MarketingIconGrid
      delayStep={0.06}
      description={t('subheading')}
      heading={t('heading')}
      id='contribute'
      items={items}
    >
      <RevealOnScroll className={s.links} delay={0.12}>
        <Button
          href={EXTERNAL_LINKS.repository}
          rel='noopener noreferrer'
          size='lg'
          target='_blank'
        >
          <GithubIcon className={s.linkIcon} />
          {t('repository')}
        </Button>

        <Button
          href={EXTERNAL_LINKS.appReleases}
          rel='noopener noreferrer'
          size='lg'
          target='_blank'
          variant='outline'
        >
          <Download className={s.linkIcon} />
          {t('releases')}
        </Button>
      </RevealOnScroll>
    </MarketingIconGrid>
  );
};
