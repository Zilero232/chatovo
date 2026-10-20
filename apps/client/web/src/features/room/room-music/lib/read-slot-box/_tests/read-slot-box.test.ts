import { afterEach, describe, expect, it, vi } from 'vitest';

import { readSlotBox } from '../read-slot-box';

const RECT = { left: 10, top: 20, width: 160, height: 90 };

const mount = () => {
  const slot = document.createElement('span');
  const inner = document.createElement('img');
  const host = document.createElement('div');
  const cover = document.createElement('aside');

  slot.append(inner);
  document.body.append(slot, host, cover);
  vi.spyOn(slot, 'getBoundingClientRect').mockReturnValue(
    DOMRect.fromRect({ x: 10, y: 20, width: 160, height: 90 })
  );

  return { slot, inner, host, cover };
};

const hitTest = (element: Element | null) => {
  document.elementFromPoint = vi.fn(() => element);
};

describe('readSlotBox', () => {
  afterEach(() => {
    document.body.replaceChildren();
    vi.restoreAllMocks();
  });

  it('returns the slot box when the slot is on top', () => {
    const { slot, inner, host } = mount();

    hitTest(inner);

    expect(readSlotBox({ slot, host })).toEqual(RECT);
  });

  it('counts the raised player itself as uncovered', () => {
    const { slot, host } = mount();
    const frame = document.createElement('iframe');

    host.append(frame);
    hitTest(frame);

    expect(readSlotBox({ slot, host })).toEqual(RECT);
  });

  it('hides the player while something else covers the slot', () => {
    const { slot, host, cover } = mount();

    hitTest(cover);

    expect(readSlotBox({ slot, host })).toBeNull();
  });

  it('hides the player when there is no slot', () => {
    const { host } = mount();

    expect(readSlotBox({ slot: null, host })).toBeNull();
  });
});
