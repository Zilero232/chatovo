'use client';

import {
  useConnectionQualityIndicator,
  useConnectionState,
  useLocalParticipant
} from '@livekit/components-react';
import { clsx } from 'clsx';
import { ConnectionState } from 'livekit-client';
import { useTranslations } from 'next-intl';
import { isNonNullish } from 'remeda';

import { barsFromQuality, barsFromRtt } from '../../../lib';
import { useConnectionRtt } from '../../../model/hooks';

import s from './ConnectionIndicator.module.scss';

const BAR_HEIGHTS = [4, 7, 10, 13, 16] as const;

const barToneClass = {
  good: s.barGood,
  fair: s.barFair,
  poor: s.barPoor
} as const;

const toneFromBars = (bars: number) => {
  if (bars >= 4) {
    return 'good';
  }

  if (bars >= 2) {
    return 'fair';
  }

  return 'poor';
};

export const ConnectionIndicator = () => {
  const t = useTranslations('room.connection');

  const { localParticipant } = useLocalParticipant();
  const { quality } = useConnectionQualityIndicator({ participant: localParticipant });
  const connectionState = useConnectionState();
  const { rtt } = useConnectionRtt();

  if (connectionState !== ConnectionState.Connected) {
    return null;
  }

  const hasRtt = isNonNullish(rtt);
  const bars = hasRtt ? barsFromRtt(rtt) : barsFromQuality(quality);
  const tone = toneFromBars(bars);
  const label = hasRtt ? t('ping', { ms: rtt }) : t('measuring');

  return (
    <div aria-label={label} className={s.root} role='img' title={label}>
      <div className={s.bars}>
        {BAR_HEIGHTS.map((height, index) => (
          <span
            // eslint-disable-next-line react/no-array-index-key -- fixed-length static list
            key={index}
            className={clsx(s.bar, index < bars ? barToneClass[tone] : s.barInactive)}
            style={{ height }}
          />
        ))}
      </div>

      {hasRtt && <span className={s.ping}>{rtt}&nbsp;ms</span>}
    </div>
  );
};
