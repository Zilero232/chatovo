'use client';

import { CenteredState, Row, SearchField, Spinner, Stack, Text } from '@chatovo/ui-kit';
import { DoorOpen } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { match, P } from 'ts-pattern';

import { useAdminRooms } from '@/entities/app/admin';

import type { AdminTabProps } from '../../AdminPage.types';

import { useAdminSearchPage } from '../../../model/hooks';
import { AdminPagination } from '../AdminPagination/AdminPagination';
import { RoomRow } from './components';

import s from './AdminRooms.module.scss';

const PER_PAGE = 20;

export const AdminRooms = ({ enabled }: AdminTabProps) => {
  const t = useTranslations('admin');

  const { search, searchQuery, page, setPage, changeSearch } = useAdminSearchPage();

  const { data, isPending } = useAdminRooms(
    { search: searchQuery, page, perPage: PER_PAGE },
    enabled
  );

  return (
    <Stack gap='4'>
      <Row wrap align='center' gap='3'>
        <SearchField
          aria-label={t('rooms.search')}
          className={s.search}
          placeholder={t('rooms.search')}
          value={search}
          onValueChange={changeSearch}
        />

        {data && (
          <Text size='xs' tone='muted'>
            {t('rooms.total', { count: data.total })}
          </Text>
        )}
      </Row>

      {match({ isPending, items: data?.items })
        .with({ isPending: true }, () => <Spinner className={s.spinner} />)
        .with({ items: P.when((list) => (list?.length ?? 0) > 0) }, ({ items }) => (
          <Stack className={s.list} gap='2'>
            {items?.map((room) => (
              <RoomRow key={room.id} room={room} />
            ))}
          </Stack>
        ))
        .otherwise(() => (
          <CenteredState
            description={t('rooms.emptyHint')}
            icon={<DoorOpen />}
            title={t('rooms.empty')}
          />
        ))}

      <AdminPagination
        page={page}
        perPage={PER_PAGE}
        total={data?.total ?? 0}
        onPageChange={setPage}
      />
    </Stack>
  );
};
