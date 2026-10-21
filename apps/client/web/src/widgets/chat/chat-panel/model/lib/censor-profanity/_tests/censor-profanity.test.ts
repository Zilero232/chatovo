import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { describe, expect, it } from 'vitest';

import { censorProfanity, remarkCensorProfanity } from '../censor-profanity';

describe('censorProfanity', () => {
  it.each([
    ['what the fuck', 'what the ***'],
    ['ну ты и блядь', 'ну ты и ***'],
    ['иди нахуй отсюда', 'иди *** отсюда'],
    ['Scheiße passiert', '*** passiert']
  ])('masks %s', (text, expected) => {
    expect(censorProfanity(text)).toBe(expected);
  });

  it.each(['Привет, как дела?', 'classic assassin', 'Scunthorpe'])('leaves %s alone', (text) => {
    expect(censorProfanity(text)).toBe(text);
  });
});

describe('remarkCensorProfanity', () => {
  it('masks text but keeps code and link targets intact', () => {
    const processor = unified().use(remarkParse).use(remarkCensorProfanity);
    const tree = processor.runSync(processor.parse('fuck `fuck` [fuck](https://x.dev/fuck)'));

    expect(JSON.stringify(tree)).toContain('"value":"***');
    expect(JSON.stringify(tree)).toContain('"value":"fuck"');
    expect(JSON.stringify(tree)).toContain('"url":"https://x.dev/fuck"');
  });
});
