import { Button, Row, Text } from '@chatovo/ui-kit';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'use-intl';

import type { AdminPaginationProps } from './AdminPagination.types';

import s from './AdminPagination.module.scss';

export const AdminPagination = ({ page, perPage, total, onPageChange }: AdminPaginationProps) => {
  const t = useTranslations('admin');

  const lastPage = Math.max(1, Math.ceil(total / perPage));

  if (lastPage === 1) {
    return null;
  }

  return (
    <Row align='center' className={s.root} gap='2' justify='center'>
      <Button disabled={page <= 1} size='sm' variant='ghost' onClick={() => onPageChange(page - 1)}>
        <ChevronLeft />
        {t('pagination.prev')}
      </Button>

      <Text size='xs' tone='muted'>
        {t('pagination.page', { page })}
      </Text>

      <Button
        disabled={page >= lastPage}
        size='sm'
        variant='ghost'
        onClick={() => onPageChange(page + 1)}
      >
        {t('pagination.next')}
        <ChevronRight />
      </Button>
    </Row>
  );
};
