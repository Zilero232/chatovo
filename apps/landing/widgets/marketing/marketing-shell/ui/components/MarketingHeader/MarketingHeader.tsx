import { localizeSitePath } from '@chatovo/config';
import { BrandMark } from '@chatovo/ui-kit';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

import type { Locale } from '@/shared/i18n';

import { SITE } from '@/shared/config';
import { ROUTES } from '@/shared/constants';
import { LOCALES } from '@/shared/i18n';

import type { MarketingHeaderProps } from './MarketingHeader.types';

import { MARKETING_PAGE_KEYS, marketingPageHref } from '../../../config';
import { MarketingAppCta } from '../MarketingAppCta/MarketingAppCta';
import { MarketingHeaderMobileNav } from '../MarketingHeaderMobileNav/MarketingHeaderMobileNav';
import { MarketingHeaderNav } from '../MarketingHeaderNav/MarketingHeaderNav';
import { MarketingHeaderShell } from '../MarketingHeaderShell/MarketingHeaderShell';
import { MarketingLanguageSelect } from '../MarketingLanguageSelect/MarketingLanguageSelect';

import s from '../../MarketingShell.module.scss';

export const MarketingHeader = async ({ locale, path }: MarketingHeaderProps) => {
  const t = await getTranslations({ locale, namespace: 'home.nav' });

  const navItems = MARKETING_PAGE_KEYS.map((key) => ({
    key,
    href: marketingPageHref(key, locale),
    label: t(`pages.${key}`)
  }));

  const languageHrefs = Object.fromEntries(
    LOCALES.map((code) => [code, localizeSitePath({ path, locale: code })])
  ) as Record<Locale, string>;

  return (
    <MarketingHeaderShell>
      <Link className={s.brand} href={localizeSitePath({ path: ROUTES.home, locale })}>
        <BrandMark size={30} />
        <span className={s.brandName}>{SITE.name}</span>
      </Link>

      <MarketingHeaderNav ariaLabel={t('ariaLabel')} items={navItems} />

      <div className={s.headerActions}>
        <div className={s.headerLocaleSwitch}>
          <MarketingLanguageSelect
            className={s.localeSwitch}
            hrefs={languageHrefs}
            label={t('language')}
            locale={locale}
          />
        </div>

        <MarketingAppCta className={s.headerCta} label={t('signIn')} />

        <MarketingHeaderMobileNav
          appLabel={t('signIn')}
          items={navItems}
          languageHrefs={languageHrefs}
          languageLabel={t('language')}
          locale={locale}
          menuDescription={t('menuDescription')}
          menuLabel={t('menuLabel')}
          menuTitle={t('menuTitle')}
        />
      </div>
    </MarketingHeaderShell>
  );
};
