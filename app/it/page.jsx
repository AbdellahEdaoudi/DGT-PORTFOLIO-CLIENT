import LandingPage from "../Components/LandingPage/LandingPage"
import { getDictionary } from "../dictionaries/get-dictionary"

export const metadata = {
    title: "Costruisci il tuo portfolio personale online - DGT Portfolio | Nessun codice",
    description: "Nessun codice, nessun problema. Costruisci un portfolio pulito e moderno in pochi minuti. Mostra la tua carriera, competenze, progetti e link di lavoro come mai prima d'ora. Prova gratuita per 7 giorni. Ottieni il tuo sottodominio personalizzato oggi!",
    keywords: ["costruttore di portfolio", "portfolio online", "portfolio personale", "portfolio senza codice", "sito web portfolio", "crea portfolio", "generatore di portfolio", "sottodominio personalizzato", "portfolio codice QR", "portfolio gratuito", "modelli portfolio", "portfolio digitale"],
    authors: [{ name: "DGT Portfolio" }],
    creator: "DGT Portfolio",
    publisher: "DGT Portfolio",
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    openGraph: {
        title: "Costruisci il tuo portfolio personale online - DGT Portfolio",
        description: "Nessun codice, nessun problema. Costruisci un portfolio pulito e moderno in pochi minuti. Mostra la tua carriera, competenze, progetti e link di lavoro come mai prima d'ora.",
        url: "https://dgtportfolio.com/it",
        siteName: "DGT Portfolio",
        locale: "it_IT",
        type: "website",
        images: [
            {
                url: "https://dgtportfolio.com/logo.png",
                alt: "DGT Portfolio - Costruttore di Portfolio Personale",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Costruisci il tuo portfolio personale online - DGT Portfolio",
        description: "Nessun codice, nessun problema. Costruisci un portfolio pulito e moderno in pochi minuti.",
        images: ["https://dgtportfolio.com/logo.png"],
        creator: "@dgtportfolio",
    },
    alternates: {
        canonical: "https://dgtportfolio.com/it",
        languages: {
            'en': 'https://dgtportfolio.com/en',
            'es': 'https://dgtportfolio.com/es',
            'fr': 'https://dgtportfolio.com/fr',
            'ar': 'https://dgtportfolio.com/ar',
            'de': 'https://dgtportfolio.com/de',
            'ru': 'https://dgtportfolio.com/ru',
            'ja': 'https://dgtportfolio.com/ja',
            'zh': 'https://dgtportfolio.com/zh',
            'nl': 'https://dgtportfolio.com/nl',
            'pt': 'https://dgtportfolio.com/pt',
            'it': 'https://dgtportfolio.com/it',
            'hi': 'https://dgtportfolio.com/hi',
            'tr': 'https://dgtportfolio.com/tr',
            'ko': 'https://dgtportfolio.com/ko',
        },
    },
}

export default async function Page() {
    const dict = await getDictionary('it');
    return <LandingPage dict={dict} />
}
