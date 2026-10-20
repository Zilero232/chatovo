import { describe, expect, it } from 'vitest';

import { findPreviewUrl } from '../find-preview-url';

describe('findPreviewUrl', () => {
  it('finds a bare url', () => {
    expect(findPreviewUrl('глянь https://github.com/oven-sh/bun')).toBe(
      'https://github.com/oven-sh/bun'
    );
  });

  it('leaves trailing punctuation out of the url', () => {
    expect(findPreviewUrl('see https://example.com/page.')).toBe('https://example.com/page');
  });

  it('keeps balanced parentheses that belong to the url', () => {
    expect(findPreviewUrl('https://en.wikipedia.org/wiki/Rust_(language)')).toBe(
      'https://en.wikipedia.org/wiki/Rust_(language)'
    );
  });

  it('finds the target of a markdown link', () => {
    expect(findPreviewUrl('[docs](https://bun.sh/docs)')).toBe('https://bun.sh/docs');
  });

  it('takes the first link when there are several', () => {
    expect(findPreviewUrl('https://a.example https://b.example')).toBe('https://a.example');
  });

  it('expands a www link the way the chat renders it', () => {
    expect(findPreviewUrl('www.example.com')).toBe('http://www.example.com');
  });

  it('ignores a url inside inline code', () => {
    expect(findPreviewUrl('run `curl https://example.com`')).toBeNull();
  });

  it('ignores a url inside a code block', () => {
    expect(findPreviewUrl('```\nhttps://example.com\n```')).toBeNull();
  });

  it('ignores a mailto link', () => {
    expect(findPreviewUrl('write to user@example.com')).toBeNull();
  });

  it('returns null for plain text', () => {
    expect(findPreviewUrl('привет')).toBeNull();
  });
});
