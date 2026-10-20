import { WAVE_LEFT_BARS, WAVE_RIGHT_BARS } from '../../ErrorGlyph.constants';

import s from '../../ErrorGlyph.module.scss';

const WaveBars = ({
  bars,
  startX,
  fadeIn
}: {
  bars: number[];
  fadeIn: boolean;
  startX: number;
}) => (
  <g strokeWidth='5'>
    {bars.map((height, index) => {
      const x = startX + index * 13;

      return (
        <line
          key={x}
          opacity={fadeIn ? 0.35 + index * 0.15 : 0.8 - index * 0.15}
          x1={x}
          x2={x}
          y1={74 - height / 2}
          y2={74 + height / 2}
        />
      );
    })}
  </g>
);

export const BrokenWaveGlyph = () => (
  <>
    <WaveBars fadeIn bars={WAVE_LEFT_BARS} startX={20} />
    <WaveBars bars={WAVE_RIGHT_BARS} fadeIn={false} startX={89} />

    <line
      className={s.break}
      opacity='0.55'
      strokeDasharray='4 7'
      strokeWidth='2'
      x1='79'
      x2='79'
      y1='36'
      y2='112'
    />
  </>
);
