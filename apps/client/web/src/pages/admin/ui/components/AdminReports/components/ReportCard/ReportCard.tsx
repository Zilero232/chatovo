import { Badge, Button, Row, Stack, Text } from '@chatovo/ui-kit';
import { Check } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslations } from 'use-intl';

import { useResolveReport } from '@/entities/app/admin';
import { useToastError } from '@/entities/app/locale';
import { formatDateTime } from '@/shared/lib';

import type { ReportCardProps } from './ReportCard.types';

import { resolveReportTargetKey } from '../../../../../lib';

import s from './ReportCard.module.scss';

export const ReportCard = ({ report }: ReportCardProps) => {
  const t = useTranslations('admin');
  const tReason = useTranslations('moderation');
  const toastError = useToastError();
  const { isPending, mutate } = useResolveReport();

  const subject = report.reportedUser?.name ?? report.roomName ?? report.targetId;

  const resolve = () =>
    mutate(report.id, {
      onSuccess: () => toast.success(t('reports.resolved'), { id: 'resolve-report' }),
      onError: toastError('resolve-report')
    });

  return (
    <Stack as='article' className={s.root} gap='2'>
      <Row wrap align='center' className={s.head} gap='2'>
        <Badge tone='danger'>{tReason(`reasons.${report.reason}`)}</Badge>
        <Text truncate size='sm' weight='medium'>
          {t(resolveReportTargetKey(report.target))}: {subject}
        </Text>
        <Text className={s.date} size='xs' tone='muted'>
          {formatDateTime(report.createdAt)}
        </Text>
      </Row>

      {report.reportedMessage && (
        <blockquote className={s.quote}>{report.reportedMessage}</blockquote>
      )}

      <Text size='sm' tone={report.comment ? 'default' : 'muted'}>
        {report.comment ?? t('reports.noComment')}
      </Text>

      <Row wrap align='center' className={s.foot} gap='2'>
        <Text size='xs' tone='muted'>
          {t('reports.reporter')}: {report.reporter?.name ?? report.reporterId}
        </Text>

        {!report.handled && (
          <Button disabled={isPending} size='sm' variant='ghost' onClick={resolve}>
            <Check />
            {t('reports.resolve')}
          </Button>
        )}
      </Row>
    </Stack>
  );
};
