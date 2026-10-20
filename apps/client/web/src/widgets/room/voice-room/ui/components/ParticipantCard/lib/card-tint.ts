import type { CSSProperties } from 'react';

export const getCardTint = (color: string | null | undefined): CSSProperties | undefined => {
  if (!color) {
    return undefined;
  }

  return {
    backgroundImage: `linear-gradient(to bottom right, ${color}33, ${color}14 45%, transparent 75%)`
  };
};
