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
            url: `https://mylio.site/${params.lang}`,
            siteName: meta.openGraph.siteName,
            locale: params.lang,
            type: "website",
            images: [
                {
                    url: "https://mylio.site/logo.jpg",
                    alt: "DGT Portfolio - Personal Portfolio Builder",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: meta.twitter.title,
            description: meta.twitter.description,
            images: ["https://mylio.site/logo.jpg"],
            creator: "@dgtportfolio",
        },
        alternates: {
            canonical: `https://mylio.site/${params.lang}`,
            languages: {
                'en': 'https://mylio.site/en',
                'es': 'https://mylio.site/es',
                'fr': 'https://mylio.site/fr',
                'ar': 'https://mylio.site/ar',
                'de': 'https://mylio.site/de',
                'ru': 'https://mylio.site/ru',
                'ja': 'https://mylio.site/ja',
                'zh': 'https://mylio.site/zh',
                'nl': 'https://mylio.site/nl',
                'pt': 'https://mylio.site/pt',
                'it': 'https://mylio.site/it',
                'tr': 'https://mylio.site/tr',
                'ko': 'https://mylio.site/ko',
                'hi': 'https://mylio.site/hi',
                'id': 'https://mylio.site/id',
                'pl': 'https://mylio.site/pl',
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
