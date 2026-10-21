import { describe, expect, it } from 'vitest';

import { censorProfanity } from '../censor-profanity';

describe('censorProfanity', () => {
  it.each([
    ['what the fuck', 'what the ***'],
    ['ну ты и блядь', 'ну ты и ***'],
    ['иди нахуй отсюда', 'иди *** отсюда'],
    ['Scheiße passiert', '*** passiert'],
    ['вы все пидоры', 'вы все ***'],
    ['ПИДОР', '***'],
    ['пидoр', '***'],
    ['нахуя ты так', '*** ты так'],
    ['ёбаный стыд', '*** стыд'],
    ['уёбок', '***'],
    ['блядский день', '*** день'],
    ['хуёвый план', '*** план'],
    ['яке хуйло', 'яке ***'],
    ['kurwa mać', '*** mać'],
    ['que porra é essa', 'que *** é essa'],
    ['hijo de puta', 'hijo de ***'],
    ['du Arschloch', 'du ***'],
    ['quel connard', 'quel ***'],
    ['siktir git', '*** git'],
    ['first line\nну блядь', 'first line\nну ***']
  ])('masks %s', (text, expected) => {
    expect(censorProfanity(text)).toBe(expected);
  });

  it.each([
    'Привет, как дела?',
    'classic assassin',
    'Scunthorpe',
    'I am here, mama said no',
    'небо и хлеб для себя',
    'сабля за два рубля с корабля',
    'мудрый командир ест мандарин',
    'Ich habe Lust, Huhn und Eier, so ein Mist',
    'les gens pour toi, feu doux',
    'não sei, mais tarde, pão e bolo',
    'no sé, con el dedo',
    'merhaba, ama bugün götürmek zor',
    'dzień dobry, jak się masz'
  ])('leaves %s alone', (text) => {
    expect(censorProfanity(text)).toBe(text);
  });
});
