import type { Data } from 'bad-words-next';

import ru from 'bad-words-next/lib/ru';

export const ruWithNetspeak: Data = {
  ...ru,
  lookalike: { ...ru.lookalike, 9: 'я', d: 'д', u: 'и', z: 'з' },
  words: [
    ...ru.words,
    'черножоп*',
    'ябал*',
    'ябан*',
    'мудак*',
    'мудил*',
    'мудозвон*',
    'чурк*',
    'нигер*',
    'ниггер*',
    'жидов*',
    'жидяр*'
  ]
};
