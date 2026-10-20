import type { IsUncoveredInput, ReadSlotBoxInput, SlotBox } from './read-slot-box.types';

const isUncovered = ({ slot, host, rect }: IsUncoveredInput): boolean => {
  const hit = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);

  return hit !== null && (slot?.contains(hit) === true || host.contains(hit));
};

export const readSlotBox = ({ slot, host }: ReadSlotBoxInput): SlotBox | null => {
  const rect = slot?.getBoundingClientRect();

  if (!rect || rect.width === 0 || !isUncovered({ slot, host, rect })) {
    return null;
  }

  return { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
};
