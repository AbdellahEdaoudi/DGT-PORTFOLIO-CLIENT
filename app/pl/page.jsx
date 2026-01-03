import LandingPage from "../Components/LandingPage/LandingPage"
import { getDictionary } from "../dictionaries/get-dictionary"

export const metadata = {
    title: "Zbuduj Swoje Osobiste Portfolio Online - DGT Portfolio | Bez Kodu",
    description: "Bez kodu, bez problemów. Stwórz nowoczesne i czyste portfolio w kilka minut. Zaprezentuj swoją karierę, umiejętności, projekty i linki do pracy jak nigdy dotąd. Bezpłatny 7-dniowy okres próbny. Zdobądź swoją niestandardową subdomenę już dziś!",
    keywords: ["kreator portfolio", "portfolio online", "osobiste portfolio", "portfolio bez kodu", "strona portfolio", "stwórz portfolio", "twórca portfolio", "niestandardowa subdomena", "portfolio z kodem QR", "darmowe portfolio", "szablony portfolio", "cyfrowe portfolio"],
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
        title: "Zbuduj Swoje Osobiste Portfolio Online - DGT Portfolio",
        description: "Bez kodu, bez problemów. Stwórz nowoczesne i czyste portfolio w kilka minut. Zaprezentuj swoją karierę, umiejętności, projekty i linki do pracy jak nigdy dotąd.",
        url: "https://dgtportfolio.com/pl",
        siteName: "DGT Portfolio",
        locale: "pl_PL",
        type: "website",
        images: [
            {
                url: "https://dgtportfolio.com/logo.png",
                alt: "DGT Portfolio - Kreator Osobistego Portfolio",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Zbuduj Swoje Osobiste Portfolio Online - DGT Portfolio",
        description: "Bez kodu, bez problemów. Stwórz nowoczesne i czyste portfolio w kilka minut.",
        images: ["https://dgtportfolio.com/logo.png"],
        creator: "@dgtportfolio",
    },
    alternates: {
        canonical: "https://dgtportfolio.com/pl",
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
            'id': 'https://dgtportfolio.com/id',
            'pl': 'https://dgtportfolio.com/pl',
        },
    },
}

export default async function Page() {
    const dict = await getDictionary('pl');
    return <LandingPage dict={dict} />
}
