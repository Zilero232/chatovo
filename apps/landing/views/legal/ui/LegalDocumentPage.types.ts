import type { Locale } from '@/shared/i18n';

import type { LegalDocumentId } from '../lib';

export type LegalDocumentPageProps = {
  locale: Locale;
  documentId: LegalDocumentId;
};
