import { BrandMark } from '@chatovo/ui-kit';
import { clsx } from 'clsx';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

import { SITE } from '@/shared/config';
import { ROUTES } from '@/shared/constants';
import { localizeMarketingPath } from '@/shared/lib';

import type { MarketingHeaderProps } from './MarketingHeader.types';

import { MARKETING_PAGE_KEYS, marketingPageHref } from '../../../config';
import { MarketingAppCta } from '../MarketingAppCta/MarketingAppCta';
import { MarketingHeaderMobileNav } from '../MarketingHeaderMobileNav/MarketingHeaderMobileNav';
import { MarketingHeaderNav } from '../MarketingHeaderNav/MarketingHeaderNav';
import { MarketingHeaderShell } from '../MarketingHeaderShell/MarketingHeaderShell';

import s from '../../MarketingShell.module.scss';

export const MarketingHeader = async ({ locale, path }: MarketingHeaderProps) => {
  const t = await getTranslations({ locale, namespace: 'home.nav' });

  const alternateLocale = locale === 'ru' ? 'en' : 'ru';

  const navItems = MARKETING_PAGE_KEYS.map((key) => ({
    key,
    href: marketingPageHref(key, locale),
    label: t(`pages.${key}`)
  }));

  const localeSwitchHref = localizeMarketingPath({ path, locale: alternateLocale });
  const localeSwitchHrefLang = alternateLocale === 'en' ? SITE.en.lang : SITE.lang;

  return (
    <MarketingHeaderShell>
      <Link className={s.brand} href={localizeMarketingPath({ path: ROUTES.home, locale })}>
        <BrandMark size={30} />
        <span className={s.brandName}>{SITE.name}</span>
      </Link>

      <MarketingHeaderNav ariaLabel={t('ariaLabel')} items={navItems} />

      <div className={s.headerActions}>
        <Link
          className={clsx(s.localeSwitch, s.headerLocaleSwitch)}
          href={localeSwitchHref}
          hrefLang={localeSwitchHrefLang}
        >
          {t('localeSwitch')}
        </Link>

        <MarketingAppCta className={s.headerCta} label={t('signIn')} />

        <MarketingHeaderMobileNav
          appLabel={t('signIn')}
          items={navItems}
          localeSwitchHref={localeSwitchHref}
          localeSwitchHrefLang={localeSwitchHrefLang}
          localeSwitchLabel={t('localeSwitch')}
          menuDescription={t('menuDescription')}
          menuLabel={t('menuLabel')}
          menuTitle={t('menuTitle')}
        />
      </div>
    </MarketingHeaderShell>
  );
};
