'use client';

import { useIsMuted, VideoTrack } from '@livekit/components-react';
import { target, useEventListener } from '@siberiacancode/reactuse';
import { clsx } from 'clsx';
import { Expand, Shrink } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { createPortal } from 'react-dom';

import { useAppSettings } from '@/entities/app/settings';

import type { CardVideoProps } from './CardVideo.types';

import s from './CardVideo.module.scss';

export const CardVideo = ({ trackRef }: CardVideoProps) => {
  const t = useTranslations('room');

  const muted = useIsMuted(trackRef);

  const { settings } = useAppSettings();

  const [isExpanded, setIsExpanded] = useState(false);

  const isMirrored = trackRef.participant.isLocal && settings.video.mirrorVideo;

  const videoClassName = clsx(s.video, { [s.videoMirrored]: isMirrored });
  const expandedVideoClassName = clsx(s.video, s.videoContain, {
    [s.videoMirrored]: isMirrored
  });

  useEventListener(target(window), 'keydown', (event) => {
    if (event.key === 'Escape') {
      setIsExpanded(false);
    }
  });

  const toggle = () => {
    setIsExpanded((prev) => !prev);
  };

  if (muted) {
    return null;
  }

  return (
    <>
      <button
        aria-expanded={isExpanded}
        aria-label={t('expandVideo')}
        className={s.pane}
        type='button'
        onClick={toggle}
      >
        {!isExpanded && <VideoTrack className={videoClassName} trackRef={trackRef} />}
        <span className={s.fullscreenHint}>
          <Expand aria-hidden className={s.hintIcon} />
        </span>
      </button>

      {isExpanded &&
        createPortal(
          <button
            aria-expanded
            aria-label={t('collapseVideo')}
            className={s.overlay}
            type='button'
            onClick={toggle}
          >
            <VideoTrack className={expandedVideoClassName} trackRef={trackRef} />
            <span className={s.fullscreenHint}>
              <Shrink aria-hidden className={s.hintIcon} />
            </span>
          </button>,
          document.body
        )}
    </>
  );
};
