import { Profanity } from '@2toad/profanity';
import pt from 'naughty-words/pt.json';
import tr from 'naughty-words/tr.json';

import { CHAT_PANEL } from '../../../config';

const { grawlix, ordinaryInAnotherLanguage } = CHAT_PANEL.profanityFilter;

export const wholeWordFilter = new Profanity({
  languages: ['en'],
  wholeWord: true,
  unicodeWordBoundaries: true,
  grawlix
});

wholeWordFilter.addWords([...pt, ...tr]);
wholeWordFilter.whitelist.addWords(ordinaryInAnotherLanguage);
