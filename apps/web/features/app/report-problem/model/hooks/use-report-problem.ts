import type { ReportProblemValues } from '@chatovo/schemas';

import { feedbackPlatformSchema } from '@chatovo/schemas';
import { useMutation } from '@tanstack/react-query';
import { isTauri } from '@tauri-apps/api/core';

import { reportProblem } from '@/shared/api';
import { env } from '@/shared/config';

type ReportProblemArgs = ReportProblemValues & {
  screenshot?: File;
};

const PLATFORM = feedbackPlatformSchema.enum;

const collectContext = () => ({
  appVersion: env.NEXT_PUBLIC_APP_VERSION,
  platform: isTauri() ? PLATFORM.tauri : PLATFORM.web,
  userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined
});

export const useReportProblem = () =>
  useMutation({
    mutationFn: ({ description, screenshot }: ReportProblemArgs) =>
      reportProblem({ description, screenshot, ...collectContext() })
  });
