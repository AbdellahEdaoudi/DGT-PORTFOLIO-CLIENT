import LandingPage from "../Components/LandingPage/LandingPage"
import { getDictionary } from "../dictionaries/get-dictionary"

export const metadata = {
    title: "プロフェッショナルなポートフォリオをオンラインで作成 - DGT Portfolio | コード不要",
    description: "コード不要、手間なし。数分でクリーンでモダンなポートフォリオを構築できます。キャリア、スキル、プロジェクト、仕事のリンクをこれまでにない方法で紹介しましょう。7日間無料トライアル。今すぐカスタムサブドメインを取得！",
    keywords: ["ポートフォリオ作成", "オンラインポートフォリオ", "プロフェッショナルポートフォリオ", "コード不要ポートフォリオ", "ポートフォリオサイト", "ポートフォリオ制作", "ポートフォリオジェネレーター", "カスタムサブドメイン", "QRコードポートフォリオ", "無料ポートフォリオ", "ポートフォリオテンプレート", "デジタルポートフォリオ"],
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
        title: "プロフェッショナルなポートフォリオをオンラインで作成 - DGT Portfolio",
        description: "コード不要、手間なし。数分でクリーンでモダンなポートフォリオを構築できます。キャリア、スキル、プロジェクト、仕事のリンクをこれまでにない方法で紹介しましょう。",
        url: "https://dgtportfolio.com/ja",
        siteName: "DGT Portfolio",
        locale: "ja_JP",
        type: "website",
        images: [
            {
                url: "https://dgtportfolio.com/logo.png",
                alt: "DGT Portfolio - プロフェッショナルポートフォリオ作成ツール",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "プロフェッショナルなポートフォリオをオンラインで作成 - DGT Portfolio",
        description: "コード不要、手間なし。数分でクリーンでモダンなポートフォリオを構築できます。",
        images: ["https://dgtportfolio.com/logo.png"],
        creator: "@dgtportfolio",
    },
    alternates: {
        canonical: "https://dgtportfolio.com/ja",
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
    const dict = await getDictionary('ja');
    return <LandingPage dict={dict} />
}
