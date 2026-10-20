export type LegalDocumentId = 'privacyPage' | 'termsPage';

export type LegalSection = {
  heading: string;
  paragraphs: string[];
};

export type LegalDocument = {
  sections: LegalSection[];
  title: string;
  updated: string;
};

export type LegalTranslator = {
  (key: 'title' | 'updated'): string;
  raw: (key: 'sections') => unknown;
};
