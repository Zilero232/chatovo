import type { Link } from 'mdast';

import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { EXIT, visit } from 'unist-util-visit';

const markdownParser = unified().use(remarkParse).use(remarkGfm);

const isWebUrl = (url: string): boolean => /^https?:\/\//i.test(url);

export const findPreviewUrl = (markdown: string): string | null => {
  let previewUrl: string | null = null;

  visit(markdownParser.parse(markdown), 'link', (link: Link) => {
    if (!isWebUrl(link.url)) {
      return undefined;
    }

    previewUrl = link.url;

    return EXIT;
  });

  return previewUrl;
};
