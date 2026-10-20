import type { AbuseReport, ReportAbuseValues } from '@chatovo/schemas';

import { api } from '../http';

export const reportAbuse = async (values: ReportAbuseValues): Promise<AbuseReport> => {
  const { data } = await api.post<AbuseReport>('/moderation/reports', values);

  return data;
};
