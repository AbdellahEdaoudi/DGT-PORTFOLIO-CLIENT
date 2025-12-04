import LandingPage from "../Components/LandingPage/LandingPage"
import { getDictionary } from "../dictionaries/get-dictionary"

export const metadata = {
    title: "Build Your Professional Portfolio Online - DGT Portfolio | No Code Required",
    description: "No code, no hassle. Build a clean, modern portfolio in minutes. Showcase your career, skills, projects, and work links like never before. Free 7-day trial. Get your custom subdomain today!",
    keywords: ["portfolio builder", "online portfolio", "professional portfolio", "no code portfolio", "portfolio website", "create portfolio", "portfolio maker", "custom subdomain", "QR code portfolio", "free portfolio", "portfolio templates", "digital portfolio"],
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
        title: "Build Your Professional Portfolio Online - DGT Portfolio",
        description: "No code, no hassle. Build a clean, modern portfolio in minutes. Showcase your career, skills, projects, and work links like never before.",
        url: "https://dgtportfolio.com/en",
        siteName: "DGT Portfolio",
        locale: "en_US",
        type: "website",
        images: [
            {
                url: "https://dgtportfolio.com/logo.png",
                alt: "DGT Portfolio - Professional Portfolio Builder",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Build Your Professional Portfolio Online - DGT Portfolio",
        description: "No code, no hassle. Build a clean, modern portfolio in minutes.",
        images: ["https://dgtportfolio.com/logo.png"],
        creator: "@dgtportfolio",
    },
    alternates: {
        canonical: "https://dgtportfolio.com/en",
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
    const dict = await getDictionary('en');
    return <LandingPage dict={dict} />
}
