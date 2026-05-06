import LandingPage from "../components/LandingPage/LandingPage"
import { getMetadata } from "../translations/metadata"


export async function generateStaticParams() {
    return [
        { lang: 'en' },
        { lang: 'es' },
        { lang: 'fr' },
        { lang: 'ar' },
        { lang: 'de' },
        { lang: 'ru' },
        { lang: 'ja' },
        { lang: 'zh' },
        { lang: 'nl' },
        { lang: 'pt' },
        { lang: 'it' },
        { lang: 'tr' },
        { lang: 'ko' },
        { lang: 'hi' },
        { lang: 'id' },
        { lang: 'pl' },
        { lang: 'sv' },
        { lang: 'vi' }
    ];
}

export async function generateMetadata(props) {
    const params = await props.params;
    const meta = await getMetadata(params.lang);

    return {
        title: meta.title,
        description: meta.description,
        keywords: meta.keywords,
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
            title: meta.openGraph.title,
            description: meta.openGraph.description,
            url: `https://dgtportfolio.com/${params.lang}`,
            siteName: meta.openGraph.siteName,
            locale: params.lang,
            type: "website",
            images: [
                {
                    url: "https://dgtportfolio.com/logo.jpg",
                    alt: "DGT Portfolio - Personal Portfolio Builder",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: meta.twitter.title,
            description: meta.twitter.description,
            images: ["https://dgtportfolio.com/logo.jpg"],
            creator: "@dgtportfolio",
        },
        alternates: {
            canonical: `https://dgtportfolio.com/${params.lang}`,
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
                'tr': 'https://dgtportfolio.com/tr',
                'ko': 'https://dgtportfolio.com/ko',
                'hi': 'https://dgtportfolio.com/hi',
                'id': 'https://dgtportfolio.com/id',
                'pl': 'https://dgtportfolio.com/pl',
            },
        },
    }
}

export default async function Page(props) {
    const params = await props.params;
    return (
        <div dir={params.lang === "ar" ? "rtl" : "ltr"}>
            <LandingPage lang={params.lang} />
        </div>
    );
}
