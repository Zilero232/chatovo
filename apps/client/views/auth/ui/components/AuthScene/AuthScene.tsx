'use client';

import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';

import { useEnterMotion } from '@/shared/hooks';
import { BrandMark, Chato, Text } from '@/ui-kit';

import type { AuthSceneProps } from './AuthScene.types';

import { AUTH_CHATO_POSE, AUTH_SCENE_LINES } from '../../../config';

import s from './AuthScene.module.scss';

export const AuthScene = ({ mode }: AuthSceneProps) => {
  const t = useTranslations('auth');
  const enterMotion = useEnterMotion(0.08);

  return (
    <motion.aside className={s.root} {...enterMotion}>
      <div className={s.brand}>
        <BrandMark size={32} />
        <span className={s.wordmark}>{t('appName')}</span>
      </div>

      <Chato className={s.chato} pose={AUTH_CHATO_POSE[mode]} />

      <h2 className={s.title}>
        {t.rich('scene.title', {
          accent: (chunks) => <em className={s.accent}>{chunks}</em>
        })}
      </h2>

      <ul className={s.lines}>
        {AUTH_SCENE_LINES.map(({ key, Icon }) => (
          <li key={key} className={s.line}>
            <span aria-hidden className={s.lineIcon}>
              <Icon />
            </span>
            <Text size='sm' tone='muted'>
              {t(`scene.lines.${key}`)}
            </Text>
          </li>
        ))}
      </ul>
    </motion.aside>
  );
};
