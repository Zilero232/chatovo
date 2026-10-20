'use client';

import { Chato } from '@chatovo/ui-kit';
import { clsx } from 'clsx';
import { motion } from 'motion/react';
import dynamic from 'next/dynamic';
import { useState } from 'react';

import { useWebglStage } from '@/shared/hooks';

import type { HomeHeroStageProps } from './HomeHeroStage.types';

import { HERO_STAGE_FADE } from '../../../config';
import { HeroCanvasBoundary } from './components';

import s from './HomeHeroStage.module.scss';

const ChatoCanvas = dynamic(
  () => import('./components/ChatoCanvas/ChatoCanvas').then((m) => ({ default: m.ChatoCanvas })),
  {
    ssr: false
  }
);

export const HomeHeroStage = ({ label }: HomeHeroStageProps) => {
  const { ref, tier, isActive, isRunning } = useWebglStage({ waitFor: 'idle' });

  const [isReady, setIsReady] = useState(false);

  return (
    <div ref={ref} aria-label={label} className={s.stage} role='img'>
      <Chato className={clsx(s.stagePoster, isReady && s.stagePosterHidden)} pose='listen' />
      {tier !== 'off' && isActive && (
        <motion.div
          aria-hidden
          animate={{ opacity: isReady ? 1 : 0 }}
          className={s.stageCanvas}
          initial={{ opacity: 0 }}
          transition={HERO_STAGE_FADE}
        >
          <HeroCanvasBoundary>
            <ChatoCanvas
              eventSource={ref}
              isRunning={isRunning}
              tier={tier}
              onReady={() => setIsReady(true)}
            />
          </HeroCanvasBoundary>
        </motion.div>
      )}
    </div>
  );
};
