import { CenteredState, ScrollArea, Spinner, Stack } from '@chatovo/ui-kit';
import { MessageSquareOff } from 'lucide-react';
import { useState } from 'react';
import { match, P } from 'ts-pattern';
import { useTranslations } from 'use-intl';

import { useAdminUserMessages } from '@/entities/app/admin';

import type { UserPanelProps } from '../../UserDetailsDialog.types';

import { AdminPagination } from '../../../../../AdminPagination/AdminPagination';
import { MessageItem } from './components';

import s from './UserMessagesPanel.module.scss';

const PER_PAGE = 20;

export const UserMessagesPanel = ({ userId, enabled }: UserPanelProps) => {
  const t = useTranslations('admin');

  const [page, setPage] = useState(1);

  const { data, isPending } = useAdminUserMessages(userId, { page, perPage: PER_PAGE }, enabled);

  return (
    <Stack gap='3'>
      {match({ isPending, items: data?.items })
        .with({ isPending: true }, () => <Spinner className={s.spinner} />)
        .with({ items: P.when((list) => (list?.length ?? 0) > 0) }, ({ items }) => (
          <ScrollArea className={s.list}>
            <Stack gap='2'>
              {items?.map((message) => (
                <MessageItem key={message.id} message={message} />
              ))}
            </Stack>
          </ScrollArea>
        ))
        .otherwise(() => (
          <CenteredState icon={<MessageSquareOff />} title={t('users.messagesEmpty')} />
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
