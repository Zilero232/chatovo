'use client';

import type { ReportAbuseValues } from '@chatovo/schemas';

import { useMutation } from '@tanstack/react-query';

import { reportAbuse } from '@/shared/api';

export const useReportAbuse = () =>
  useMutation({
    mutationFn: (values: ReportAbuseValues) => reportAbuse(values)
  });
