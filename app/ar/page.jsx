import LandingPage from "../Components/LandingPage/LandingPage"
import { getDictionary } from "../dictionaries/get-dictionary"

export const metadata = {
    title: "أنشئ محفظتك الرقمية الاحترافية - DGT Portfolio | بدون كود",
    description: "بدون كود، بدون تعقيدات. أنشئ محفظة رقمية احترافية نظيفة وعصرية في دقائق. اعرض مسيرتك المهنية ومهاراتك ومشاريعك وروابط أعمالك بطريقة لم تحدث من قبل. تجربة مجانية لمدة 7 أيام. احصل على نطاقك الفرعي المخصص اليوم!",
    keywords: ["محفظة رقمية", "بورتفوليو", "محفظة احترافية", "إنشاء محفظة", "محفظة بدون كود", "صفحة شخصية احترافية", "ملف تعريفي رقمي", "نطاق فرعي مخصص", "محفظة برمز QR", "محفظة مجانية", "قوالب محفظة", "سيرة ذاتية رقمية", "portfolio عربي", "موقع شخصي احترافي"],
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
        title: "أنشئ محفظتك الرقمية الاحترافية - DGT Portfolio",
        description: "بدون كود، بدون تعقيدات. أنشئ محفظة رقمية احترافية نظيفة وعصرية في دقائق. اعرض مسيرتك المهنية ومهاراتك ومشاريعك وروابط أعمالك بطريقة لم تحدث من قبل.",
        url: "https://dgtportfolio.com/ar",
        siteName: "DGT Portfolio",
        locale: "ar_AR",
        type: "website",
        images: [
            {
                url: "https://dgtportfolio.com/logo.png",
                alt: "DGT Portfolio - منصة إنشاء المحفظة الرقمية الاحترافية",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "أنشئ محفظتك الرقمية الاحترافية - DGT Portfolio",
        description: "بدون كود، بدون تعقيدات. أنشئ محفظة رقمية احترافية في دقائق.",
        images: ["https://dgtportfolio.com/logo.png"],
        creator: "@dgtportfolio",
    },
    alternates: {
        canonical: "https://dgtportfolio.com/ar",
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
    const dict = await getDictionary('ar');
    return (
        <div dir="rtl" className="min-h-screen">
            <LandingPage dict={dict} />
        </div>
    )
}