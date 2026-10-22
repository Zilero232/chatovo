import { Button, Chato, Text } from '@chatovo/ui-kit';
import { motion } from 'motion/react';
import { useTranslations } from 'use-intl';

import { LEGAL } from '@/shared/config';
import { ROUTES } from '@/shared/constants';
import { useEnterMotion } from '@/shared/hooks';

import s from './AccountDeletePage.module.scss';

const STEP_KEYS = ['step1', 'step2', 'step3'] as const;

export const AccountDeletePage = () => {
  const t = useTranslations('accountDelete');
  const enterMotion = useEnterMotion();

  return (
    <motion.article className={s.card} {...enterMotion}>
      <div className={s.header}>
        <Chato className={s.chato} pose='sleep' />

        <h1 className={s.title}>{t('title')}</h1>
        <Text tone='muted'>{t('intro')}</Text>
      </div>

      <ol className={s.steps}>
        {STEP_KEYS.map((key, index) => (
          <li key={key} className={s.step}>
            <span aria-hidden className={s.stepNumber}>
              {index + 1}
            </span>
            <Text size='sm'>{t(key)}</Text>
          </li>
        ))}
      </ol>

      <div className={s.note}>
        <Text size='sm' tone='muted'>
          {t('removed')}
        </Text>
        <Text size='sm' tone='muted'>
          {t('kept')}
        </Text>
      </div>

      <div className={s.actions}>
        <Button href={ROUTES.auth} size='lg'>
          {t('signIn')}
        </Button>

        <Button href={`mailto:${LEGAL.supportEmail}`} size='lg' variant='secondary'>
          {t('contact')}
        </Button>
      </div>
    </motion.article>
  );
};
