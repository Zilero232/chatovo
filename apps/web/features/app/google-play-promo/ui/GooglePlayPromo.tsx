'use client';

import { Button, Text } from '@chatovo/ui-kit';
import { ExternalLink, Smartphone, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useTranslations } from 'next-intl';

import { EXTERNAL_LINKS } from '@/shared/constants';

import { useGooglePlayPromo } from '../model/hooks';

import s from './GooglePlayPromo.module.scss';

export const GooglePlayPromo = () => {
  const t = useTranslations('googlePlayPromo');

  const { isVisible, dismiss } = useGooglePlayPromo();

  return (
    <AnimatePresence initial={false}>
      {isVisible && (
        <motion.aside
          animate={{ opacity: 1, height: 'auto' }}
          className={s.wrap}
          exit={{ opacity: 0, height: 0 }}
          initial={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          <div className={s.root}>
            <span aria-hidden className={s.iconTile}>
              <Smartphone className={s.icon} />
            </span>

            <div className={s.copy}>
              <Text as='h2' className={s.title} weight='semibold'>
                {t('title')}
              </Text>
              <Text size='sm' tone='muted'>
                {t('description')}
              </Text>
            </div>

            <Button
              className={s.action}
              href={EXTERNAL_LINKS.googlePlay}
              rel='noopener noreferrer'
              size='sm'
              target='_blank'
            >
              {t('action')}
              <ExternalLink />
            </Button>

            <Button
              aria-label={t('dismiss')}
              className={s.close}
              size='icon-sm'
              type='button'
              variant='ghost'
              onClick={dismiss}
            >
              <X />
            </Button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};
