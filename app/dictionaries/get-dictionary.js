import 'server-only'

const dictionaries = {
    en: () => import('./en.json').then((module) => module.default),
    es: () => import('./es.json').then((module) => module.default),
    fr: () => import('./fr.json').then((module) => module.default),
    ar: () => import('./ar.json').then((module) => module.default),
    de: () => import('./de.json').then((module) => module.default),
    ru: () => import('./ru.json').then((module) => module.default),
    ja: () => import('./ja.json').then((module) => module.default),
    zh: () => import('./zh.json').then((module) => module.default),
}

export const getDictionary = async (locale) => dictionaries[locale]()
