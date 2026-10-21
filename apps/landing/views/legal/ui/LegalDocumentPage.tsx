import { localizeSitePath } from '@chatovo/config';
import { Text } from '@chatovo/ui-kit';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

import { LEGAL } from '@/shared/config';
import { EXTERNAL_LINKS, ROUTES } from '@/shared/constants';
import { MarketingSection, MarketingShell } from '@/widgets/marketing/marketing-shell';

import type { LegalDocumentPageProps } from './LegalDocumentPage.types';

import { readLegalDocument } from '../lib';

import s from './LegalDocumentPage.module.scss';

export const LegalDocumentPage = async ({ locale, documentId }: LegalDocumentPageProps) => {
  const t = await getTranslations({ locale, namespace: 'legal' });
  const document = await getTranslations({ locale, namespace: `legal.${documentId}` });

  const content = readLegalDocument(document);
  const isPrivacy = documentId === 'privacyPage';
  const path = isPrivacy ? ROUTES.privacy : ROUTES.terms;
  const alternatePath = isPrivacy ? ROUTES.terms : ROUTES.privacy;

  return (
    <MarketingShell locale={locale} path={path}>
      <MarketingSection>
        <article className={s.shell}>
          <header className={s.header}>
            <h1 className={s.title}>{content.title}</h1>
            <Text size='sm' tone='muted'>
              {content.updated}
            </Text>
          </header>

          <div className={s.sections}>
            {content.sections.map((section) => (
              <section key={section.heading} className={s.section}>
                <h2 className={s.heading}>{section.heading}</h2>
                <div className={s.body}>
                  {section.paragraphs.map((paragraph) => (
                    <Text key={paragraph} className={s.paragraph} size='sm' tone='muted'>
                      {paragraph}
                    </Text>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <footer className={s.footer}>
            <a className={s.footerLink} href={EXTERNAL_LINKS.supportEmail}>
              {LEGAL.supportEmail}
            </a>
            <span aria-hidden className={s.footerSep}>
              ·
            </span>
            <Link className={s.footerLink} href={localizeSitePath({ path: alternatePath, locale })}>
              {isPrivacy ? t('terms') : t('privacy')}
            </Link>
          </footer>
        </article>
      </MarketingSection>
    </MarketingShell>
  );
};
