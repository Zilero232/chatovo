import { Button, GithubIcon } from '@chatovo/ui-kit';
import { getTranslations } from 'next-intl/server';

import { APP_ROUTES, EXTERNAL_LINKS, ROUTES } from '@/shared/constants';
import { buildAppHref } from '@/shared/lib';
import {
  MarketingDevices,
  MarketingHero,
  MarketingSection,
  MarketingSectionHead,
  MarketingShell
} from '@/widgets/marketing/marketing-shell';

import type { DownloadPageProps } from './DownloadPage.types';

import { DownloadPlatforms, DownloadRequirements } from './components';

import s from './DownloadPage.module.scss';

export const DownloadPage = async ({ locale }: DownloadPageProps) => {
  const t = await getTranslations({ locale, namespace: 'download' });

  return (
    <MarketingShell locale={locale} path={ROUTES.download}>
      <MarketingHero
        visual={
          <MarketingDevices
            desktopAlt={t('hero.desktopAlt')}
            locale={locale}
            mobileAlt={t('hero.mobileAlt')}
          />
        }
        description={t('hero.description')}
        eyebrow={t('hero.eyebrow')}
        title={t('hero.title')}
      >
        <Button href={buildAppHref(APP_ROUTES.lobby)} size='lg'>
          {t('web.action')}
        </Button>
      </MarketingHero>

      <MarketingSection>
        <MarketingSectionHead
          description={t('desktop.description')}
          heading={t('desktop.heading')}
        />

        <DownloadPlatforms locale={locale} />
      </MarketingSection>

      <DownloadRequirements locale={locale} />

      <MarketingSection>
        <MarketingSectionHead
          description={t('fallback.description')}
          heading={t('fallback.heading')}
        />

        <Button
          className={s.fallbackAction}
          href={EXTERNAL_LINKS.appReleases}
          rel='noopener noreferrer'
          target='_blank'
          variant='outline'
        >
          <GithubIcon />
          {t('fallback.action')}
        </Button>
      </MarketingSection>
    </MarketingShell>
  );
};
