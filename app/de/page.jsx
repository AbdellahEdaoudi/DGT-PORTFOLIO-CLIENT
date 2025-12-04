import LandingPage from "../Components/LandingPage/LandingPage"
import { getDictionary } from "../dictionaries/get-dictionary"

export const metadata = {
    title: "Erstellen Sie Ihr professionelles Portfolio online - DGT Portfolio | Kein Code",
    description: "Kein Code, kein Aufwand. Erstellen Sie in wenigen Minuten ein sauberes, modernes Portfolio. Präsentieren Sie Ihre Karriere, Fähigkeiten, Projekte und Arbeitslinks wie nie zuvor. 7 Tage kostenlose Testversion. Holen Sie sich heute Ihre benutzerdefinierte Subdomain!",
    keywords: ["Portfolio-Ersteller", "Online-Portfolio", "professionelles Portfolio", "Portfolio ohne Code", "Portfolio-Website", "Portfolio erstellen", "Portfolio-Generator", "benutzerdefinierte Subdomain", "QR-Code-Portfolio", "kostenloses Portfolio", "Portfolio-Vorlagen", "digitales Portfolio"],
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
        title: "Erstellen Sie Ihr professionelles Portfolio online - DGT Portfolio",
        description: "Kein Code, kein Aufwand. Erstellen Sie in wenigen Minuten ein sauberes, modernes Portfolio. Präsentieren Sie Ihre Karriere, Fähigkeiten, Projekte und Arbeitslinks wie nie zuvor.",
        url: "https://dgtportfolio.com/de",
        siteName: "DGT Portfolio",
        locale: "de_DE",
        type: "website",
        images: [
            {
                url: "https://dgtportfolio.com/logo.png",
                alt: "DGT Portfolio - Professioneller Portfolio-Ersteller",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Erstellen Sie Ihr professionelles Portfolio online - DGT Portfolio",
        description: "Kein Code, kein Aufwand. Erstellen Sie in wenigen Minuten ein sauberes, modernes Portfolio.",
        images: ["https://dgtportfolio.com/logo.png"],
        creator: "@dgtportfolio",
    },
    alternates: {
        canonical: "https://dgtportfolio.com/de",
        languages: {
            'en': 'https://dgtportfolio.com/en',
            'es': 'https://dgtportfolio.com/es',
            'fr': 'https://dgtportfolio.com/fr',
            'ar': 'https://dgtportfolio.com/ar',
            'de': 'https://dgtportfolio.com/de',
            'ru': 'https://dgtportfolio.com/ru',
            'ja': 'https://dgtportfolio.com/ja',
            'zh': 'https://dgtportfolio.com/zh',
        },
    },
}

export default async function Page() {
    const dict = await getDictionary('de');
    return <LandingPage dict={dict} />
}
