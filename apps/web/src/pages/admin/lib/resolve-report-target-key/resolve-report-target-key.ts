import type { AbuseTarget } from '@chatovo/schemas';

import { match } from 'ts-pattern';

type ReportTargetKey = 'reports.targetMessage' | 'reports.targetRoom' | 'reports.targetUser';

export const resolveReportTargetKey = (target: AbuseTarget): ReportTargetKey =>
  match(target)
    .with('user', () => 'reports.targetUser' as const)
    .with('room', () => 'reports.targetRoom' as const)
    .with('message', () => 'reports.targetMessage' as const)
    .exhaustive();
