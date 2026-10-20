export type SlotBox = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export type ReadSlotBoxInput = {
  slot: HTMLElement | null;
  host: HTMLElement;
};

export type IsUncoveredInput = ReadSlotBoxInput & {
  rect: DOMRect;
};
