export type SlotBox = {
  left: number;
  top: number;
  width: number;
  height: number;
  clipTop: number;
  clipBottom: number;
  isPassive: boolean;
};

export type ReadSlotBoxInput = {
  slot: HTMLElement | null;
  host: HTMLElement;
};

export type IsUncoveredInput = ReadSlotBoxInput & {
  x: number;
  y: number;
};
