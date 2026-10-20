import { describe, expect, it } from 'vitest';

import { isTypingTarget } from '../is-typing-target';

describe('isTypingTarget', () => {
  it('treats a text input as typing, so a shortcut does not swallow the key', () => {
    expect(isTypingTarget(document.createElement('input'))).toBe(true);
  });

  it('treats a textarea as typing', () => {
    expect(isTypingTarget(document.createElement('textarea'))).toBe(true);
  });

  it('treats a contenteditable element as typing', () => {
    const node = document.createElement('div');

    Object.defineProperty(node, 'isContentEditable', { value: true });

    expect(isTypingTarget(node)).toBe(true);
  });

  it('leaves a plain element free for shortcuts', () => {
    expect(isTypingTarget(document.createElement('div'))).toBe(false);
  });

  it('handles a missing target instead of throwing', () => {
    expect(isTypingTarget(null)).toBe(false);
  });
});
