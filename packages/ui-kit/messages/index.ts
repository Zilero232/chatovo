import de from './de.json';
import en from './en.json';
import es from './es.json';
import fr from './fr.json';
import pl from './pl.json';
import pt from './pt.json';
import ru from './ru.json';
import tr from './tr.json';
import uk from './uk.json';

/** The `ui` namespace each app spreads into its i18n messages (next-intl on the site, use-intl in the web app). */
export const uiMessages = { en, ru, uk, es, pt, de, fr, tr, pl } as const;
