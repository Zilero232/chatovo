import { ImageResponse } from 'next/og';

import { SITE } from '@/shared/config';

export const dynamic = 'force-static';
export const alt = SITE.title;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const COLORS = {
  background: '#16111b',
  surface: '#1f1826',
  cream: '#f5ecdf',
  muted: '#b8acbf',
  coral: '#ff7a59',
  sun: '#ffcf5c',
  plum: '#6a4dff',
  ink: '#3a2850',
  ear: '#ff9f86'
};

const ChatoListening = () => (
  <svg height='420' viewBox='0 0 200 200' width='420' xmlns='http://www.w3.org/2000/svg'>
    <ellipse cx='100' cy='188' fill='#08040a' opacity='0.4' rx='58' ry='7' />
    <path
      d='M134 170 Q182 164 174 126 Q170 110 158 116'
      fill='none'
      stroke={COLORS.cream}
      strokeLinecap='round'
      strokeWidth='14'
    />
    <path d='M62 182 Q50 98 100 92 Q150 98 138 182 Q100 190 62 182 Z' fill={COLORS.cream} />
    <ellipse cx='100' cy='150' fill='#fff8ec' rx='25' ry='24' />
    <g transform='translate(27.5 -22) scale(1.45)'>
      <path d='M21 41 Q18 16 35 23 Q43 27 45 40 Z' fill={COLORS.cream} />
      <path d='M79 41 Q82 16 65 23 Q57 27 55 40 Z' fill={COLORS.cream} />
      <path d='M27 37 Q26 24 34 28 Q39 31 40 39 Z' fill={COLORS.ear} />
      <path d='M73 37 Q74 24 66 28 Q61 31 60 39 Z' fill={COLORS.ear} />
      <path
        d='M50 30 Q79 30 79 56 Q79 76 64 82 Q57 80 50 82 Q43 80 36 82 Q21 76 21 56 Q21 30 50 30 Z'
        fill={COLORS.cream}
      />
      <path
        d='M34 56 Q40 49 46 56 M54 56 Q60 49 66 56 M42 70 Q50 78 58 70'
        fill='none'
        stroke={COLORS.ink}
        strokeLinecap='round'
        strokeWidth='4'
      />
      <path d='M50 61 L45.5 67 H54.5 Z' fill={COLORS.ink} />
      <path
        d='M22 50 Q20 14 50 14 Q80 14 78 50'
        fill='none'
        stroke={COLORS.coral}
        strokeLinecap='round'
        strokeWidth='5'
      />
      <rect fill={COLORS.coral} height='22' rx='6' width='13' x='13' y='44' />
      <rect fill={COLORS.coral} height='22' rx='6' width='13' x='74' y='44' />
    </g>
  </svg>
);

const Image = () =>
  new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '80px 96px',
        background: COLORS.background,
        backgroundImage:
          'radial-gradient(900px 420px at 50% -10%, rgba(255,122,89,0.16), transparent 70%)'
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '640px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: COLORS.plum
            }}
          />
          <div style={{ fontSize: '40px', fontWeight: 700, color: COLORS.cream }}>{SITE.name}</div>
        </div>

        <div
          style={{
            marginTop: '40px',
            fontSize: '72px',
            fontWeight: 800,
            lineHeight: 1.04,
            letterSpacing: '-0.02em',
            color: COLORS.cream
          }}
        >
          Voice rooms for your people
        </div>

        <div
          style={{
            marginTop: '28px',
            fontSize: '30px',
            lineHeight: 1.4,
            color: COLORS.muted
          }}
        >
          Create a room, send the link, talk — with video, screen sharing and music for everyone.
        </div>

        <div
          style={{
            display: 'flex',
            marginTop: '40px',
            padding: '14px 30px',
            borderRadius: '999px',
            background: COLORS.coral,
            color: '#2a1015',
            fontSize: '28px',
            fontWeight: 700,
            alignSelf: 'flex-start'
          }}
        >
          chatovo.ru
        </div>
      </div>

      <ChatoListening />
    </div>,
    size
  );

export default Image;
