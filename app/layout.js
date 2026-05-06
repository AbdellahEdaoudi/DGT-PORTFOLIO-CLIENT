import "./globals.css";
import { Inter, Prompt } from "next/font/google";
import { MyProvider } from "./context/context";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import NextAuthProvider from "./api/auth/NextAuthProvider";
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ subsets: ['latin'] });
const prompt = Prompt({ subsets: ['latin'], weight: '400' });

export const metadata = {
  metadataBase: new URL('https://dgtportfolio.com'),
  title: "DGT Portfolio - Build Your Personal Portfolio Online",
  description: "No code, no hassle. Build a clean, modern portfolio in minutes. Showcase your career, skills, projects, and work links like never before—leave a lasting impression and unlock new opportunities.",
  keywords: ["DGT Portfolio", "Portfolio Builder", "Personal Portfolio", "Showcase Skills", "Interactive Portfolio", "No Code Portfolio"],
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "DGT Portfolio",
  },
  icons: {
    icon: "/logo.jpg",
    shortcut: "/logo.jpg",
    apple: "/logo.jpg",
  },
  openGraph: {
    title: "Build Your Personal Portfolio Online - DGT Portfolio",
    description: "No code, no hassle. Build a clean, modern portfolio in minutes. Showcase your career, skills, projects, and work links like never before—leave a lasting impression and unlock new opportunities.",
    url: "https://dgtportfolio.com",
    siteName: "DGT Portfolio",
    images: [
      {
        url: "/logo.jpg",
        alt: "DGT Portfolio Logo",
      },
    ],
    locale: "en_US",
    alternateLocales: ["fr_FR", "es_ES", "ar_AR", "de_DE", "ru_RU", "ja_JP", "zh_CN", "nl_NL", "pt_PT", "it_IT", "tr_TR", "hi_IN", "ko_KR", "sv_SE", "vi_VN"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Build Your Personal Portfolio Online - DGT Portfolio",
    description: "No code, no hassle. Build a clean, modern portfolio in minutes. Showcase your career, skills, projects, and work links like never before—leave a lasting impression and unlock new opportunities.",
    images: ["/logo.jpg"],
  },
  alternates: {
    canonical: './',
    languages: {
      'en': '/en',
      'fr': '/fr',
      'es': '/es',
      'ar': '/ar',
      'de': '/de',
      'ru': '/ru',
      'ja': '/ja',
      'zh': '/zh',
      'nl': '/nl',
      'pt': '/pt',
      'it': '/it',
      'tr': '/tr',
      'hi': '/hi',
      'ko': '/ko',
      'sv': '/sv',
      'vi': '/vi',
    },
  },
};


export default function RootLayout({ children }) {
  return (
    <html className="scroll-smooth" lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
      </head>
      <body className={`${prompt.className} min-h-screen scrollbar-none bg-gray-800 g-gradient-to-r from-blue-500 to-purple-500`}>
        {/* Structured Data Script */}
        <script
          type="application/ld+json"
          id="structured-data"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "DGT Portfolio",
                "alternateName": "DGT Portfolio Builder",
                "url": "https://dgtportfolio.com",
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": "https://dgtportfolio.com/search?q={search_term_string}",
                  "query-input": "required name=search_term_string"
                }
              },
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "DGT Portfolio",
                "url": "https://dgtportfolio.com",
                "logo": "https://dgtportfolio.com/logo.jpg",
                "sameAs": [
                  "https://twitter.com/dgtportfolio",
                  "https://www.linkedin.com/company/dgtportfolio"
                ]
              }
            ])
          }}
        />
        <NextAuthProvider>
          <MyProvider>
            {children}
          </MyProvider>
        </NextAuthProvider>
        <ToastContainer />
        <Analytics />
      </body>
    </html>
  );
}
