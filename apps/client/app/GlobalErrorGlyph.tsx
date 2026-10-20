const LEFT_BARS = [16, 30, 22, 44];
const RIGHT_BARS = [40, 20, 32, 14];

const CORAL = '#ff7a59';
const SUBTLE = '#a092aa';

const Bars = ({ bars, startX, fadeIn }: { bars: number[]; fadeIn: boolean; startX: number }) => (
  <>
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
  </>
);

export const GlobalErrorGlyph = () => (
  <svg
    aria-hidden
    fill='none'
    focusable='false'
    height='96'
    viewBox='0 0 148 148'
    width='96'
    xmlns='http://www.w3.org/2000/svg'
  >
    <g stroke={CORAL} strokeLinecap='round' strokeWidth='5'>
      <Bars fadeIn bars={LEFT_BARS} startX={20} />
      <Bars bars={RIGHT_BARS} fadeIn={false} startX={89} />

      <line
        opacity='0.7'
        stroke={SUBTLE}
        strokeDasharray='4 7'
        strokeWidth='2'
        x1='79'
        x2='79'
        y1='36'
        y2='112'
      />
    </g>
  </svg>
);
