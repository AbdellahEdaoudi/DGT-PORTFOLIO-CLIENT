import LandingPage from "../Components/LandingPage/LandingPage"
import { getDictionary } from "../dictionaries/get-dictionary"

export const metadata = {
    title: "Créez votre portfolio professionnel en ligne - DGT Portfolio | Sans Code",
    description: "Sans code, sans tracas. Créez un portfolio propre et moderne en quelques minutes. Présentez votre carrière, vos compétences, vos projets et vos liens professionnels comme jamais auparavant. Essai gratuit de 7 jours. Obtenez votre sous-domaine personnalisé aujourd'hui!",
    keywords: ["créateur de portfolio", "portfolio en ligne", "portfolio professionnel", "portfolio sans code", "site web portfolio", "créer portfolio", "générateur de portfolio", "sous-domaine personnalisé", "portfolio code QR", "portfolio gratuit", "modèles portfolio", "portfolio numérique"],
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
        title: "Créez votre portfolio professionnel en ligne - DGT Portfolio",
        description: "Sans code, sans tracas. Créez un portfolio propre et moderne en quelques minutes. Présentez votre carrière, vos compétences, vos projets et vos liens professionnels comme jamais auparavant.",
        url: "https://dgtportfolio.com/fr",
        siteName: "DGT Portfolio",
        locale: "fr_FR",
        type: "website",
        images: [
            {
                url: "https://dgtportfolio.com/logo.png",
                alt: "DGT Portfolio - Créateur de Portfolio Professionnel",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Créez votre portfolio professionnel en ligne - DGT Portfolio",
        description: "Sans code, sans tracas. Créez un portfolio propre et moderne en quelques minutes.",
        images: ["https://dgtportfolio.com/logo.png"],
        creator: "@dgtportfolio",
    },
    alternates: {
        canonical: "https://dgtportfolio.com/fr",
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
    const dict = await getDictionary('fr');
    return <LandingPage dict={dict} />
}
