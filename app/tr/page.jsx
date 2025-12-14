import LandingPage from "../Components/LandingPage/LandingPage"
import { getDictionary } from "../dictionaries/get-dictionary"

export const metadata = {
    title: "Kişisel Portföyünüzü Çevrimiçi Oluşturun - DGT Portfolio | Kodlama Gerekmez",
    description: "Kod yok, uğraş yok. Dakikalar içinde temiz, modern bir portföy oluşturun. Kariyerinizi, becerilerinizi, projelerinizi ve iş bağlantılarınızı daha önce hiç olmadığı gibi sergileyin. 7 gün ücretsiz deneyin. Özel alt alan adınızı bugün alın!",
    keywords: ["portföy oluşturucu", "çevrimiçi portföy", "kişisel portföy", "kodsuz portföy", "portföy web sitesi", "portföy oluştur", "portföy yapıcı", "özel alt alan adı", "QR kod portföyü", "ücretsiz portföy", "portföy şablonları", "dijital portföy"],
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
        title: "Kişisel Portföyünüzü Çevrimiçi Oluşturun - DGT Portfolio",
        description: "Kod yok, uğraş yok. Dakikalar içinde temiz, modern bir portföy oluşturun. Kariyerinizi, becerilerinizi, projelerinizi ve iş bağlantılarınızı daha önce hiç olmadığı gibi sergileyin.",
        url: "https://dgtportfolio.com/tr",
        siteName: "DGT Portfolio",
        locale: "tr_TR",
        type: "website",
        images: [
            {
                url: "https://dgtportfolio.com/logo.png",
                alt: "DGT Portfolio - Kişisel Portföy Oluşturucu",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Kişisel Portföyünüzü Çevrimiçi Oluşturun - DGT Portfolio",
        description: "Kod yok, uğraş yok. Dakikalar içinde temiz, modern bir portföy oluşturun.",
        images: ["https://dgtportfolio.com/logo.png"],
        creator: "@dgtportfolio",
    },
    alternates: {
        canonical: "https://dgtportfolio.com/tr",
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
    const dict = await getDictionary('tr');
    return <LandingPage dict={dict} />
}
