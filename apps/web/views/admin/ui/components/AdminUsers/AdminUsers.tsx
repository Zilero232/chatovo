'use client';

import type { AdminUserFilter } from '@chatovo/schemas';

import { CenteredState, Row, SearchField, Select, Spinner, Stack, Text } from '@chatovo/ui-kit';
import { Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { match, P } from 'ts-pattern';

import { useAdminUsers } from '@/entities/app/admin';

import type { AdminTabProps } from '../../AdminPage.types';

import { useAdminSearchPage } from '../../../model/hooks';
import { AdminPagination } from '../AdminPagination/AdminPagination';
import { UserRow } from './components';

import s from './AdminUsers.module.scss';

const FILTERS: AdminUserFilter[] = ['all', 'online', 'blocked', 'admins'];
const PER_PAGE = 20;

export const AdminUsers = ({ enabled }: AdminTabProps) => {
  const t = useTranslations('admin');

  const { search, searchQuery, page, setPage, changeSearch, resetPage } = useAdminSearchPage();

  const [filter, setFilter] = useState<AdminUserFilter>('all');

  const { data, isPending } = useAdminUsers(
    { search: searchQuery, filter, page, perPage: PER_PAGE },
    enabled
  );

  const changeFilter = (next: AdminUserFilter) => {
    setFilter(next);
    resetPage();
  };

  return (
    <Stack gap='4'>
      <Row wrap align='center' className={s.toolbar} gap='3'>
        <SearchField
          aria-label={t('users.search')}
          className={s.search}
          placeholder={t('users.search')}
          value={search}
          onValueChange={changeSearch}
        />

        <Select
          aria-label={t('users.filterLabel')}
          className={s.filter}
          options={FILTERS.map((value) => ({ value, label: t(`users.filters.${value}`) }))}
          value={filter}
          onChange={changeFilter}
        />

        {data && (
          <Text size='xs' tone='muted'>
            {t('users.total', { count: data.total })}
          </Text>
        )}
      </Row>

      {match({ isPending, items: data?.items })
        .with({ isPending: true }, () => <Spinner className={s.spinner} />)
        .with({ items: P.when((list) => (list?.length ?? 0) > 0) }, ({ items }) => (
          <Stack className={s.list} gap='2'>
            {items?.map((user) => (
              <UserRow key={user.id} user={user} />
            ))}
          </Stack>
        ))
        .otherwise(() => (
          <CenteredState
            description={t('users.emptyHint')}
            icon={<Users />}
            title={t('users.empty')}
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
