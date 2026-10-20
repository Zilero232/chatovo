import type { AdminUserDetails } from '@chatovo/schemas';

import { Badge, Row, Spinner, Stack, Text } from '@chatovo/ui-kit';
import { isNonNullish } from 'remeda';
import { match, P } from 'ts-pattern';
import { useTranslations } from 'use-intl';

import { useAdminUserDetails } from '@/entities/app/admin';
import { formatDateTime } from '@/shared/lib';

import type { UserPanelProps } from '../../UserDetailsDialog.types';

import s from './UserOverviewPanel.module.scss';

export const UserOverviewPanel = ({ userId, enabled }: UserPanelProps) => {
  const t = useTranslations('admin');
  const { data, isPending } = useAdminUserDetails(userId, enabled);

  const renderDetails = (details: AdminUserDetails) => (
    <Stack gap='4'>
      <div className={s.grid}>
        <div className={s.cell}>
          <Text size='xs' tone='muted'>
            {t('users.roomsCount', { count: details.user.roomsCount })}
          </Text>
        </div>
        <div className={s.cell}>
          <Text size='xs' tone='muted'>
            {t('users.messagesCount', { count: details.user.messagesCount })}
          </Text>
        </div>
        <div className={s.cell}>
          <Text size='xs' tone='muted'>
            {t('users.sessions')}: {details.sessions}
          </Text>
        </div>
        <div className={s.cell}>
          <Text size='xs' tone='muted'>
            {t('users.reportsFiled')}: {details.reportsFiled}
          </Text>
        </div>
      </div>

      <Text size='xs' tone='muted'>
        {t('users.lastMessage')}:{' '}
        {details.lastMessageAt ? formatDateTime(details.lastMessageAt) : t('users.never')}
      </Text>

      {details.ownedRooms.length > 0 && (
        <Stack gap='2'>
          <Text size='sm' weight='medium'>
            {t('users.ownedRooms')}
          </Text>
          <Row wrap gap='2'>
            {details.ownedRooms.map((room) => (
              <Badge key={room.id}>{room.name}</Badge>
            ))}
          </Row>
        </Stack>
      )}

      {details.reportsAgainst.length > 0 && (
        <Stack gap='2'>
          <Text size='sm' weight='medium'>
            {t('users.reportsAgainst')}: {details.reportsAgainst.length}
          </Text>
          <Row wrap gap='2'>
            {details.reportsAgainst.map((report) => (
              <Badge key={report.id} tone='danger'>
                {report.reason}
              </Badge>
            ))}
          </Row>
        </Stack>
      )}
    </Stack>
  );

  return match({ isPending, data })
    .with({ isPending: true }, () => <Spinner className={s.spinner} />)
    .with({ data: P.when(isNonNullish) }, ({ data: details }) => renderDetails(details))
    .otherwise(() => null);
};
