import type { ReportProblemValues } from '@chatovo/schemas';

import { entries, isNonNullish } from 'remeda';

import { api, UPLOAD_TIMEOUT_MS } from '../http';

type ReportProblemArgs = ReportProblemValues & {
  screenshot?: File;
};

export const reportProblem = async ({
  screenshot,
  ...values
}: ReportProblemArgs): Promise<void> => {
  const fd = new FormData();

  for (const [key, value] of entries(values)) {
    if (isNonNullish(value)) {
      fd.append(key, String(value));
    }
  }

  if (screenshot instanceof File) {
    fd.append('screenshot', screenshot);
  }

  await api.post('/feedback', fd, { timeout: UPLOAD_TIMEOUT_MS });
};
