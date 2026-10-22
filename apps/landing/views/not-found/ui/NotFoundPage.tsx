import { localizeSitePath } from '@chatovo/config';
import { Button, ChatoScene, StatusScreen } from '@chatovo/ui-kit';
import { getTranslations } from 'next-intl/server';

import { APP_ROUTES, ROUTES } from '@/shared/constants';
import { buildAppHref } from '@/shared/lib';
import { MarketingShell } from '@/widgets/marketing/marketing-shell';

import type { NotFoundPageProps } from './NotFoundPage.types';

import s from './NotFoundPage.module.scss';

export const NotFoundPage = async ({ locale }: NotFoundPageProps) => {
  const t = await getTranslations({ locale, namespace: 'notFound' });

  return (
    <MarketingShell locale={locale} path={ROUTES.home}>
      <StatusScreen
        actions={
          <>
            <Button href={localizeSitePath({ path: ROUTES.home, locale })} size='lg'>
              {t('toHome')}
            </Button>
            <Button href={buildAppHref(APP_ROUTES.lobby)} size='lg' variant='outline'>
              {t('openApp')}
            </Button>
          </>
        }
        className={s.root}
        code='404'
        description={t('description')}
        illustration={<ChatoScene pose='peek' />}
        title={t('title')}
      />
    </MarketingShell>
  );
};
