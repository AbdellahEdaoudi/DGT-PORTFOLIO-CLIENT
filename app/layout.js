import "./globals.css";
import { Inter, Prompt } from "next/font/google";
import { MyProvider } from "./context/context";
import { ToastProvider } from "./components/Toast";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ['latin'] });
const prompt = Prompt({ subsets: ['latin'], weight: '400' });

export const metadata = {
  metadataBase: new URL('https://mylio.site'),
  title: "Myportfolio - Build Your Professional Online Portfolio",
  description: "Create a professional portfolio website in minutes with Myportfolio. Showcase your projects, skills, experience, services, and achievements without writing a single line of code.",
  keywords: ["Myportfolio", "Portfolio Builder", "Personal Portfolio", "Showcase Skills", "Interactive Portfolio", "No Code Portfolio"],
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Myportfolio",
  },
  icons: {
    icon: "/logo.jpg",
    shortcut: "/logo.jpg",
    apple: "/logo.jpg",
  },
  openGraph: {
    title: "Build Your Professional Online Portfolio - Myportfolio",
    description: "Create a professional portfolio website in minutes with Myportfolio. Showcase your projects, skills, experience, services, and achievements without writing a single line of code.",
    url: "https://mylio.site",
    siteName: "Myportfolio",
    images: [
      {
        url: "/logo.jpg",
        alt: "Myportfolio Logo",
      },
    ],
    locale: "en_US",
    alternateLocales: ["fr_FR", "es_ES", "ar_AR", "de_DE", "ru_RU", "ja_JP", "zh_CN", "nl_NL", "pt_PT", "it_IT", "tr_TR", "hi_IN", "ko_KR", "sv_SE", "vi_VN"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Build Your Professional Online Portfolio - Myportfolio",
    description: "Create a professional portfolio website in minutes with Myportfolio. Showcase your projects, skills, experience, services, and achievements without writing a single line of code.",
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
    <html className="scroll-smooth" lang="en" data-scroll-behavior="smooth">
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
                "name": "Myportfolio",
                "alternateName": "Myportfolio Builder",
                "url": "https://mylio.site",
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": "https://mylio.site/search?q={search_term_string}",
                  "query-input": "required name=search_term_string"
                }
              },
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "Myportfolio",
                "url": "https://mylio.site",
                "logo": "https://mylio.site/logo.jpg",
                "sameAs": [
                  "https://twitter.com/mylio",
                  "https://www.linkedin.com/company/mylio"
                ]
              }
            ])
          }}
        />
        <ToastProvider>
          <MyProvider>
            {children}
          </MyProvider>
        </ToastProvider>
        <Analytics />
      </body>
    </html>
  );
}

