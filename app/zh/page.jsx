import LandingPage from "../Components/LandingPage/LandingPage"
import { getDictionary } from "../dictionaries/get-dictionary"

export const metadata = {
    title: "在线创建您的专业作品集 - DGT Portfolio | 无需代码",
    description: "无需代码，无需麻烦。在几分钟内构建一个干净、现代的作品集。以前所未有的方式展示您的职业生涯、技能、项目和工作链接。免费试用7天。立即获取您的自定义子域名！",
    keywords: ["作品集构建器", "在线作品集", "专业作品集", "无代码作品集", "作品集网站", "创建作品集", "作品集生成器", "自定义子域名", "二维码作品集", "免费作品集", "作品集模板", "数字作品集"],
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
        title: "在线创建您的专业作品集 - DGT Portfolio",
        description: "无需代码，无需麻烦。在几分钟内构建一个干净、现代的作品集。以前所未有的方式展示您的职业生涯、技能、项目和工作链接。",
        url: "https://dgtportfolio.com/zh",
        siteName: "DGT Portfolio",
        locale: "zh_CN",
        type: "website",
        images: [
            {
                url: "https://dgtportfolio.com/logo.png",
                alt: "DGT Portfolio - 专业作品集构建器",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "在线创建您的专业作品集 - DGT Portfolio",
        description: "无需代码，无需麻烦。在几分钟内构建一个干净、现代的作品集。",
        images: ["https://dgtportfolio.com/logo.png"],
        creator: "@dgtportfolio",
    },
    alternates: {
        canonical: "https://dgtportfolio.com/zh",
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
    const dict = await getDictionary('zh');
    return <LandingPage dict={dict} />
}
