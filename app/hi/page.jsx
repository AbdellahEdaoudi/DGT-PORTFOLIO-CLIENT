import LandingPage from "../Components/LandingPage/LandingPage"
import { getDictionary } from "../dictionaries/get-dictionary"

export const metadata = {
    title: "अपना व्यक्तिगत पोर्टफोलियो ऑनलाइन बनाएं - DGT Portfolio | कोई कोड आवश्यक नहीं",
    description: "कोई कोड नहीं, कोई परेशानी नहीं। मिनटों में एक स्वच्छ, आधुनिक पोर्टफोलियो बनाएं। अपने करियर, कौशल, परियोजनाओं और काम के लिंक को पहले की तरह प्रदर्शित करें। 7 दिनों के लिए नि: शुल्क परीक्षण। आज ही अपना कस्टम सबडोमेन प्राप्त करें!",
    keywords: ["पोर्टफोलियो बिल्डर", "ऑनलाइन पोर्टफोलियो", "व्यक्तिगत पोर्टफोलियो", "नो कोड पोर्टफोलियो", "पोर्टफोलियो वेबसाइट", "पोर्टफोलियो बनाएं", "पोर्टफोलियो निर्माता", "कस्टम सबडोमेन", "क्यूआर कोड पोर्टफोलियो", "नि: शुल्क पोर्टफोलियो", "पोर्टफोलियो टेम्प्लेट", "डिजिटल पोर्टफोलियो"],
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
        title: "अपना व्यक्तिगत पोर्टफोलियो ऑनलाइन बनाएं - DGT Portfolio",
        description: "कोई कोड नहीं, कोई परेशानी नहीं। मिनटों में एक स्वच्छ, आधुनिक पोर्टफोलियो बनाएं। अपने करियर, कौशल, परियोजनाओं और काम के लिंक को पहले की तरह प्रदर्शित करें।",
        url: "https://dgtportfolio.com/hi",
        siteName: "DGT Portfolio",
        locale: "hi_IN",
        type: "website",
        images: [
            {
                url: "https://dgtportfolio.com/logo.png",
                alt: "DGT Portfolio - व्यक्तिगत पोर्टफोलियो निर्माता",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "अपना व्यक्तिगत पोर्टफोलियो ऑनलाइन बनाएं - DGT Portfolio",
        description: "कोई कोड नहीं, कोई परेशानी नहीं। मिनटों में एक स्वच्छ, आधुनिक पोर्टफोलियो बनाएं।",
        images: ["https://dgtportfolio.com/logo.png"],
        creator: "@dgtportfolio",
    },
    alternates: {
        canonical: "https://dgtportfolio.com/hi",
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
    const dict = await getDictionary('hi');
    return <LandingPage dict={dict} />
}
