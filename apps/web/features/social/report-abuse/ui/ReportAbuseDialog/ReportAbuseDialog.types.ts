import type { AbuseTarget } from '@chatovo/schemas';

export type ReportAbuseDialogProps = {
  target: AbuseTarget;
  targetId: string;
  targetName?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};
