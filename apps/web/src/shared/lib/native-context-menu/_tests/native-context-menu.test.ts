import { afterEach, describe, expect, it } from 'vitest';

import { allowsNativeContextMenu } from '../native-context-menu';

const mount = (html: string) => {
  document.body.innerHTML = html;

  return document.body;
};

afterEach(() => {
  window.getSelection()?.removeAllRanges();
  document.body.innerHTML = '';
});

describe('allowsNativeContextMenu', () => {
  it('keeps the native menu in a text field', () => {
    const root = mount('<label><input id="field" /></label>');

    expect(allowsNativeContextMenu(root.querySelector('#field'))).toBe(true);
  });

  it('keeps the native menu inside a contenteditable editor', () => {
    const root = mount('<div contenteditable="true"><span id="word">hi</span></div>');

    expect(allowsNativeContextMenu(root.querySelector('#word'))).toBe(true);
  });

  it('keeps the native menu while text is selected, so it can be copied', () => {
    const root = mount('<p id="text">hello world</p>');
    const range = document.createRange();

    range.selectNodeContents(root.querySelector('#text') as Node);
    window.getSelection()?.addRange(range);

    expect(allowsNativeContextMenu(root.querySelector('#text'))).toBe(true);
  });

  it('suppresses it on plain page content', () => {
    const root = mount('<div id="card">Nobody is online</div>');

    expect(allowsNativeContextMenu(root.querySelector('#card'))).toBe(false);
  });

  it('suppresses it inside an element that opted out of editing', () => {
    const root = mount('<div contenteditable="false"><span id="label">x</span></div>');

    expect(allowsNativeContextMenu(root.querySelector('#label'))).toBe(false);
  });

  it('suppresses it when there is no target', () => {
    expect(allowsNativeContextMenu(null)).toBe(false);
  });
});
