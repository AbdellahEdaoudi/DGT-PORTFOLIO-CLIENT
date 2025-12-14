import LandingPage from "../Components/LandingPage/LandingPage"
import { getDictionary } from "../dictionaries/get-dictionary"

export const metadata = {
    title: "Bouw je persoonlijke portfolio online - DGT Portfolio | Geen code vereist",
    description: "Geen code, geen gedoe. Bouw in enkele minuten een schoon, modern portfolio. Toon uw carrière, vaardigheden, projecten en werklinks als nooit tevoren. Gratis proefperiode van 7 dagen. Ontvang vandaag nog uw aangepaste subdomein!",
    keywords: ["portfolio bouwer", "online portfolio", "persoonlijk portfolio", "geen code portfolio", "portfolio website", "portfolio maken", "portfolio maker", "aangepast subdomein", "QR-code portfolio", "gratis portfolio", "portfolio sjablonen", "digitaal portfolio"],
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
        title: "Bouw je persoonlijke portfolio online - DGT Portfolio",
        description: "Geen code, geen gedoe. Bouw in enkele minuten een schoon, modern portfolio. Toon uw carrière, vaardigheden, projecten en werklinks als nooit tevoren.",
        url: "https://dgtportfolio.com/nl",
        siteName: "DGT Portfolio",
        locale: "nl_NL",
        type: "website",
        images: [
            {
                url: "https://dgtportfolio.com/logo.png",
                alt: "DGT Portfolio - Persoonlijke Portfolio Bouwer",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Bouw je persoonlijke portfolio online - DGT Portfolio",
        description: "Geen code, geen gedoe. Bouw in enkele minuten een schoon, modern portfolio.",
        images: ["https://dgtportfolio.com/logo.png"],
        creator: "@dgtportfolio",
    },
    alternates: {
        canonical: "https://dgtportfolio.com/nl",
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
        },
    },
}

export default async function Page() {
    const dict = await getDictionary('nl');
    return <LandingPage dict={dict} />
}
