import confetti from 'canvas-confetti';

const BRAND_COLORS = ['#a855f7', '#22d3ee', '#f472b6', '#fbbf24', '#4ade80'];

export const fireConfetti = () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const shared = {
    colors: BRAND_COLORS,
    disableForReducedMotion: true,
    particleCount: 90,
    spread: 70,
    startVelocity: 55,
    zIndex: 90
  };

  confetti({ ...shared, angle: 60, origin: { x: 0, y: 0.9 } });
  confetti({ ...shared, angle: 120, origin: { x: 1, y: 0.9 } });
};
