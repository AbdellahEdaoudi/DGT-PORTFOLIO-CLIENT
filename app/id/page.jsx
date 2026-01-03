import LandingPage from "../Components/LandingPage/LandingPage"
import { getDictionary } from "../dictionaries/get-dictionary"

export const metadata = {
    title: "Bangun Portofolio Pribadi Anda Secara Online - DGT Portfolio | Tanpa Kode",
    description: "Tanpa kode, tanpa repot. Buat portofolio modern dan bersih dalam hitungan menit. Tampilkan karier, keahlian, proyek, dan tautan kerja Anda dengan cara yang belum pernah ada sebelumnya. Uji coba gratis 7 hari. Dapatkan subdomain kustom Anda hari ini!",
    keywords: ["pembuat portofolio", "portofolio online", "portofolio pribadi", "portofolio tanpa kode", "situs web portofolio", "buat portofolio", "pembuat portofolio", "subdomain kustom", "portofolio kode QR", "portofolio gratis", "templat portofolio", "portofolio digital"],
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
        title: "Bangun Portofolio Pribadi Anda Secara Online - DGT Portfolio",
        description: "Tanpa kode, tanpa repot. Buat portofolio modern dan bersih dalam hitungan menit. Tampilkan karier, keahlian, proyek, dan tautan kerja Anda dengan cara yang belum pernah ada sebelumnya.",
        url: "https://dgtportfolio.com/id",
        siteName: "DGT Portfolio",
        locale: "id_ID",
        type: "website",
        images: [
            {
                url: "https://dgtportfolio.com/logo.png",
                alt: "DGT Portfolio - Pembuat Portofolio Pribadi",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Bangun Portofolio Pribadi Anda Secara Online - DGT Portfolio",
        description: "Tanpa kode, tanpa repot. Buat portofolio modern dan bersih dalam hitungan menit.",
        images: ["https://dgtportfolio.com/logo.png"],
        creator: "@dgtportfolio",
    },
    alternates: {
        canonical: "https://dgtportfolio.com/id",
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
            'id': 'https://dgtportfolio.com/id',
            'pl': 'https://dgtportfolio.com/pl',
        },
    },
}

export default async function Page() {
    const dict = await getDictionary('id');
    return <LandingPage dict={dict} />
}
