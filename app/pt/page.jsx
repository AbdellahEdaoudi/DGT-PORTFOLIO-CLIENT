import LandingPage from "../Components/LandingPage/LandingPage"
import { getDictionary } from "../dictionaries/get-dictionary"

export const metadata = {
    title: "Construa seu portfólio pessoal online - DGT Portfolio | Sem código",
    description: "Sem código, sem complicações. Crie um portfólio moderno e limpo em minutos. Mostre sua carreira, habilidades, projetos e links de trabalho como nunca antes. Teste grátis por 7 dias. Obtenha seu subdomínio personalizado hoje!",
    keywords: ["criador de portfólio", "portfólio online", "portfólio pessoal", "portfólio sem código", "site de portfólio", "criar portfólio", "gerador de portfólio", "subdomínio personalizado", "portfólio com código QR", "portfólio gratuito", "modelos de portfólio", "portfólio digital"],
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
        title: "Construa seu portfólio pessoal online - DGT Portfolio",
        description: "Sem código, sem complicações. Crie um portfólio moderno e limpo em minutos. Mostre sua carreira, habilidades, projetos e links de trabalho como nunca antes.",
        url: "https://dgtportfolio.com/pt",
        siteName: "DGT Portfolio",
        locale: "pt_BR",
        type: "website",
        images: [
            {
                url: "https://dgtportfolio.com/logo.png",
                alt: "DGT Portfolio - Criador de Portfólio Pessoal",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Construa seu portfólio pessoal online - DGT Portfolio",
        description: "Sem código, sem complicações. Crie um portfólio moderno e limpo em minutos.",
        images: ["https://dgtportfolio.com/logo.png"],
        creator: "@dgtportfolio",
    },
    alternates: {
        canonical: "https://dgtportfolio.com/pt",
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
    const dict = await getDictionary('pt');
    return <LandingPage dict={dict} />
}
