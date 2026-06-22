import en from './en.json';
import ar from './ar.json';
import es from './es.json';
import fr from './fr.json';
import ru from './ru.json';
import ja from './ja.json';
import zh from './zh.json';
import de from './de.json';
import nl from './nl.json';
import pt from './pt.json';
import it from './it.json';
import hi from './hi.json';
import tr from './tr.json';
import ko from './ko.json';
import id from './id.json';
import pl from './pl.json';
import sv from './sv.json';
import vi from './vi.json';

const dictionaries = {
    en, ar, es, fr, ru, ja, zh, de, nl, pt, it, hi, tr, ko, id, pl, sv, vi
};

/**
 * Get the full translation object for the given language.
 * Falls back to English if the language is not found.
 * @param {string} lang - Language code (e.g. 'ar', 'en')
 * @returns {object} Translation object with keys: waitTitle, title, loading, cancel, sections, pdf, ...
 */
export const getDownloadCvTranslation = (lang) => {
    return dictionaries[lang] || dictionaries['en'];
};
