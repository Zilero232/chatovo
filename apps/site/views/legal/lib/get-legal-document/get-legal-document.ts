import { LEGAL } from '@/shared/config';

import type { LegalDocument, LegalSection, LegalTranslator } from './get-legal-document.types';

const formatParagraph = (text: string) => text.replaceAll('{contact}', LEGAL.supportEmail);

/** Reads one legal document out of the active translations, resolving {contact} placeholders. */
export const readLegalDocument = (t: LegalTranslator): LegalDocument => {
  const sections = t.raw('sections') as LegalSection[];

  return {
    title: t('title'),
    updated: t('updated'),
    sections: sections.map((section) => ({
      heading: section.heading,
      paragraphs: section.paragraphs.map(formatParagraph)
    }))
  };
};
