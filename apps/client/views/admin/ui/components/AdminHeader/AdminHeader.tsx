'use client';

import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import { ROUTES } from '@/shared/constants';
import { Button, Row, Stack, Text } from '@/ui-kit';

import s from './AdminHeader.module.scss';

export const AdminHeader = () => {
  const router = useRouter();
  const t = useTranslations('admin');

  return (
    <Row align='center' className={s.root} gap='3'>
      <span className={s.badge}>
        <ShieldCheck className={s.icon} />
      </span>

      <Stack className={s.text} gap='1'>
        <Text as='h1' size='2xl' weight='semibold'>
          {t('title')}
        </Text>

        <Text size='sm' tone='muted'>
          {t('subtitle')}
        </Text>
      </Stack>

      <Button
        className={s.back}
        size='sm'
        variant='secondary'
        onClick={() => router.push(ROUTES.lobby)}
      >
        <ArrowLeft />
        <span className={s.backLabel}>{t('backToLobby')}</span>
      </Button>
    </Row>
  );
};
