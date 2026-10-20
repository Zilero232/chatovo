export const SeveredRingGlyph = ({ gradientId }: { gradientId: string }) => (
  <>
    <path d='M74 26 A48 48 0 1 1 40 108' opacity='0.75' strokeWidth='4' />
    <path d='M32 96 A48 48 0 0 1 46 40' opacity='0.3' strokeDasharray='4 9' strokeWidth='4' />
    <circle cx='74' cy='74' fill={`url(#${gradientId})`} opacity='0.5' r='7' stroke='none' />
  </>
);
