import { CenteredState, Select, Spinner, Stack } from '@chatovo/ui-kit';
import { ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { match, P } from 'ts-pattern';
import { useTranslations } from 'use-intl';

import { useAdminReports } from '@/entities/app/admin';

import type { AdminTabProps } from '../../AdminPage.types';

import { ReportCard } from './components';

import s from './AdminReports.module.scss';

type Scope = 'false' | 'true';

export const AdminReports = ({ enabled }: AdminTabProps) => {
  const t = useTranslations('admin');

  const [scope, setScope] = useState<Scope>('false');

  const { data: reports, isPending } = useAdminReports(
    { handled: scope === 'true', page: 1, perPage: 50 },
    enabled
  );

  return (
    <Stack gap='4'>
      <Select
        options={[
          { value: 'false', label: t('reports.pending') },
          { value: 'true', label: t('reports.handled') }
        ]}
        aria-label={t('reports.scopeLabel')}
        className={s.scope}
        value={scope}
        onChange={setScope}
      />

      {match({ isPending, reports })
        .with({ isPending: true }, () => <Spinner className={s.spinner} />)
        .with({ reports: P.when((list) => (list?.length ?? 0) > 0) }, ({ reports: list }) => (
          <Stack className={s.list} gap='3'>
            {list?.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </Stack>
        ))
        .otherwise(() => (
          <CenteredState
            description={t('reports.emptyHint')}
            icon={<ShieldCheck />}
            title={t('reports.empty')}
          />
        ))}
    </Stack>
  );
};
