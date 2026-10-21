import type { Root } from 'mdast';

import { visit } from 'unist-util-visit';

import { censorProfanity } from '../censor-profanity';

export const remarkCensorProfanity = () => (tree: Root) => {
  visit(tree, 'text', (node) => {
    node.value = censorProfanity(node.value);
  });
};
