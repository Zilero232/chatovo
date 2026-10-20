import { BrandMark, GithubIcon, Text } from '@chatovo/ui-kit';
import { clsx } from 'clsx';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

import { SITE } from '@/shared/config';
import { EXTERNAL_LINKS, ROUTES } from '@/shared/constants';
import { localizeMarketingPath } from '@/shared/lib';

import type { MarketingFooterProps } from './MarketingFooter.types';

import { MARKETING_PAGE_KEYS, marketingPageHref } from '../../../config';

import s from '../../MarketingShell.module.scss';

const buildYear = new Date().getFullYear();

export const MarketingFooter = async ({ locale }: MarketingFooterProps) => {
  const t = await getTranslations({ locale, namespace: 'home.footer' });

  return (
    <footer className={clsx(s.container, s.footer)}>
      <div className={s.footerBrand}>
        <div className={s.footerBrandRow}>
          <BrandMark size={24} />
          <Text as='span' className={s.footerBrandName} weight='semibold'>
            {SITE.name}
          </Text>
        </div>

        <Text size='sm' tone='muted'>
          {t('tagline')}
        </Text>
      </div>

      <div className={s.footerColumn}>
        <Text as='h2' className={s.footerColumnTitle}>
          {t('sections.product')}
        </Text>

        <nav className={s.footerLinks}>
          {MARKETING_PAGE_KEYS.map((key) => (
            <Link key={key} className={s.footerLink} href={marketingPageHref(key, locale)}>
              {t(`pages.${key}`)}
            </Link>
          ))}
        </nav>
      </div>

      <div className={s.footerColumn}>
        <Text as='h2' className={s.footerColumnTitle}>
          {t('sections.company')}
        </Text>

        <nav className={s.footerLinks}>
          <Link
            className={s.footerLink}
            href={localizeMarketingPath({ path: ROUTES.privacy, locale })}
          >
            {t('privacy')}
          </Link>

          <Link
            className={s.footerLink}
            href={localizeMarketingPath({ path: ROUTES.terms, locale })}
          >
            {t('terms')}
          </Link>
        </nav>
      </div>

      <div className={s.footerBottom}>
        <Text size='sm' tone='muted'>
          © {buildYear} {SITE.name}
        </Text>

        <a
          className={s.footerLink}
          href={EXTERNAL_LINKS.repository}
          rel='noopener noreferrer'
          target='_blank'
        >
          <GithubIcon className={s.footerLinkIcon} />
          {t('github')}
        </a>
      </div>
    </footer>
  );
};
