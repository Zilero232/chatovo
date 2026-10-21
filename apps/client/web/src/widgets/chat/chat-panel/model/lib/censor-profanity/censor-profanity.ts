import { wholeWordFilter } from './whole-word-filter';
import { wordFormFilter } from './word-form-filter';

export const censorProfanity = (text: string): string =>
  wordFormFilter.filter(wholeWordFilter.censor(text));
