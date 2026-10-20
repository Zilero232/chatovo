import { SIGNAL_ARCS } from '../../ErrorGlyph.constants';

export const LostSignalGlyph = ({ gradientId }: { gradientId: string }) => (
  <>
    {SIGNAL_ARCS.map((d, index) => (
      <path
        key={d}
        d={d}
        opacity={0.7 - index * 0.2}
        strokeDasharray={index === 0 ? undefined : '5 8'}
        strokeWidth='4'
      />
    ))}

    <circle cx='74' cy='86' fill={`url(#${gradientId})`} r='6' stroke='none' />

    <line opacity='0.75' strokeWidth='4' x1='36' x2='112' y1='112' y2='36' />
  </>
);
