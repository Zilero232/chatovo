import BadWordsNext from 'bad-words-next';
import de from 'bad-words-next/lib/de';
import es from 'bad-words-next/lib/es';
import fr from 'bad-words-next/lib/fr';
import pl from 'bad-words-next/lib/pl';
import ruLatin from 'bad-words-next/lib/ru_lat';
import ua from 'bad-words-next/lib/ua';

import { CHAT_PANEL } from '../../../config';
import { ruWithNetspeak } from './extra-words';

export const wordFormFilter = new BadWordsNext({ placeholder: CHAT_PANEL.profanityFilter.grawlix });

[de, es, fr, pl, ruWithNetspeak, ruLatin, ua].forEach((data) => wordFormFilter.add(data));
