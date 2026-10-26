import { unique } from 'remeda';

import { CHAT_PANEL } from '../../../config';
import { wholeWordFilter } from './whole-word-filter';
import { wordFormFilter } from './word-form-filter';

const HIDDEN_MARK = /[\p{Cf}\p{Mn}]/gu;
const WORD = /[\p{L}\p{M}\p{N}\p{Cf}@$]+/gu;
const SPACED_LETTERS = /(?<![\p{L}\p{N}])\p{L}(?:[\s.\-_]{1,3}\p{L}){2,}(?![\p{L}\p{N}])/gu;
const SPACER = /[\s.\-_]/g;
const REPEATED_LETTER = /(\p{L})\1+/gu;

const { grawlix } = CHAT_PANEL.profanityFilter;

const isProfane = (word: string) => {
  const plain = word.replace(HIDDEN_MARK, '');
  const collapsed = plain.replace(REPEATED_LETTER, '$1');

  return (
    unique([word, plain, collapsed]).some((candidate) => wordFormFilter.check(candidate)) ||
    wholeWordFilter.exists(collapsed)
  );
};

const censorWord = (word: string) => (isProfane(word) ? grawlix : word);

const censorSpacedLetters = (letters: string) =>
  isProfane(letters.replace(SPACER, '')) ? grawlix : letters;

export const censorProfanity = (text: string): string =>
  wholeWordFilter
    .censor(text)
    .replace(SPACED_LETTERS, censorSpacedLetters)
    .replace(WORD, censorWord);
