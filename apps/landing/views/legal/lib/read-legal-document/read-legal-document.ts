import { LEGAL } from '@/shared/config';

import type { LegalDocument, LegalSection, LegalTranslator } from './read-legal-document.types';

const formatParagraph = (text: string) => text.replaceAll('{contact}', LEGAL.supportEmail);

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
