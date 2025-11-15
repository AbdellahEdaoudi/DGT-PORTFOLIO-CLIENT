import "./globals.css";
import { Inter, Prompt } from "next/font/google";
import { Toaster } from "../components/ui/sonner"
import { MyProvider } from "./Context/MyContext";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import NextAuthProvider from "./providers/NextAuthProvider";
import { Analytics } from "@vercel/analytics/react"
import Head from "next/head";
import Script from "next/script";

const inter = Inter({ subsets: ['latin'] });
const prompt = Prompt({ subsets: ['latin'], weight: '400' });

export const metadata = {
  title: "Dgt Portfolio - Build Your Professional Portfolio Online",
  description: "Showcase your skills, projects,Work Links and career with DGT Portfolio. Create interactive portfolios easily and impress potential clients or employers.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "DGT Portfolio - Build Your Professional Portfolio Online",
    description: "Showcase your skills, projects, and career with DGT Portfolio. Create interactive portfolios easily and impress potential clients or employers.",
    url: "https://dgtportfolio.com",
    images: ["/logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "DGT Portfolio - Build Your Professional Portfolio Online",
    description: "Showcase your skills, projects, and career with DGT Portfolio. Create interactive portfolios easily and impress potential clients or employers.",
    images: ["/logo.png"],
  },
};


export default function RootLayout({ children }) {
  return (
      <html className="scroll-smooth" lang="en">
        <Head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
        <Script type="application/ld+json" id="structured-data">
        {`
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "DGT Portfolio",
          "url": "https://dgtportfolio.com",
          "keywords": "DGT Portfolio, Portfolio Builder, Professional Portfolio, Showcase Skills, Interactive Portfolio",
          "description": "Build your professional portfolio with DGT Portfolio. Showcase your skills, work links, projects, and interactive portfolios easily."
        }
        `}
        </Script>
        </Head>
        <body className={`${prompt.className} min-h-screen scrollbar-none bg-gray-800 g-gradient-to-r from-blue-500 to-purple-500`}>
        <NextAuthProvider>
          <MyProvider>
            {children}
        </MyProvider>
        </NextAuthProvider>
          <Toaster />
          <ToastContainer />
        <Analytics />
        </body>
      </html>
  );
}
