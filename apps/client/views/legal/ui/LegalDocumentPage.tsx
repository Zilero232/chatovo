'use client';

import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { LEGAL } from '@/shared/config';
import { EXTERNAL_LINKS, ROUTES } from '@/shared/constants';
import { Text } from '@/ui-kit';
import { StandaloneShell } from '@/widgets/layout/standalone-shell';

import type { LegalDocumentPageProps } from './LegalDocumentPage.types';

import { readLegalDocument } from '../lib';

import s from './LegalDocumentPage.module.scss';

export const LegalDocumentPage = ({ documentId, alternatePath }: LegalDocumentPageProps) => {
  const t = useTranslations('legal');
  const document = useTranslations(`legal.${documentId}`);

  const content = readLegalDocument(document);

  const alternateLabel = alternatePath === LEGAL.termsPath ? t('terms') : t('privacy');

  return (
    <StandaloneShell backHref={ROUTES.auth} backLabel={t('back')}>
      <article className={s.shell}>
        <header className={s.header}>
          <h1 className={s.title}>{content.title}</h1>
          <Text size='sm' tone='muted'>
            {content.updated}
          </Text>
        </header>

        <div className={clsx(s.scroll, 'scrollbar-none')}>
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
            <Link className={s.footerLink} href={alternatePath}>
              {alternateLabel}
            </Link>
          </footer>
        </div>
      </article>
    </StandaloneShell>
  );
};
