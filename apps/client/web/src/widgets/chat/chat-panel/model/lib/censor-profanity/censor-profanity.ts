import type { Root } from 'mdast';

import { Profanity } from '@2toad/profanity';
import { flatWords } from 'russian-bad-words';
import { visit } from 'unist-util-visit';

const profanity = new Profanity({
  languages: ['en', 'ru', 'de', 'es', 'fr', 'pt'],
  wholeWord: true,
  unicodeWordBoundaries: true,
  grawlix: '***'
});

profanity.addWords(flatWords);

export const censorProfanity = (text: string): string => profanity.censor(text);

export const remarkCensorProfanity = () => (tree: Root) => {
  visit(tree, 'text', (node) => {
    node.value = censorProfanity(node.value);
  });
};
