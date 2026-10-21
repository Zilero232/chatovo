import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { describe, expect, it } from 'vitest';

import { remarkCensorProfanity } from '../remark-censor-profanity';

describe('remarkCensorProfanity', () => {
  it('masks text but keeps code and link targets intact', () => {
    const processor = unified().use(remarkParse).use(remarkCensorProfanity);
    const tree = processor.runSync(processor.parse('fuck `fuck` [fuck](https://x.dev/fuck)'));

    expect(JSON.stringify(tree)).toContain('"value":"***');
    expect(JSON.stringify(tree)).toContain('"value":"fuck"');
    expect(JSON.stringify(tree)).toContain('"url":"https://x.dev/fuck"');
  });
});
