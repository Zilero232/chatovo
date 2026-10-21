import type { IsUncoveredInput, ReadSlotBoxInput, SlotBox } from './read-slot-box.types';

const VIEWPORT_SELECTOR = '[data-music-viewport]';

const isUncovered = ({ slot, host, x, y }: IsUncoveredInput): boolean => {
  const hit = document.elementFromPoint(x, y);

  return hit !== null && (slot?.contains(hit) === true || host.contains(hit));
};

const readClip = (slot: HTMLElement, rect: DOMRect) => {
  const viewport = slot.closest<HTMLElement>(VIEWPORT_SELECTOR);

  if (!viewport) {
    return { clipTop: 0, clipBottom: 0, isPassive: false };
  }

  const bounds = viewport.getBoundingClientRect();

  return {
    clipTop: Math.max(0, bounds.top - rect.top),
    clipBottom: Math.max(0, rect.bottom - bounds.bottom),
    isPassive: viewport.dataset.musicViewport === 'scroll'
  };
};

export const readSlotBox = ({ slot, host }: ReadSlotBoxInput): SlotBox | null => {
  const rect = slot?.getBoundingClientRect();

  if (!slot || !rect || rect.width === 0) {
    return null;
  }

  const { clipTop, clipBottom, isPassive } = readClip(slot, rect);
  const visibleHeight = rect.height - clipTop - clipBottom;

  if (visibleHeight <= 0) {
    return null;
  }

  const x = rect.left + rect.width / 2;
  const y = rect.top + clipTop + visibleHeight / 2;

  if (!isUncovered({ slot, host, x, y })) {
    return null;
  }

  return {
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
    clipTop,
    clipBottom,
    isPassive
  };
};
