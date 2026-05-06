
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

export const getOthersTranslation = (lang) => {
    return dictionaries[lang] || dictionaries['en'];
};

export const getTranslation = (lang) => {
    const dict = dictionaries[lang] || dictionaries['en'];
    return (key) => key.split('.').reduce((obj, k) => (obj || {})[k], dict) || key;
};
