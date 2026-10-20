export type SlotBox = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export const readSlotBox = (slot: HTMLElement | null): SlotBox | null => {
  const rect = slot?.getBoundingClientRect();

  if (!rect || rect.width === 0) {
    return null;
  }

  return { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
};
