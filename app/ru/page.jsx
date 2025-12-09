import LandingPage from "../Components/LandingPage/LandingPage"
import { getDictionary } from "../dictionaries/get-dictionary"

export const metadata = {
    title: "Создайте свое персональное портфолио онлайн - DGT Portfolio | Без кода",
    description: "Без кода, без хлопот. Создайте чистое, современное портфолио за считанные минуты. Продемонстрируйте свою карьеру, навыки, проекты и рабочие ссылки как никогда раньше. Бесплатная 7-дневная пробная версия. Получите свой персональный поддомен сегодня!",
    keywords: ["создатель портфолио", "онлайн портфолио", "персональное портфолио", "портфолио без кода", "сайт портфолио", "создать портфолио", "генератор портфолио", "персональный поддомен", "портфолио QR-код", "бесплатное портфолио", "шаблоны портфолио", "цифровое портфолио"],
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
        title: "Создайте свое персональное портфолио онлайн - DGT Portfolio",
        description: "Без кода, без хлопот. Создайте чистое, современное портфолио за считанные минуты. Продемонстрируйте свою карьеру, навыки, проекты и рабочие ссылки как никогда раньше.",
        url: "https://dgtportfolio.com/ru",
        siteName: "DGT Portfolio",
        locale: "ru_RU",
        type: "website",
        images: [
            {
                url: "https://dgtportfolio.com/logo.png",
                alt: "DGT Portfolio - Персональный создатель портфолио",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Создайте свое персональное портфолио онлайн - DGT Portfolio",
        description: "Без кода, без хлопот. Создайте чистое, современное портфолио за считанные минуты.",
        images: ["https://dgtportfolio.com/logo.png"],
        creator: "@dgtportfolio",
    },
    alternates: {
        canonical: "https://dgtportfolio.com/ru",
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
    const dict = await getDictionary('ru');
    return <LandingPage dict={dict} />
}
