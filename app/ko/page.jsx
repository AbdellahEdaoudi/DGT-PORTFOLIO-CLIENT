import LandingPage from "../Components/LandingPage/LandingPage"
import { getDictionary } from "../dictionaries/get-dictionary"

export const metadata = {
    title: "온라인에서 개인 포트폴리오 만들기 - DGT Portfolio | 코딩 필요 없음",
    description: "코딩 없이, 번거로움 없이. 몇 분 만에 깔끔하고 현대적인 포트폴리오를 만드세요. 경력, 기술, 프로젝트 및 작업 링크를 이전과는 전혀 다른 방식으로 보여주세요. 7일 무료 체험. 오늘 맞춤형 서브도메인을 받으세요!",
    keywords: ["포트폴리오 빌더", "온라인 포트폴리오", "개인 포트폴리오", "노코드 포트폴리오", "포트폴리오 웹사이트", "포트폴리오 만들기", "포트폴리오 제작", "맞춤형 서브도메인", "QR 코드 포트폴리오", "무료 포트폴리오", "포트폴리오 템플릿", "디지털 포트폴리오"],
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
        title: "온라인에서 개인 포트폴리오 만들기 - DGT Portfolio",
        description: "코딩 없이, 번거로움 없이. 몇 분 만에 깔끔하고 현대적인 포트폴리오를 만드세요. 경력, 기술, 프로젝트 및 작업 링크를 이전과는 전혀 다른 방식으로 보여주세요.",
        url: "https://dgtportfolio.com/ko",
        siteName: "DGT Portfolio",
        locale: "ko_KR",
        type: "website",
        images: [
            {
                url: "https://dgtportfolio.com/logo.png",
                alt: "DGT Portfolio - 개인 포트폴리오 빌더",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "온라인에서 개인 포트폴리오 만들기 - DGT Portfolio",
        description: "코딩 없이, 번거로움 없이. 몇 분 만에 깔끔하고 현대적인 포트폴리오를 만드세요.",
        images: ["https://dgtportfolio.com/logo.png"],
        creator: "@dgtportfolio",
    },
    alternates: {
        canonical: "https://dgtportfolio.com/ko",
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
    const dict = await getDictionary('ko');
    return <LandingPage dict={dict} />
}
