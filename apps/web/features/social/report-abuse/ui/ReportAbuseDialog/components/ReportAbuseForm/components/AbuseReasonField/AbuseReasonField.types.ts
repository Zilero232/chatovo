import type { ReportAbuseFormValues } from '@chatovo/schemas';
import type { Control } from 'react-hook-form';

export type AbuseReasonFieldProps = {
  control: Control<ReportAbuseFormValues>;
  error?: string;
};
