import { Button, Chato, Text } from '@chatovo/ui-kit';
import { getTranslations } from 'next-intl/server';

import { APP_ROUTES, ROUTES } from '@/shared/constants';
import { buildAppHref, localizeMarketingPath } from '@/shared/lib';
import { MarketingScene, MarketingShell } from '@/widgets/marketing/marketing-shell';

import type { NotFoundPageProps } from './NotFoundPage.types';

import s from './NotFoundPage.module.scss';

export const NotFoundPage = async ({ locale }: NotFoundPageProps) => {
  const t = await getTranslations({ locale, namespace: 'notFound' });

  return (
    <MarketingShell locale={locale} path={ROUTES.home}>
      <section className={s.root}>
        <MarketingScene>
          <Chato className={s.chato} pose='peek' />
        </MarketingScene>

        <p className={s.code}>404</p>
        <h1 className={s.title}>{t('title')}</h1>
        <Text className={s.description} size='lg' tone='muted'>
          {t('description')}
        </Text>

        <div className={s.actions}>
          <Button href={localizeMarketingPath({ path: ROUTES.home, locale })} size='lg'>
            {t('toHome')}
          </Button>
          <Button href={buildAppHref(APP_ROUTES.lobby)} size='lg' variant='outline'>
            {t('openApp')}
          </Button>
        </div>
      </section>
    </MarketingShell>
  );
};
