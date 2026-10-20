import type { AbuseTarget } from '@chatovo/schemas';

export type ReportAbuseFormProps = {
  target: AbuseTarget;
  targetId: string;
  onSent: () => void;
};
